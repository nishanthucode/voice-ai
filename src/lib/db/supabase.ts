import { createClient } from '@supabase/supabase-js';
import { 
  Business, Workflow, WorkflowField, WorkflowCondition, 
  WorkflowAction, Conversation, ConversationField, Message, 
  ToolCall, CalendarConnection, CalendarEvent, CallRecord 
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// --- IN-MEMORY DATABASE STORE FOR DEMO & FALLBACK RUNTIMES ---

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz_bakery_01',
    owner_id: 'user_demo_01',
    name: 'Sweet Moments Bakery',
    business_type: 'Cake Shop & Confectionery',
    phone_number: '+19402781962',
    address: '124 Baker Street, Suite A, San Francisco, CA',
    timezone: 'America/Los_Angeles',
    default_language: 'en',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'biz_realty_02',
    owner_id: 'user_demo_01',
    name: 'Apex Horizon Realty',
    business_type: 'Real Estate Brokerage',
    phone_number: '+1 (555) 987-6543',
    address: '888 Grand Avenue, Penthouse 4, New York, NY',
    timezone: 'America/New_York',
    default_language: 'en',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'biz_clinic_03',
    owner_id: 'user_demo_01',
    name: 'City Care Health Clinic',
    business_type: 'Medical Clinic & Doctor Practice',
    phone_number: '+1 (555) 456-7890',
    address: '450 Health Way, Suite 200, Chicago, IL',
    timezone: 'America/Chicago',
    default_language: 'en',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  }
];

export const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'wf_cake_order_01',
    business_id: 'biz_bakery_01',
    name: 'Cake Order Enquiry',
    description: 'Generic AI assistant for missed bakery calls to gather custom cake details and schedule pickup/delivery.',
    trigger_type: 'MISSED_CALL',
    greeting: 'Hello! Thanks for reaching out to Sweet Moments Bakery. I saw we missed your call. How can I help with your custom cake order or inquiry today?',
    closing_message: 'Thank you! We have captured all your cake details. Our head baker will confirm your order shortly!',
    language: 'en',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'wf_realty_lead_02',
    business_id: 'biz_realty_02',
    name: 'Real Estate Lead Qualification',
    description: 'Generic AI receptionist to qualify home buyers, renters, and sellers after a missed call.',
    trigger_type: 'MISSED_CALL',
    greeting: 'Hello! Apex Horizon Realty missed your call. I am the AI property assistant. Are you looking to buy, rent, sell, or schedule a site visit today?',
    closing_message: 'Great! We have recorded your preferences and arranged your agent callback/site visit request.',
    language: 'en',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'wf_clinic_appt_03',
    business_id: 'biz_clinic_03',
    name: 'Clinic Appointment Booking',
    description: 'Generic AI receptionist for medical clinics to handle missed calls, collect patient info, and schedule doctor appointments.',
    trigger_type: 'MISSED_CALL',
    greeting: 'Hello, thank you for calling City Care Health Clinic. We missed your call! Are you calling to book a doctor appointment or for a general medical inquiry?',
    closing_message: 'Thank you! Your appointment request has been scheduled with our doctor and added to our calendar.',
    language: 'en',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  }
];

