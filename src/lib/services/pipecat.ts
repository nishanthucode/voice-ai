import { transcribeAudio } from './deepgram';
import { synthesizeSpeech } from './elevenlabs';
import { geminiService } from './gemini';

export interface PipecatSessionConfig {
  sessionId: string;
  businessId: string;
  workflowId: string;
  language: 'en' | 'hi';
  sttModel: string;
  ttsVoiceId: string;
}

export class PipecatOrchestrator {
  public getSessionConfig(businessId: string, workflowId: string, language: 'en' | 'hi' = 'en'): PipecatSessionConfig {
    return {
      sessionId: `pipe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      businessId,
      workflowId,
      language,
      sttModel: language === 'hi' ? 'deepgram-nova-2-general-hi' : 'deepgram-nova-2-general-en',
      ttsVoiceId: language === 'hi' ? 'eleven_multilingual_v2_hindi' : '21m00Tcm4TlvDq8ikWAM', // Rachel
    };
  }

  /**
   * Local Node-based Pipeline Simulation
   * Uses our wrapper services to process an audio chunk through STT -> LLM -> TTS
   */
  public async processAudioStream(
    audioChunk: Uint8Array,
    config: PipecatSessionConfig,
    business: any,
    workflow: any,
    history: any[]
  ): Promise<{ audio: Uint8Array; text: string }> {
    // 1. STT (Deepgram)
    const userText = await transcribeAudio(audioChunk);
    
    // 2. LLM (Gemini)
    const turnResult = await geminiService.processTurn(
      config.sessionId,
      business,
      workflow,
      workflow.fields || [],
      workflow.conditions || [],
      history,
      userText,
      config.language
    );

    // 3. TTS (ElevenLabs)
    const audioResponse = await synthesizeSpeech(turnResult.reply, config.ttsVoiceId);

    return {
      audio: audioResponse,
      text: turnResult.reply,
    };
  }
}

export const pipecatOrchestrator = new PipecatOrchestrator();

