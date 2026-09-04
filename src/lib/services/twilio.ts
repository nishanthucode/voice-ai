import twilio from 'twilio';
import { dbRepo } from '../db/supabase';
import { CallRecord } from '../db/types';

export class TwilioService {
  private accountSid: string;
  private authToken: string;
  private phoneNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  public handleMissedCallWebhook(params: {
    CallSid: string;
    From: string;
    To: string;
    CallStatus: string;
    BusinessId?: string;
  }): CallRecord {
    // Check idempotency with Provider Call ID
    const existing = dbRepo.callRecords.find(c => c.provider_call_id === params.CallSid);
    if (existing) {
      existing.status = 'MISSED';
      return existing;
    }

    const business = dbRepo.businesses.find(b => b.id === (params.BusinessId || 'biz_bakery_01')) || dbRepo.businesses[0];

    // Create Call Record
    const record: CallRecord = {
      id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      business_id: business.id,
      provider: 'telnyx',
      provider_call_id: params.CallSid,
      direction: 'inbound',
      status: 'MISSED',
      from_number: params.From || '+15550001111',
      to_number: params.To || this.phoneNumber || '+15552345678',
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    dbRepo.callRecords.unshift(record);
    return record;
  }

  public async initiateCallback(callRecordId: string): Promise<{ success: boolean; callSid?: string; message: string }> {
    const callRecord = dbRepo.callRecords.find(c => c.id === callRecordId);
    if (!callRecord) {
      return { success: false, message: 'Call record not found.' };
    }

    callRecord.status = 'CALLBACK_QUEUED';

    if (!this.accountSid || !this.authToken) {
      // Demo / Simulator Mode Execution
      callRecord.status = 'CONNECTED';
      
      // Create conversation
      const conversation = dbRepo.createConversation({
        business_id: callRecord.business_id,
        workflow_id: dbRepo.getWorkflowsByBusiness(callRecord.business_id)[0]?.id || 'wf_cake_order_01',
        caller_name: 'Incoming Phone Caller',
        phone_number: callRecord.from_number,
        status: 'ACTIVE',
      });

      callRecord.conversation_id = conversation.id;
      callRecord.status = 'AI_CONVERSATION';

      return {
        success: true,
        callSid: `CA_demo_${Date.now()}`,
        message: 'Callback successfully simulated! Telephony credentials missing in .env, switched to demo mode.',
      };
    }

    try {
      const client = twilio(this.accountSid, this.authToken);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      const call = await client.calls.create({
        to: callRecord.from_number,
        from: this.phoneNumber,
        url: `${appUrl}/api/calls/voice-twiml?business_id=${callRecord.business_id}`,
      });

      callRecord.status = 'CALLBACK_INITIATED';
      callRecord.provider_call_id = call.sid;

      return {
        success: true,
        callSid: call.sid,
        message: 'Twilio callback initiated successfully.',
      };
    } catch (err: any) {
      console.error('Twilio Call Initiation Error:', err);
      callRecord.status = 'CALLBACK_FAILED';
      callRecord.failure_reason = err.message;
      return {
        success: false,
        message: `Twilio call failed: ${err.message}`,
      };
    }
  }
}

export const twilioService = new TwilioService();