export const INITIAL_FIELDS: WorkflowField[] = [
  // Cake Shop Fields
  {
    id: 'f_cake_01',
    workflow_id: 'wf_cake_order_01',
    name: 'caller_name',
    label: 'Customer Name',
    question: 'May I know your full name please?',
    data_type: 'string',
    required: true,
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_cake_02',
    workflow_id: 'wf_cake_order_01',
    name: 'cake_type',
    label: 'Cake Category',
    question: 'What kind of cake are you looking for? (e.g. Birthday, Wedding, Anniversary, Custom)',
    data_type: 'string',
    required: true,
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_cake_03',
    workflow_id: 'wf_cake_order_01',
    name: 'flavour',
    label: 'Flavour',
    question: 'What flavour would you like for the cake?',
    data_type: 'string',
    required: true,
    order_index: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_cake_04',
    workflow_id: 'wf_cake_order_01',
    name: 'weight',
    label: 'Weight / Size',
    question: 'What weight or size do you need? (e.g. 1 kg, 2 kg, 2-tier)',
    data_type: 'string',
    required: true,
    order_index: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_cake_05',
    workflow_id: 'wf_cake_order_01',
    name: 'required_date',
    label: 'Required Date & Time',
    question: 'For which date and time do you need this cake?',
    data_type: 'datetime',
    required: true,
    order_index: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_cake_06',
    workflow_id: 'wf_cake_order_01',
    name: 'delivery_or_pickup',
    label: 'Delivery or Pickup',
    question: 'Would you prefer doorstep delivery or store pickup?',
    data_type: 'enum',
    required: true,
    order_index: 6,
    validation_config: { options: ['Delivery', 'Pickup'] },
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_cake_07',
    workflow_id: 'wf_cake_order_01',
    name: 'delivery_address',
    label: 'Delivery Address',
    question: 'What is the full delivery address?',
    data_type: 'string',
    required: false,
    order_index: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_cake_08',
    workflow_id: 'wf_cake_order_01',
    name: 'custom_message',
    label: 'Custom Cake Message',
    question: 'Is there any custom message or inscription on the cake?',
    data_type: 'string',
    required: false,
    order_index: 8,
    created_at: new Date().toISOString(),
  },

  // Real Estate Fields
  {
    id: 'f_realty_01',
    workflow_id: 'wf_realty_lead_02',
    name: 'caller_name',
    label: 'Client Name',
    question: 'May I get your name, please?',
    data_type: 'string',
    required: true,
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_realty_02',
    workflow_id: 'wf_realty_lead_02',
    name: 'property_type',
    label: 'Property Type',
    question: 'What type of property are you interested in? (e.g., 2BHK Apartment, Villa, Commercial Office)',
    data_type: 'string',
    required: true,
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_realty_03',
    workflow_id: 'wf_realty_lead_02',
    name: 'preferred_location',
    label: 'Preferred Location / Area',
    question: 'Which area or neighborhood do you prefer?',
    data_type: 'string',
    required: true,
    order_index: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_realty_04',
    workflow_id: 'wf_realty_lead_02',
    name: 'budget',
    label: 'Budget Range',
    question: 'What is your approximate budget range?',
    data_type: 'string',
    required: true,
    order_index: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_realty_05',
    workflow_id: 'wf_realty_lead_02',
    name: 'preferred_visit_datetime',
    label: 'Preferred Visit Date & Time',
    question: 'When would you like to schedule a site visit or consultation?',
    data_type: 'datetime',
    required: false,
    order_index: 5,
    created_at: new Date().toISOString(),
  },

  // Clinic / Doctor Practice Fields
  {
    id: 'f_clinic_01',
    workflow_id: 'wf_clinic_appt_03',
    name: 'caller_name',
    label: 'Patient Name',
    question: 'May I know the patient full name, please?',
    data_type: 'string',
    required: true,
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_clinic_02',
    workflow_id: 'wf_clinic_appt_03',
    name: 'doctor_department',
    label: 'Doctor / Speciality Department',
    question: 'Which doctor or department do you wish to consult with? (e.g. General Physician, Cardiology, Pediatrics, Dental)',
    data_type: 'string',
    required: true,
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_clinic_03',
    workflow_id: 'wf_clinic_appt_03',
    name: 'symptom_reason',
    label: 'Reason for Visit / Symptoms',
    question: 'Could you briefly describe your symptoms or reason for the visit?',
    data_type: 'string',
    required: true,
    order_index: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'f_clinic_04',
    workflow_id: 'wf_clinic_appt_03',
    name: 'preferred_appointment_datetime',
    label: 'Preferred Appointment Date & Time',
    question: 'What date and time would work best for your clinic appointment?',
    data_type: 'datetime',
    required: true,
    order_index: 4,
    created_at: new Date().toISOString(),
  }
];

