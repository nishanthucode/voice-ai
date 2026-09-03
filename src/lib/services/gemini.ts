import { GoogleGenAI } from '@google/genai';
import { Business, Workflow, WorkflowField, WorkflowCondition, Message } from '../db/types';
import { buildSystemPrompt } from '../engine/prompt-builder';
import { extractFieldsFromText } from '../engine/field-extractor';
import { evaluateConditions, ConditionEvaluationResult } from '../engine/conditions';
import { TOOL_REGISTRY } from '../tools/registry';
import { dbRepo } from '../db/supabase';

export interface GeminiEngineResponse {
  reply: string;
  extractedFields: Record<string, any>;
  conditionsEvaluated: ConditionEvaluationResult[];
  toolCallsExecuted: any[];
  isCompleted: boolean;
  priority: 'normal' | 'high' | 'urgent';
  summary: string;
  intent: string;
}

export class GeminiService {
  private apiKey: string;
  private ai: GoogleGenAI | null = null;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  public async processTurn(
    conversationId: string,
    business: Business,
    workflow: Workflow,
    fields: WorkflowField[],
    conditions: WorkflowCondition[],
    history: Message[],
    userMessageText: string,
    language: 'en' | 'hi' = 'en'
  ): Promise<GeminiEngineResponse> {
    // 1. Gather existing captured fields
    const currentConvFields = dbRepo.conversationFields
      .filter(cf => cf.conversation_id === conversationId)
      .reduce((acc, cf) => {
        acc[cf.field_name] = cf.value;
        return acc;
      }, {} as Record<string, any>);

    // 2. Extract fields from user message
    const newlyExtracted = extractFieldsFromText(userMessageText, fields, currentConvFields);

    // Save newly extracted fields to DB repo
    Object.entries(newlyExtracted).forEach(([k, v]) => {
      dbRepo.saveConversationField(conversationId, k, v);
    });

    // 3. Evaluate workflow conditions
    const conditionResults = evaluateConditions(conditions, newlyExtracted);
    let currentPriority: 'normal' | 'high' | 'urgent' = 'normal';
    conditionResults.forEach(c => {
      if (c.matched && c.priorityOverride) {
        currentPriority = c.priorityOverride;
      }
    });

    // 4. Build system prompt
    const systemPrompt = buildSystemPrompt({
      business,
      workflow,
      fields,
      extractedFields: newlyExtracted,
      language,
    });

    let assistantReply = '';
    const toolCallsExecuted: any[] = [];

    // 5. Try real Gemini API if key is present, else standard intelligent fallback
    if (this.ai && this.apiKey) {
      try {
        const toolsConfig = Object.values(TOOL_REGISTRY).map(t => ({
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        }));

        const contents = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          ...history.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          { role: 'user', parts: [{ text: userMessageText }] },
        ];

        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents as any,
          config: {
            temperature: 0.3,
            maxOutputTokens: 500,
          },
        });

        assistantReply = response.text || '';

        // Handle tool call requests if present in functionCalls
        const candidate = response.candidates?.[0];
        const functionCalls = candidate?.content?.parts?.filter(p => p.functionCall)?.map(p => p.functionCall);

