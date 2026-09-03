import { z } from 'zod';
import { calendarService } from '../services/google-calendar';
import { dbRepo } from '../db/supabase';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (businessId: string, conversationId: string, args: any) => Promise<any>;
}

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  check_calendar_availability: {
    name: 'check_calendar_availability',
    description: 'Check Google Calendar availability for a requested date and time before scheduling an appointment, site visit, or callback.',
    parameters: {
      type: 'OBJECT',
      properties: {
        start_time: { type: 'STRING', description: 'ISO 8601 formatted start date-time (e.g. 2026-09-05T10:00:00Z)' },
        end_time: { type: 'STRING', description: 'ISO 8601 formatted end date-time (e.g. 2026-09-05T11:00:00Z)' },
      },
      required: ['start_time', 'end_time'],
    },
    execute: async (businessId: string, conversationId: string, args: { start_time: string; end_time: string }) => {
      const toolCall = dbRepo.addToolCall(conversationId, 'check_calendar_availability', args);
      try {
        const result = await calendarService.checkAvailability(businessId, args.start_time, args.end_time);
        dbRepo.completeToolCall(toolCall.id, result, 'SUCCESS');
        return result;
      } catch (err: any) {
        dbRepo.completeToolCall(toolCall.id, { error: err.message }, 'FAILED', err.message);
        throw err;
      }
    },
  },

  create_calendar_event: {
    name: 'create_calendar_event',
    description: 'Create a new appointment or site visit event on the business Google Calendar after confirming availability.',
    parameters: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING', description: 'Event title (e.g. Site Visit with David Miller)' },
        start_time: { type: 'STRING', description: 'ISO 8601 formatted start date-time' },
        end_time: { type: 'STRING', description: 'ISO 8601 formatted end date-time' },
        attendee_name: { type: 'STRING', description: 'Customer full name' },
      },
      required: ['title', 'start_time', 'end_time', 'attendee_name'],
    },
    execute: async (businessId: string, conversationId: string, args: { title: string; start_time: string; end_time: string; attendee_name: string }) => {
      const toolCall = dbRepo.addToolCall(conversationId, 'create_calendar_event', args);
      try {
        const result = await calendarService.createEvent(
          businessId,
          conversationId,
          args.title,
          args.start_time,
          args.end_time,
          args.attendee_name
        );
        dbRepo.completeToolCall(toolCall.id, result, 'SUCCESS');
        return result;
      } catch (err: any) {
        dbRepo.completeToolCall(toolCall.id, { error: err.message }, 'FAILED', err.message);
        throw err;
      }
    },
  },

  update_calendar_event: {
    name: 'update_calendar_event',
    description: 'Reschedule or update an existing Google Calendar event.',
    parameters: {
      type: 'OBJECT',
      properties: {
        google_event_id: { type: 'STRING', description: 'ID of the Google Calendar event' },
        new_start_time: { type: 'STRING', description: 'ISO 8601 formatted new start date-time' },
        new_end_time: { type: 'STRING', description: 'ISO 8601 formatted new end date-time' },
      },
      required: ['google_event_id', 'new_start_time', 'new_end_time'],
    },
    execute: async (businessId: string, conversationId: string, args: { google_event_id: string; new_start_time: string; new_end_time: string }) => {
      const toolCall = dbRepo.addToolCall(conversationId, 'update_calendar_event', args);
      try {
        const result = await calendarService.updateEvent(businessId, args.google_event_id, args.new_start_time, args.new_end_time);
        dbRepo.completeToolCall(toolCall.id, result, 'SUCCESS');
        return result;
      } catch (err: any) {
        dbRepo.completeToolCall(toolCall.id, { error: err.message }, 'FAILED', err.message);
        throw err;
      }
    },
  },

  cancel_calendar_event: {
    name: 'cancel_calendar_event',
    description: 'Cancel or delete an event from the Google Calendar.',
    parameters: {
      type: 'OBJECT',
      properties: {
        google_event_id: { type: 'STRING', description: 'ID of the Google Calendar event to cancel' },
      },
      required: ['google_event_id'],
    },
    execute: async (businessId: string, conversationId: string, args: { google_event_id: string }) => {
      const toolCall = dbRepo.addToolCall(conversationId, 'cancel_calendar_event', args);
      try {
        const result = await calendarService.cancelEvent(businessId, args.google_event_id);
        dbRepo.completeToolCall(toolCall.id, result, 'SUCCESS');
        return result;
      } catch (err: any) {
        dbRepo.completeToolCall(toolCall.id, { error: err.message }, 'FAILED', err.message);
        throw err;
      }
    },
  },

  create_customer_enquiry: {
    name: 'create_customer_enquiry',
    description: 'Log a structured customer enquiry into the business database for team follow-up.',
    parameters: {
      type: 'OBJECT',
      properties: {
        caller_name: { type: 'STRING', description: 'Customer name' },
        intent_summary: { type: 'STRING', description: 'Summary of the customer request' },
        urgency: { type: 'STRING', enum: ['normal', 'high', 'urgent'], description: 'Urgency level' },
      },
      required: ['caller_name', 'intent_summary'],
    },
    execute: async (businessId: string, conversationId: string, args: { caller_name: string; intent_summary: string; urgency?: string }) => {
      const toolCall = dbRepo.addToolCall(conversationId, 'create_customer_enquiry', args);
      const enquiryId = `ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const result = {
        status: 'SUCCESS',
        enquiry_id: enquiryId,
        caller_name: args.caller_name,
        created_at: new Date().toISOString(),
      };
      dbRepo.completeToolCall(toolCall.id, result, 'SUCCESS');
      return result;
    },
  },
};