export const INITIAL_CONDITIONS: WorkflowCondition[] = [
  {
    id: 'cond_cake_01',
    workflow_id: 'wf_cake_order_01',
    field_name: 'required_date',
    operator: 'within_hours',
    comparison_value: '24',
    action_config: {
      set_priority: 'urgent',
      custom_message: 'Flagged as URGENT because order is required within 24 hours!'
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'cond_realty_01',
    workflow_id: 'wf_realty_lead_02',
    field_name: 'budget',
    operator: 'contains',
    comparison_value: '1M',
    action_config: {
      set_priority: 'high',
      custom_message: 'High priority lead detected.'
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'cond_clinic_01',
    workflow_id: 'wf_clinic_appt_03',
    field_name: 'symptom_reason',
    operator: 'contains',
    comparison_value: 'emergency',
    action_config: {
      set_priority: 'urgent',
      custom_message: 'Flagged as URGENT medical condition!'
    },
    created_at: new Date().toISOString(),
  }
];

export const INITIAL_ACTIONS: WorkflowAction[] = [
  {
    id: 'act_cake_01',
    workflow_id: 'wf_cake_order_01',
    action_type: 'create_customer_enquiry',
    configuration: { auto_assign: true },
    order_index: 1,
    enabled: true,
  },
  {
    id: 'act_cake_02',
    workflow_id: 'wf_cake_order_01',
    action_type: 'calendar_check_availability',
    configuration: { calendar_id: 'primary' },
    order_index: 2,
    enabled: true,
  },
  {
    id: 'act_realty_01',
    workflow_id: 'wf_realty_lead_02',
    action_type: 'create_customer_enquiry',
    configuration: { notify_agent: true },
    order_index: 1,
    enabled: true,
  },
  {
    id: 'act_realty_02',
    workflow_id: 'wf_realty_lead_02',
    action_type: 'calendar_create_event',
    configuration: { event_title: 'Site Visit Confirmation' },
    order_index: 2,
    enabled: true,
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_demo_01',
    business_id: 'biz_bakery_01',
    workflow_id: 'wf_cake_order_01',
    caller_name: 'Sarah Jenkins',
    phone_number: '+1 (555) 321-7654',
    intent: 'Order Birthday Cake',
    language: 'en',
    status: 'COMPLETED',
    priority: 'urgent',
    summary: 'Sarah requested a 2 kg Belgian Chocolate Birthday Cake for delivery tomorrow at 3 PM to 450 Market St. Flagged urgent due to 24hr deadline.',
    action_status: 'Customer enquiry logged & Calendar slot verified',
    follow_up_status: 'pending',
    started_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    ended_at: new Date(Date.now() - 3600000 * 2 + 180000).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'conv_demo_02',
    business_id: 'biz_realty_02',
    workflow_id: 'wf_realty_lead_02',
    caller_name: 'David Miller',
    phone_number: '+1 (555) 888-4321',
    intent: 'Schedule Site Visit for 3BHK',
    language: 'en',
    status: 'COMPLETED',
    priority: 'high',
    summary: 'David wants to buy a 3BHK Luxury Apartment in Midtown Manhattan with a budget around $1.5M. Scheduled site visit on Friday at 10 AM.',
    action_status: 'Google Calendar Event Created',
    follow_up_status: 'contacted',
    started_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    ended_at: new Date(Date.now() - 86400000 * 1 + 240000).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

export const INITIAL_CONVERSATION_FIELDS: ConversationField[] = [
  { id: 'cf_1', conversation_id: 'conv_demo_01', field_name: 'caller_name', value: 'Sarah Jenkins', confidence: 0.99, source: 'extracted', created_at: new Date().toISOString() },
  { id: 'cf_2', conversation_id: 'conv_demo_01', field_name: 'cake_type', value: 'Birthday Cake', confidence: 0.98, source: 'extracted', created_at: new Date().toISOString() },
  { id: 'cf_3', conversation_id: 'conv_demo_01', field_name: 'flavour', value: 'Belgian Dark Chocolate', confidence: 0.97, source: 'extracted', created_at: new Date().toISOString() },
  { id: 'cf_4', conversation_id: 'conv_demo_01', field_name: 'weight', value: '2 kg', confidence: 0.99, source: 'extracted', created_at: new Date().toISOString() },
  { id: 'cf_5', conversation_id: 'conv_demo_01', field_name: 'required_date', value: new Date(Date.now() + 18 * 3600000).toISOString(), confidence: 0.95, source: 'extracted', created_at: new Date().toISOString() },
  { id: 'cf_6', conversation_id: 'conv_demo_01', field_name: 'delivery_or_pickup', value: 'Delivery', confidence: 1.0, source: 'extracted', created_at: new Date().toISOString() },
  
  { id: 'cf_7', conversation_id: 'conv_demo_02', field_name: 'caller_name', value: 'David Miller', confidence: 0.99, source: 'extracted', created_at: new Date().toISOString() },
  { id: 'cf_8', conversation_id: 'conv_demo_02', field_name: 'property_type', value: '3BHK Luxury Apartment', confidence: 0.97, source: 'extracted', created_at: new Date().toISOString() },
  { id: 'cf_9', conversation_id: 'conv_demo_02', field_name: 'preferred_location', value: 'Midtown Manhattan', confidence: 0.98, source: 'extracted', created_at: new Date().toISOString() },
  { id: 'cf_10', conversation_id: 'conv_demo_02', field_name: 'budget', value: '$1.5M', confidence: 0.99, source: 'extracted', created_at: new Date().toISOString() },
  { id: 'cf_11', conversation_id: 'conv_demo_02', field_name: 'preferred_visit_datetime', value: new Date(Date.now() + 48 * 3600000).toISOString(), confidence: 0.96, source: 'extracted', created_at: new Date().toISOString() },
];

export const INITIAL_MESSAGES: Message[] = [
  { id: 'm_1', conversation_id: 'conv_demo_01', role: 'assistant', content: 'Hello! Thanks for reaching out to Sweet Moments Bakery. I saw we missed your call. How can I help with your custom cake order or inquiry today?', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'm_2', conversation_id: 'conv_demo_01', role: 'user', content: 'Hi, I missed a call from you guys. I want to order a 2kg Belgian dark chocolate birthday cake for tomorrow afternoon.', timestamp: new Date(Date.now() - 7180000).toISOString() },
  { id: 'm_3', conversation_id: 'conv_demo_01', role: 'assistant', content: 'That sounds delicious! I have recorded a 2 kg Belgian Dark Chocolate Birthday Cake for tomorrow. May I know your name and whether you prefer store pickup or home delivery?', timestamp: new Date(Date.now() - 7160000).toISOString() },
  { id: 'm_4', conversation_id: 'conv_demo_01', role: 'user', content: 'My name is Sarah Jenkins. Please deliver it to 450 Market St around 3 PM.', timestamp: new Date(Date.now() - 7140000).toISOString() },
  { id: 'm_5', conversation_id: 'conv_demo_01', role: 'assistant', content: 'Thank you Sarah! I have logged your order for delivery tomorrow at 3 PM to 450 Market St. Because this is within 24 hours, I have marked this as urgent for our head baker to confirm immediately. Have a wonderful day!', timestamp: new Date(Date.now() - 7120000).toISOString() },

  { id: 'm_6', conversation_id: 'conv_demo_02', role: 'assistant', content: 'Hello! Apex Horizon Realty missed your call. I am the AI property assistant. Are you looking to buy, rent, sell, or schedule a site visit today?', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'm_7', conversation_id: 'conv_demo_02', role: 'user', content: 'Hi, I called earlier. I am looking to buy a 3BHK luxury apartment in Midtown Manhattan with a budget around $1.5 million.', timestamp: new Date(Date.now() - 86380000).toISOString() },
  { id: 'm_8', conversation_id: 'conv_demo_02', role: 'assistant', content: 'Great choice! May I ask your full name and when you would be available for a site visit with our senior real estate agent?', timestamp: new Date(Date.now() - 86360000).toISOString() },
  { id: 'm_9', conversation_id: 'conv_demo_02', role: 'user', content: 'I am David Miller. Can we do Friday at 10 AM?', timestamp: new Date(Date.now() - 86340000).toISOString() },
  { id: 'm_10', conversation_id: 'conv_demo_02', role: 'assistant', content: 'Checking calendar availability... Friday at 10 AM is available! I have scheduled your site visit and created a calendar event. An agent will meet you at the property. Thank you David!', timestamp: new Date(Date.now() - 86320000).toISOString() },
];

export const INITIAL_TOOL_CALLS: ToolCall[] = [
  {
    id: 'tc_1',
    conversation_id: 'conv_demo_01',
    tool_name: 'create_customer_enquiry',
    arguments: { caller_name: 'Sarah Jenkins', order_type: 'Delivery', item: '2kg Belgian Chocolate Cake', deadline: 'Tomorrow 3 PM' },
    result: { status: 'SUCCESS', enquiry_id: 'ENQ-9901' },
    status: 'SUCCESS',
    started_at: new Date(Date.now() - 7130000).toISOString(),
    completed_at: new Date(Date.now() - 7125000).toISOString(),
  },
  {
    id: 'tc_2',
    conversation_id: 'conv_demo_02',
    tool_name: 'create_calendar_event',
    arguments: { title: 'Site Visit: David Miller - Midtown 3BHK', start_time: '2026-09-05T10:00:00Z', end_time: '2026-09-05T11:00:00Z', attendee: 'David Miller' },
    result: { status: 'SUCCESS', google_event_id: 'g_evt_88329102' },
    status: 'SUCCESS',
    started_at: new Date(Date.now() - 86330000).toISOString(),
    completed_at: new Date(Date.now() - 86325000).toISOString(),
  }
];

export const INITIAL_CALL_RECORDS: CallRecord[] = [
  {
    id: 'call_1',
    business_id: 'biz_bakery_01',
    conversation_id: 'conv_demo_01',
    provider: 'twilio',
    provider_call_id: 'CA_tw_99812401',
    direction: 'outbound_callback',
    status: 'COMPLETED',
    from_number: '+1 (555) 234-5678',
    to_number: '+1 (555) 321-7654',
    started_at: new Date(Date.now() - 7200000).toISOString(),
    ended_at: new Date(Date.now() - 7120000).toISOString(),
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'call_2',
    business_id: 'biz_realty_02',
    conversation_id: 'conv_demo_02',
    provider: 'twilio',
    provider_call_id: 'CA_tw_55410932',
    direction: 'outbound_callback',
    status: 'COMPLETED',
    from_number: '+1 (555) 987-6543',
    to_number: '+1 (555) 888-4321',
    started_at: new Date(Date.now() - 86400000).toISOString(),
    ended_at: new Date(Date.now() - 86320000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const INITIAL_CALENDAR_CONNECTIONS: CalendarConnection[] = [
  {
    id: 'cal_conn_01',
    business_id: 'biz_bakery_01',
    google_account_email: 'sweetmoments.bakery@gmail.com',
    refresh_token: 'mock_google_refresh_token_bakery',
    calendar_id: 'primary',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cal_conn_02',
    business_id: 'biz_realty_02',
    google_account_email: 'leads@apexhorizonrealty.com',
    refresh_token: 'mock_google_refresh_token_realty',
    calendar_id: 'primary',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// In-Memory Repository Manager (Persists in Node memory during runtime)
class LocalDbRepository {
  public businesses: Business[] = [...INITIAL_BUSINESSES];
  public workflows: Workflow[] = [...INITIAL_WORKFLOWS];
  public fields: WorkflowField[] = [...INITIAL_FIELDS];
  public conditions: WorkflowCondition[] = [...INITIAL_CONDITIONS];
  public actions: WorkflowAction[] = [...INITIAL_ACTIONS];
  public conversations: Conversation[] = [...INITIAL_CONVERSATIONS];
  public conversationFields: ConversationField[] = [...INITIAL_CONVERSATION_FIELDS];
  public messages: Message[] = [...INITIAL_MESSAGES];
  public toolCalls: ToolCall[] = [...INITIAL_TOOL_CALLS];
  public callRecords: CallRecord[] = [...INITIAL_CALL_RECORDS];
  public calendarConnections: CalendarConnection[] = [...INITIAL_CALENDAR_CONNECTIONS];
  public calendarEvents: CalendarEvent[] = [];

  public getBusiness(id: string): Business | undefined {
    return this.businesses.find(b => b.id === id);
  }

  public getWorkflowsByBusiness(businessId: string): Workflow[] {
    return this.workflows.filter(w => w.business_id === businessId);
  }

  public getWorkflowWithDetails(workflowId: string): Workflow | undefined {
    const wf = this.workflows.find(w => w.id === workflowId);
    if (!wf) return undefined;
    return {
      ...wf,
      fields: this.fields.filter(f => f.workflow_id === workflowId).sort((a, b) => a.order_index - b.order_index),
      conditions: this.conditions.filter(c => c.workflow_id === workflowId),
      actions: this.actions.filter(a => a.workflow_id === workflowId).sort((a, b) => a.order_index - b.order_index),
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Use‑Case Helpers
  // ──────────────────────────────────────────────────────────────
  public useCases: { id: string; business_id: string; name: string; trigger: string }[] = [];
  public simulations: { id: string; workflow_id: string; input: Record<string, any> }[] = [];
  public createUseCase(data: { business_id: string; name: string; trigger: string }): { id: string; business_id: string; name: string; trigger: string } {
    const newUC = {
      id: `uc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      business_id: data.business_id,
      name: data.name,
      trigger: data.trigger,
    };
    this.useCases.unshift(newUC);
    return newUC;
  }

  public getUseCasesByBusiness(businessId: string) {
    return this.useCases.filter(uc => uc.business_id === businessId);
  }

  // ──────────────────────────────────────────────────────────────
  // Simulation Helpers
  // ──────────────────────────────────────────────────────────────
  public createSimulation(data: { workflow_id: string; input: Record<string, any> }) {
    const sim = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      workflow_id: data.workflow_id,
      input: data.input,
    };
    this.simulations.unshift(sim);
    return sim;
  }

  public getSimulation(id: string) {
    return this.simulations.find(s => s.id === id);
  }

  // Existing conversation creator (unchanged)
  public createConversation(data: Partial<Conversation>): Conversation {
    const newConv: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      business_id: data.business_id || 'biz_bakery_01',
      workflow_id: data.workflow_id || 'wf_cake_order_01',
      caller_name: data.caller_name || 'Guest Caller',
      phone_number: data.phone_number || '+1 (555) 000-0000',
      intent: data.intent || 'General Inquiry',
      language: data.language || 'en',
      status: data.status || 'ACTIVE',
      priority: data.priority || 'normal',
      summary: data.summary || 'Conversation initiated.',
      action_status: data.action_status || 'In Progress',
      follow_up_status: data.follow_up_status || 'pending',
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.conversations.unshift(newConv);
    return newConv;
  }

  public updateConversation(id: string, updates: Partial<Conversation>): Conversation | undefined {
    const idx = this.conversations.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.conversations[idx] = {
      ...this.conversations[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.conversations[idx];
  }

  public addMessage(conversationId: string, role: Message['role'], content: string, metadata?: Record<string, any>): Message {
    const msg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversation_id: conversationId,
      role,
      content,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.messages.push(msg);
    return msg;
  }

  public saveConversationField(conversationId: string, fieldName: string, value: any, confidence = 0.95): ConversationField {
    const existingIdx = this.conversationFields.findIndex(cf => cf.conversation_id === conversationId && cf.field_name === fieldName);
    if (existingIdx !== -1) {
      this.conversationFields[existingIdx] = {
        ...this.conversationFields[existingIdx],
        value,
        confidence,
      };
      return this.conversationFields[existingIdx];
    }

    const cf: ConversationField = {
      id: `cf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversation_id: conversationId,
      field_name: fieldName,
      value,
      confidence,
      source: 'extracted',
      created_at: new Date().toISOString(),
    };
    this.conversationFields.push(cf);
    return cf;
  }

  public addToolCall(conversationId: string, toolName: string, args: Record<string, any>): ToolCall {
    const tc: ToolCall = {
      id: `tc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversation_id: conversationId,
      tool_name: toolName,
      arguments: args,
      status: 'PENDING',
      started_at: new Date().toISOString(),
    };
    this.toolCalls.unshift(tc);
    return tc;
  }

  public completeToolCall(id: string, result: Record<string, any>, status: 'SUCCESS' | 'FAILED' = 'SUCCESS', errorMessage?: string): ToolCall | undefined {
    const tc = this.toolCalls.find(t => t.id === id);
    if (!tc) return undefined;
    tc.status = status;
    tc.result = result;
    tc.error_message = errorMessage;
    tc.completed_at = new Date().toISOString();
    return tc;
  }

  public getConversationFullDetails(conversationId: string) {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) return null;
    const business = this.businesses.find(b => b.id === conversation.business_id);
    const workflow = this.getWorkflowWithDetails(conversation.workflow_id);
    const fields = this.conversationFields.filter(cf => cf.conversation_id === conversationId);
    const messages = this.messages.filter(m => m.conversation_id === conversationId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const toolCalls = this.toolCalls.filter(tc => tc.conversation_id === conversationId);
    const calls = this.callRecords.filter(cr => cr.conversation_id === conversationId);

    return {
      conversation,
      business,
      workflow,
      fields,
      messages,
      toolCalls,
      calls,
    };
  }
}

// Global Singleton for runtime persistence across API requests in hot-reloading Next.js dev server
const globalForDb = global as unknown as { localDbRepository?: LocalDbRepository };
export const dbRepo = globalForDb.localDbRepository || new LocalDbRepository();
if (process.env.NODE_NODE_ENV !== 'production') globalForDb.localDbRepository = dbRepo;