        if (functionCalls && functionCalls.length > 0) {
          for (const call of functionCalls) {
            if (call && call.name && TOOL_REGISTRY[call.name]) {
              const toolDef = TOOL_REGISTRY[call.name];
              const result = await toolDef.execute(business.id, conversationId, call.args || {});
              toolCallsExecuted.push({ name: call.name, args: call.args, result });

              // Follow-up call to Gemini with tool result
              const toolFollowUp = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                  ...contents as any,
                  { role: 'model', parts: [{ functionCall: call }] },
                  { role: 'user', parts: [{ functionResponse: { name: call.name, response: result } }] },
                ],
              });
              assistantReply = toolFollowUp.text || assistantReply;
            }
          }
        }
      } catch (err: any) {
        console.error('Gemini API execution warning (using intelligent fallback):', err.message);
        assistantReply = this.generateFallbackResponse(userMessageText, newlyExtracted, fields, workflow, language);
      }
    } else {
      assistantReply = this.generateFallbackResponse(userMessageText, newlyExtracted, fields, workflow, language);
    }

    // 6. Check tool execution needs if user specifically requested scheduling/calendar
    if (toolCallsExecuted.length === 0) {
      const lowerUser = userMessageText.toLowerCase();
      if (lowerUser.includes('visit') || lowerUser.includes('appointment') || lowerUser.includes('book') || lowerUser.includes('schedule')) {
        const callerName = newlyExtracted.caller_name || 'Customer';
        const targetDateStr = newlyExtracted.required_date || newlyExtracted.preferred_visit_datetime || new Date(Date.now() + 86400000 * 2).toISOString();
        const endDateStr = new Date(new Date(targetDateStr).getTime() + 3600000).toISOString();

        // 1. Check availability tool
        const availCheck = await TOOL_REGISTRY.check_calendar_availability.execute(business.id, conversationId, {
          start_time: targetDateStr,
          end_time: endDateStr,
        });

        // 2. Create calendar event tool
        const evtRes = await TOOL_REGISTRY.create_calendar_event.execute(business.id, conversationId, {
          title: `${workflow.name}: ${callerName}`,
          start_time: targetDateStr,
          end_time: endDateStr,
          attendee_name: callerName,
        });

        toolCallsExecuted.push(
          { name: 'check_calendar_availability', args: { start_time: targetDateStr }, result: availCheck },
          { name: 'create_calendar_event', args: { title: `${workflow.name}: ${callerName}` }, result: evtRes }
        );
      }
    }

    // 7. Check if all required fields captured
    const missingReq = fields.filter(f => f.required && !newlyExtracted[f.name]);
    const isCompleted = missingReq.length === 0;

    // 8. Generate Summary & Intent
    const intent = newlyExtracted.cake_type || newlyExtracted.property_type || workflow.name;
    const summary = `${newlyExtracted.caller_name || 'Customer'} called regarding ${intent}. ${
      Object.keys(newlyExtracted).length > 0 ? `Captured details: ${Object.entries(newlyExtracted).map(([k, v]) => `${k}=${v}`).join(', ')}.` : ''
    } ${toolCallsExecuted.length > 0 ? `Executed tools: ${toolCallsExecuted.map(t => t.name).join(', ')}.` : ''}`;

    return {
      reply: assistantReply,
      extractedFields: newlyExtracted,
      conditionsEvaluated: conditionResults,
      toolCallsExecuted,
      isCompleted,
      priority: currentPriority,
      summary,
      intent,
    };
  }

  private generateFallbackResponse(
    userText: string,
    extracted: Record<string, any>,
    fields: WorkflowField[],
    workflow: Workflow,
    language: 'en' | 'hi'
  ): string {
    const isHindi = language === 'hi';
    const missingReq = fields.filter(f => f.required && !extracted[f.name]);

    if (missingReq.length === 0) {
      return isHindi
        ? `बहुत बहुत धन्यवाद ${extracted.caller_name || ''}! आपकी सभी जानकारी दर्ज कर ली गई है। ${workflow.closing_message}`
        : `Thank you so much ${extracted.caller_name || ''}! We have captured all your required details. ${workflow.closing_message}`;
    }

    const nextField = missingReq[0];
    if (isHindi) {
      if (nextField.name === 'caller_name') return 'क्या मैं आपका शुभ नाम जान सकता हूँ?';
      if (nextField.name === 'cake_type') return 'आपको किस प्रकार का केक चाहिए? (जैसे बर्थडे, वेडिंग या कस्टम केक)';
      if (nextField.name === 'flavour') return 'आप केक का कौन सा स्वाद (Flavour) पसंद करेंगे?';
      if (nextField.name === 'weight') return 'आपको कितना वजन या साइज चाहिए? (जैसे 1 kg या 2 kg)';
      if (nextField.name === 'required_date') return 'आपको यह केक किस तारीख और समय पर चाहिए?';
      if (nextField.name === 'delivery_or_pickup') return 'क्या आप होम डिलीवरी चाहेंगे या स्टोर से पिकअप करेंगे?';
      if (nextField.name === 'property_type') return 'आप किस तरह की प्रॉपर्टी तलाश कर रहे हैं? (जैसे 2BHK, 3BHK या विला)';
      if (nextField.name === 'preferred_location') return 'आपकी पसंदीदा लोकेशन या इलाका कौन सा है?';
      if (nextField.name === 'budget') return 'आपका अनुमानित बजट range क्या है?';
      return nextField.question;
    } else {
      return `Got it! ${nextField.question}`;
    }
  }
}

export const geminiService = new GeminiService();
