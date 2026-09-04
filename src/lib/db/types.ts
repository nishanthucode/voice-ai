export type TriggerType = 'MISSED_CALL' | 'MANUAL_SIMULATION' | 'INBOUND_CALL';
export type FieldDataType = 'string' | 'number' | 'date' | 'time' | 'datetime' | 'boolean' | 'enum';
export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'greater_than' 
  | 'less_than' 
  | 'before' 
  | 'after' 
  | 'within_hours' 
  | 'is_true' 
  | 'is_false';

export type ActionType = 
  | 'create_customer_enquiry'
  | 'calendar_check_availability'
  | 'calendar_create_event'
  | 'calendar_update_event'
  | 'calendar_cancel_event'
  | 'update_follow_up_status'
  | 'set_priority';

export type ConversationStatus = 'ACTIVE' | 'COMPLETED' | 'TERMINATED' | 'FAILED';
export type PriorityLevel = 'normal' | 'high' | 'urgent';
export type FollowUpStatus = 'pending' | 'contacted' | 'completed' | 'closed';

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  business_type: string;
  phone_number: string;
  address: string;
  timezone: string;
  default_language: 'en' | 'hi';
  created_at: string;
  updated_at: string;
}

export interface WorkflowField {
  id: string;
  workflow_id: string;
  name: string;
  label: string;
  question: string;
  data_type: FieldDataType;
  required: boolean;
  order_index: number;
  validation_config?: {
    options?: string[];
    min?: number;
    max?: number;
    pattern?: string;
  };
  created_at: string;
}

export interface WorkflowCondition {
  id: string;
  workflow_id: string;
  field_name: string;
  operator: ConditionOperator;
  comparison_value: string;
  action_config: {
    set_priority?: PriorityLevel;
    trigger_action?: ActionType;
    custom_message?: string;
  };
  created_at: string;
}

export interface WorkflowAction {
  id: string;
  workflow_id: string;
  action_type: ActionType;
  configuration: Record<string, any>;
  order_index: number;
  enabled: boolean;
}

export interface Workflow {
  id: string;
  business_id: string;
  name: string;
  description: string;
  trigger_type: TriggerType;
  greeting: string;
  closing_message: string;
  language: 'en' | 'hi';
  active: boolean;
  fields?: WorkflowField[];
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  business_id: string;
  workflow_id: string;
  caller_name: string;
  phone_number: string;
  intent: string;
  language: 'en' | 'hi';
  status: ConversationStatus;
  priority: PriorityLevel;
  summary: string;
  action_status: string;
  follow_up_status: FollowUpStatus;
  started_at: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationField {
  id: string;
  conversation_id: string;
  field_name: string;
  value: any;
  confidence: number;
  source: 'extracted' | 'user_input' | 'system';
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ToolCall {
  id: string;
  conversation_id: string;
  tool_name: string;
  arguments: Record<string, any>;
  result?: Record<string, any>;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

export interface CalendarConnection {
  id: string;
  business_id: string;
  google_account_email: string;
  refresh_token: string;
  calendar_id: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  business_id: string;
  conversation_id?: string;
  google_event_id: string;
  status: 'confirmed' | 'cancelled' | 'tentative';
  start_time: string;
  end_time: string;
  title: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CallRecord {
  id: string;
  business_id: string;
  conversation_id?: string;
  provider: 'telnyx' | 'simulator';
  provider_call_id: string;
  direction: 'inbound' | 'outbound_callback';
  status: 'RECEIVED' | 'MISSED' | 'CALLBACK_QUEUED' | 'CALLBACK_INITIATED' | 'CONNECTED' | 'AI_CONVERSATION' | 'COMPLETED' | 'NO_ANSWER' | 'CALLBACK_FAILED' | 'FAILED';
  from_number: string;
  to_number: string;
  started_at: string;
  ended_at?: string;
  failure_reason?: string;
  created_at: string;
}
