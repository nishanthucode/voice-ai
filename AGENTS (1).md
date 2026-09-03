# AGENTS.md — Missed Call AI Assistant Platform

## 1. Project Mission

Build a production-minded MVP of a generic AI receptionist platform for small businesses.

The platform handles missed customer calls by automatically initiating an AI callback, conducting a configurable conversation, collecting structured information, applying workflow conditions, using approved external tools such as Google Calendar, and saving the complete interaction to a business dashboard.

The product MUST NOT be hardcoded for one industry.

The same core workflow engine and AI agent must support:
- Cake shops
- Real-estate agencies
- Clinics
- Delivery businesses
- Repair services
- Other small businesses

For the submission, implement two complete demo workflows:
1. Cake Shop — Cake Order Enquiry
2. Real Estate — Lead Qualification / Site Visit

These are configurations of the generic platform, not separate application implementations.

---

## 2. Current Product Decisions

Use these decisions unless the human explicitly changes them:

- Frontend: Next.js + TypeScript
- Backend: Node.js / Next.js server-side APIs
- Styling: Tailwind CSS
- Database: PostgreSQL through Supabase
- AI: Gemini 3
- Voice orchestration: Pipecat
- Telephony: Twilio
- STT: Deepgram
- TTS: ElevenLabs
- Calendar: Google Calendar API
- Deployment: Vercel for web/API; use a separately deployable long-running voice worker for Pipecat if required
- Languages: English + Hindi
- Authentication: simple email/password demo authentication
- Architecture: multi-business
- Required external integration: Google Calendar
- WhatsApp: NOT part of this version; do not implement it
- Real phone-call flow: required
- Text simulator: required as a reliable fallback/demo surface

Do not introduce another major framework or provider without a clear technical reason.

---

## 3. Non-Negotiable Architecture Principle

The application is a generic workflow platform.

DO NOT implement:

- `CakeShopAgent`
- `RealEstateAgent`
- `CakeShopController`
- `RealEstateController`
- industry-specific hardcoded conversation trees
- `if businessType === "cake"` scattered through the application
- separate duplicated implementations for each industry

Instead implement:

Business
  -> Workflow
  -> Generic Conversation Agent
  -> Dynamic Fields
  -> Dynamic Conditions
  -> Dynamic Actions
  -> Approved Tools

A new business type should be addable primarily by creating a new workflow configuration, not by rewriting the AI engine.

If business-specific rules are necessary, represent them as workflow configuration/data wherever practical.

---

## 4. Build Strategy

Do NOT attempt the entire application in one giant change.

Work in phases and keep the application runnable after every phase.

Recommended implementation order:

### Phase 0 — Inspect and plan
- Inspect repository structure.
- Check existing package.json, configuration, source code, database configuration, and environment files.
- Do not overwrite existing working code unnecessarily.
- Identify the minimum changes required.
- Create a concise implementation plan before large changes.

### Phase 1 — Foundation
- Next.js application structure
- Tailwind UI foundation
- Supabase connection
- Database schema/migrations
- Seed/demo data
- Demo authentication
- Environment variable handling

### Phase 2 — Business + Workflow Builder
- Business profiles
- Multi-business data model
- Workflow CRUD
- Dynamic fields
- Required/optional fields
- Greeting/closing messages
- Conditions
- Actions
- Workflow validation

### Phase 3 — Text Conversation Engine
- Generic Gemini agent
- Dynamic workflow loading
- Conversation state
- Structured field extraction
- Required-field tracking
- Intent detection
- Conditions
- Action execution
- Conversation persistence
- Transcript persistence

The text simulator should become the primary reliable end-to-end test surface before voice is attempted.

### Phase 4 — Google Calendar
Implement all four tools:
- check availability
- create event
- update/reschedule event
- cancel/delete event

Implement Google OAuth per business.

The AI must decide when an approved Calendar tool is required through tool/function calling.

### Phase 5 — Dashboard
- Conversation list
- Conversation detail
- Captured fields
- Summary
- Intent
- Priority
- Workflow
- Action performed
- Follow-up status
- Transcript
- Contacted/completed/closed actions
- Tool-call audit trail

### Phase 6 — Telephony + Voice
- Twilio incoming call webhook
- Missed-call detection/lifecycle
- Callback initiation
- Pipecat integration
- Deepgram STT
- Gemini conversation
- ElevenLabs TTS
- Voice conversation persistence
- Failure/retry handling

Do not make the voice layer the only way to test the agent.

### Phase 7 — Hindi
- English
- Hindi
- Language-aware workflow prompts
- Language-aware questions
- Conversation language persistence
- Robust handling of Hindi input/output
- Optional automatic language detection if stable

Do not duplicate the workflow engine per language.

### Phase 8 — Polish + Submission
- responsive UI
- loading/error/empty states
- security review
- README
- architecture diagram
- database schema documentation
- `.env.example`
- demo credentials documentation
- deployment
- demo script
- final requirement checklist

---

## 5. Core Domain Model

The database should conceptually contain:

### businesses
- id
- owner/user id
- name
- business_type
- phone_number
- address
- timezone
- default_language
- created_at
- updated_at

### workflows
- id
- business_id
- name
- description
- trigger_type
- greeting
- closing_message
- language
- active
- created_at
- updated_at

### workflow_fields
- id
- workflow_id
- name
- label
- question
- data_type
- required
- order_index
- validation_config
- created_at

### workflow_conditions
- id
- workflow_id
- field_name
- operator
- comparison_value
- result/action configuration
- created_at

### workflow_actions
- id
- workflow_id
- action_type
- configuration
- order_index
- enabled

### conversations
- id
- business_id
- workflow_id
- caller_name
- phone_number
- intent
- language
- status
- priority
- summary
- action_status
- follow_up_status
- started_at
- ended_at
- created_at
- updated_at

### conversation_fields
- id
- conversation_id
- field_name
- value
- confidence
- source
- created_at

### messages
- id
- conversation_id
- role
- content
- timestamp
- metadata

### tool_calls
- id
- conversation_id
- tool_name
- arguments
- result
- status
- error_message
- started_at
- completed_at

### calendar_connections
- id
- business_id
- Google account identifier
- encrypted token/reference
- calendar_id
- created_at
- updated_at

### calendar_events
- id
- business_id
- conversation_id
- google_event_id
- status
- start_time
- end_time
- title
- metadata
- created_at
- updated_at

### call_records
- id
- business_id
- conversation_id
- provider
- provider_call_id
- direction
- status
- from_number
- to_number
- started_at
- ended_at
- failure_reason
- created_at

Use foreign keys and indexes appropriately.

Never expose OAuth secrets/tokens to the browser.

---

## 6. Multi-Tenant / Multi-Business Rules

The system must support multiple businesses.

A user may own/manage multiple businesses.

Every business-scoped record must be associated with `business_id` directly or through a safe parent relationship.

Never allow one business to read another business's:
- conversations
- workflows
- customers
- calendar connections
- call records
- tool results

Validate ownership on the server for every business-scoped mutation and read.

Do not trust a `business_id` supplied by the client without checking authorization.

If Supabase Row Level Security is used, configure policies consistently with the application authorization model.

---

## 7. Workflow Engine

A workflow is data.

Conceptual shape:

```ts
type Workflow = {
  id: string
  businessId: string
  name: string
  triggerType: "MISSED_CALL"
  greeting: string
  fields: WorkflowField[]
  conditions: WorkflowCondition[]
  actions: WorkflowAction[]
  closingMessage: string
  language: "en" | "hi"
}
```

Fields must support at minimum:
- string
- number
- date
- time
- datetime
- boolean
- enum/select

A field must be able to specify:
- human-readable label
- AI question
- required/optional
- validation
- order

The agent should ask one useful question at a time and avoid asking for information already captured.

If a required field is missing, the agent should continue collecting it unless the conversation is terminated.

The engine, not the model alone, must determine whether required workflow fields are complete.

---

## 8. Conditions

Implement a small, predictable condition engine.

Support useful operators such as:
- equals
- not_equals
- contains
- greater_than
- less_than
- before
- after
- within_hours
- is_true
- is_false

Example:

```text
IF required_date is within 24 hours
THEN priority = urgent
ELSE priority = normal
```

Conditions must be evaluated using structured conversation state.

Do not rely on parsing arbitrary prose from the LLM to determine priority.

---

## 9. Action System

Actions should be represented as controlled application actions.

Initial supported action types:

- create_customer_enquiry
- calendar_check_availability
- calendar_create_event
- calendar_update_event
- calendar_cancel_event
- update_follow_up_status
- set_priority

WhatsApp is intentionally excluded.

Actions should execute through backend services/tools.

The LLM may request an action through approved function/tool calling, but it must never execute arbitrary code or arbitrary database queries.

---

## 10. Gemini Agent Rules

Gemini is the conversational reasoning layer.

The agent receives:
- business information
- active workflow
- workflow fields
- field descriptions/questions
- conditions
- allowed actions/tools
- conversation history
- current structured conversation state
- supported languages

The prompt must not contain hardcoded Cake Shop or Real Estate behavior.

The agent should:
- be concise and natural
- ask one question at a time
- acknowledge answers naturally
- avoid repeating already-known information
- extract structured values
- respect required/optional fields
- use tools only when necessary
- never invent tool results
- never claim an action succeeded until the backend tool reports success
- clearly communicate tool failures
- avoid medical advice because the current demo does not implement a clinic workflow
- avoid making up prices, availability, properties, or business policies

Use Gemini's supported structured/function/tool calling capabilities rather than asking the model to emit fragile pseudo-JSON when a native mechanism is available.

Keep model-specific code isolated in an AI service/module so the provider can be replaced later.

---

## 11. Tool Calling

Create a centralized tool registry.

Initial tools:

```text
check_calendar_availability
create_calendar_event
update_calendar_event
cancel_calendar_event
create_customer_enquiry
```

Every tool must have:
- name
- description
- typed input schema
- authorization check
- implementation
- typed result
- error handling
- logging/audit record

Tool flow:

Customer
 -> Gemini
 -> tool request
 -> server validates tool + business authorization
 -> service executes
 -> tool result
 -> Gemini
 -> customer response

Never:
- execute arbitrary function names supplied by the model
- allow the model to choose arbitrary URLs
- allow arbitrary SQL
- expose service credentials to Gemini/browser
- trust tool arguments without validation

---

## 12. Google Calendar

Google Calendar is a mandatory REAL integration.

Each business must be able to connect its own Google Calendar through OAuth.

Implement:
1. Check availability
2. Create event
3. Update/reschedule event
4. Cancel/delete event

The agent should decide when Calendar is needed.

Example:

Customer:
"I want a callback tomorrow at 4 PM."

Flow:

1. Extract requested date/time.
2. Validate timezone.
3. Call `check_calendar_availability`.
4. If available, tell customer and request confirmation when workflow requires confirmation.
5. On confirmation, call `create_calendar_event`.
6. Store Google event ID.
7. Confirm only after successful tool response.
8. Persist tool call and action outcome.

For rescheduling:
1. Identify the existing event.
2. Check the new requested time.
3. Update event only after the appropriate confirmation.

For cancellation:
1. Identify the event.
2. Confirm cancellation if required.
3. Delete/cancel the event.
4. Report the real result.

Store timestamps in UTC where practical and render them in the business timezone.

Never put Google client secrets or refresh tokens in frontend code.

OAuth tokens must be stored securely.

---

## 13. Telephony

Use Twilio for real phone-number handling.

Target lifecycle:

```text
Customer calls business number
        ↓
Twilio receives call
        ↓
Call is not answered / missed
        ↓
Twilio webhook
        ↓
Create/update call record
        ↓
Queue/initiate callback
        ↓
Pipecat voice session
        ↓
AI conversation
        ↓
Actions
        ↓
Conversation + transcript saved
```

Implement explicit call states, including useful failure states.

Suggested states:

- RECEIVED
- MISSED
- CALLBACK_QUEUED
- CALLBACK_INITIATED
- CONNECTED
- AI_CONVERSATION
- COMPLETED
- NO_ANSWER
- CALLBACK_FAILED
- FAILED

Use Twilio provider IDs for idempotency.

Do not assume webhooks are delivered exactly once.

Webhook handlers must be safe to retry.

Validate provider webhook signatures where supported.

Do not expose Twilio credentials to the client.

---

## 14. Pipecat Voice Architecture

Pipecat is the real-time voice orchestration layer.

Target pipeline:

```text
Twilio
  ↓
Pipecat
  ↓
Deepgram STT
  ↓
Gemini 3
  ↓
Tool calls / application services
  ↓
ElevenLabs TTS
  ↓
Pipecat
  ↓
Twilio
  ↓
Customer
```

The Pipecat runtime may require a long-running process and should not be forced into a Vercel serverless function.

Use Vercel for the web application and suitable APIs.

Deploy the Pipecat worker separately if required by the chosen runtime/hosting architecture.

The voice layer must reuse the same generic conversation/workflow engine as the text simulator wherever practical.

Do not create a second independent AI logic implementation for voice.

---

## 15. STT/TTS

STT:
- Deepgram

TTS:
- ElevenLabs

Requirements:
- English support
- Hindi support
- preserve selected/current conversation language
- handle transcription errors gracefully
- do not save sensitive provider credentials client-side

If Hindi voice quality or provider limitations require a fallback, isolate provider-specific code behind interfaces.

---

## 16. Text Simulator

A text simulator is mandatory and should be highly reliable.

UI:

```text
Workflow: [select workflow]
Language: [English / Hindi]

AI message
Customer input
Send
Reset conversation
```

The simulator must use the real conversation engine and tool layer, not a fake hardcoded chat.

Include a visible debug/developer panel in development mode that can show:
- extracted fields
- current workflow state
- tool calls
- tool results
- condition evaluations

Do not expose internal chain-of-thought.

Show structured tool/activity events, not hidden reasoning.

---

## 17. Cake Shop Demo Workflow

Create a seeded workflow called:

`Cake Order Enquiry`

Trigger:
`MISSED_CALL`

Opening:
A friendly missed-call callback greeting.

Intent options:
- order a cake
- general enquiry

Collect:
- cake_type — required
- flavour — required
- weight — required
- required_date — required
- custom_message — optional
- delivery_or_pickup — required
- delivery_address — required if delivery
- budget — optional
- caller_name — required
- preferred_callback_time — optional

Condition:

```text
IF required_date is within 24 hours
THEN priority = urgent
ELSE priority = normal
```

Actions:
- create customer enquiry
- optionally schedule callback through Google Calendar when requested
- save conversation
- update dashboard

Do not invent pricing or availability.

---

## 18. Real Estate Demo Workflow

Create a seeded workflow called:

`Real Estate Lead Qualification`

Trigger:
`MISSED_CALL`

Intent options:
- buy
- rent
- sell
- schedule site visit
- general enquiry

Collect:
- caller_name — required
- property_type — required
- preferred_location — required
- budget — required
- timeline — optional
- visit_preference — optional
- preferred_visit_datetime — optional
- preferred_callback_datetime — optional
- phone_number — required

Actions:
- create customer enquiry
- qualify lead
- set follow-up status
- use Google Calendar when a site visit or callback is requested
- save conversation

Do not invent listings or property availability.

---

## 19. Language

Support:
- English
- Hindi

Workflow fields should be language-neutral.

Do not create separate duplicated workflow schemas for English/Hindi.

Use localized:
- greetings
- questions
- closing messages
- system instructions where needed

The conversation should continue naturally in the selected language.

If automatic detection is implemented, it must not destabilize the conversation. Language switching should be treated as an enhancement, not a reason to break the core workflow.

---

## 20. Dashboard

Dashboard must show:
- caller name
- phone number
- business
- workflow
- date/time
- conversation status
- customer intent
- captured information
- AI-generated summary
- action performed
- urgency/priority
- follow-up status
- transcript

Conversation detail should additionally show:
- structured fields
- transcript
- action history
- Calendar events
- tool-call audit trail
- call lifecycle/status

Allow owner to set:
- contacted
- completed
- closed

Provide useful filtering by:
- business
- workflow
- status
- priority
- date
- intent

---

## 21. UI/UX

The UI should feel like a real SaaS product, not a hackathon form dump.

Priorities:
- clean dashboard
- clear navigation
- responsive layout
- obvious primary actions
- sensible empty states
- loading states
- error states
- confirmation dialogs for destructive actions
- accessible form labels
- readable conversation timeline
- clear priority/status badges

Do not over-animate.

Do not add decorative UI that makes core workflows harder to use.

Use reusable components.

Avoid duplicating nearly identical page components.

---

## 22. Authentication

Use simple demo email/password authentication.

For the MVP:
- provide a seeded/demo account
- keep credentials out of source code where possible
- document demo credentials only in the appropriate development/demo documentation
- protect application routes
- perform server-side authorization

Never implement insecure "password === hardcoded string" checks in browser code for production-like routes.

If authentication is intentionally simplified for the demo, clearly document that limitation in the submission notes.

---

## 23. API Rules

API endpoints should:
- validate input
- authenticate the user
- authorize the business
- return typed/consistent responses
- handle expected errors
- log server-side failures
- avoid leaking secrets
- avoid leaking internal stack traces to clients

Prefer service-layer functions over putting business logic directly inside route handlers.

Suggested boundaries:

```text
app/api/
  businesses/
  workflows/
  conversations/
  simulator/
  calendar/
  calls/
```

Exact routing may vary with the chosen Next.js architecture.

---

## 24. Error Handling

Every external integration can fail.

Handle:
- Gemini failure
- Google OAuth failure
- Calendar API failure
- Twilio webhook failure
- Twilio callback failure
- Deepgram failure
- ElevenLabs failure
- database failure
- invalid tool arguments
- no calendar availability
- customer hangs up
- voice session disconnect

Never tell the customer that an action succeeded unless it actually succeeded.

Provide graceful customer-facing fallback language.

Persist meaningful failure states for dashboard/debugging.

---

## 25. Idempotency

External events can be retried.

At minimum:
- Twilio webhook processing must be idempotent
- Calendar event actions should avoid accidental duplicate creation
- action execution should have identifiable records
- tool calls should have unique identifiers

Use provider IDs and database constraints where appropriate.

---

## 26. Security

Never commit:
- API keys
- Google client secrets
- OAuth tokens
- Twilio auth tokens
- provider credentials
- production passwords

Provide `.env.example` with placeholders.

Validate:
- authenticated user
- business ownership
- workflow ownership
- conversation ownership
- tool authorization

Sanitize/validate user-provided text before displaying it in HTML.

Do not use dangerous dynamic SQL.

Do not let the LLM generate or execute SQL.

Do not allow arbitrary external HTTP requests from AI tool calling.

---

## 27. Environment Variables

Create `.env.example`.

Expected categories:

```text
NEXT_PUBLIC_APP_URL=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

DEEPGRAM_API_KEY=
ELEVENLABS_API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

Add other required variables only when actually used.

Never expose server-only secrets through `NEXT_PUBLIC_*`.

---

## 28. Database / Supabase Rules

Use migrations rather than manually changing production schema.

Seed demo data in a repeatable way.

Add indexes for common queries:
- business_id
- workflow_id
- conversation status
- created_at
- phone number where appropriate

Use timestamps consistently.

Use database constraints for important invariants.

Do not store entire workflow logic only inside opaque prompt text.

The database must contain enough structured workflow information to reproduce the behavior.

---

## 29. Testing

At minimum test:

### Workflow
- create workflow
- edit workflow
- required/optional fields
- conditions
- actions
- invalid workflow rejection

### AI
- asks required questions
- skips known fields
- captures structured values
- respects workflow
- handles missing information
- produces summary
- invokes Calendar tool when appropriate

### Calendar
- availability
- create
- update/reschedule
- cancel
- unavailable time
- API failure

### Authorization
- business A cannot access business B

### Calls
- missed-call webhook
- duplicate webhook
- callback failure
- completed call

### Languages
- English conversation
- Hindi conversation

Do not rely exclusively on manual testing.

---

## 30. Demo Data

Seed at least:

### Business 1
`Sweet Moments Bakery`

Workflow:
`Cake Order Enquiry`

### Business 2
A realistic generic real-estate business.

Workflow:
`Real Estate Lead Qualification`

Include a few demo conversations showing:
- normal enquiry
- urgent enquiry
- scheduled callback
- site visit
- completed follow-up

Do not use real personal data.

---

## 31. Demo Mode

Provide a safe demo path.

The evaluator should be able to:
1. log in
2. select a business
3. open a workflow
4. start the simulator
5. complete a conversation
6. see extracted information
7. see Calendar tool calls
8. see the resulting dashboard record

If real telephony credentials are unavailable locally, the simulator must remain fully usable.

Do not fake the required Google Calendar integration.

If Calendar cannot be used in a particular environment, show an explicit configuration/error state rather than pretending the event was created.

---

## 32. Observability

Provide structured server logs for:
- incoming call webhook
- callback initiation
- conversation creation
- tool call requested
- tool call succeeded/failed
- Calendar operation
- AI error
- voice session error

Avoid logging:
- passwords
- OAuth tokens
- API keys
- unnecessary sensitive conversation content

Tool calls should be persisted in the database for dashboard/audit visibility.

---

## 33. Documentation

Maintain:

### README.md
Include:
- product overview
- features
- architecture
- stack
- local setup
- environment variables
- Supabase setup
- Google OAuth setup
- Twilio setup
- voice setup
- seed/demo setup
- deployment
- known limitations
- what is fully working
- what is simulated/mocked
- what would be built next

### docs/architecture.md
Include Mermaid architecture diagram.

### docs/database.md
Include schema/data model.

### docs/demo.md
Include 5–8 minute Loom walkthrough script.

### .env.example
Never include secrets.

---

## 34. Architecture Diagram Target

Document an architecture approximately like:

```text
                         ┌───────────────────────┐
                         │       Customer        │
                         │    Phone / Voice      │
                         └───────────┬───────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │   Twilio    │
                              └──────┬──────┘
                                     │
                          missed-call webhook
                                     │
                                     ▼
                         ┌────────────────────┐
                         │ Next.js / Node API │
                         └─────────┬──────────┘
                                   │
                  ┌────────────────┼─────────────────┐
                  │                │                 │
                  ▼                ▼                 ▼
             ┌─────────┐    ┌────────────┐    ┌──────────────┐
             │Supabase │    │ Workflow / │    │ Google       │
             │Postgres │    │ Agent Core │    │ Calendar API │
             └─────────┘    └─────┬──────┘    └──────────────┘
                                  │
                         ┌────────▼────────┐
                         │    Gemini 3     │
                         │ Tool Calling    │
                         └────────┬────────┘
                                  │
                       ┌──────────┴──────────┐
                       │                     │
                 Text Simulator        Pipecat Worker
                                             │
                                  ┌──────────┴─────────┐
                                  │                    │
                              Deepgram             ElevenLabs
                                STT                    TTS
```

Vercel hosts the web application and suitable APIs; Pipecat runs wherever a persistent real-time process is supported.

---

## 35. Definition of Done

The project is not considered complete until:

### Product
- [ ] Business can be created
- [ ] Multiple businesses are supported
- [ ] Workflow can be created/edited
- [ ] Workflow has dynamic fields
- [ ] Required/optional fields work
- [ ] Conditional branches work
- [ ] Actions are configurable
- [ ] Greeting/closing are configurable

### AI
- [ ] Generic Gemini agent works
- [ ] Agent follows workflow configuration
- [ ] Structured information is captured
- [ ] Conversation is persisted
- [ ] AI summary is generated
- [ ] English works
- [ ] Hindi works

### Voice
- [ ] Twilio integration exists
- [ ] Missed-call lifecycle exists
- [ ] Callback can be initiated
- [ ] Pipecat voice pipeline works
- [ ] Deepgram STT works
- [ ] ElevenLabs TTS works

### Calendar
- [ ] Business can connect Google Calendar
- [ ] Availability can be checked
- [ ] Event can be created
- [ ] Event can be updated/rescheduled
- [ ] Event can be cancelled
- [ ] Agent uses tools based on conversation
- [ ] Calendar tool results affect the conversation

### Demo Workflows
- [ ] Cake Shop workflow works end-to-end
- [ ] Real Estate workflow works end-to-end

### Dashboard
- [ ] Conversations listed
- [ ] Details visible
- [ ] Captured fields visible
- [ ] Transcript visible
- [ ] Summary visible
- [ ] Actions visible
- [ ] Priority visible
- [ ] Follow-up status editable

### Quality
- [ ] No secrets committed
- [ ] `.env.example` exists
- [ ] README exists
- [ ] Architecture diagram exists
- [ ] Database model documented
- [ ] Known mocked/simulated features documented
- [ ] Deployment works
- [ ] Demo path is reproducible

---

## 36. Submission Requirements

Prepare:
- GitHub repository
- deployed web application
- README
- architecture diagram
- database schema/workflow model
- `.env.example`
- 5–8 minute Loom or equivalent
- short note covering:
  - fully working
  - simulated/mocked
  - next production steps

The demo should strongly emphasize:
1. Generic workflow builder
2. Cake workflow
3. Real-estate workflow
4. AI conversation
5. Google Calendar tool calling
6. Voice callback
7. Dashboard/audit trail

---

## 37. Demo Script

Recommended 7-minute flow:

### 0:00–0:40
Explain the missed-call problem.

### 0:40–1:30
Show business/workflow configuration.

### 1:30–3:00
Run Cake Shop conversation.

Demonstrate:
- dynamic questions
- structured extraction
- urgent condition

### 3:00–4:30
Ask for a callback/site visit time.

Demonstrate:
- Calendar availability tool
- confirmation
- event creation

Show the real Google Calendar event.

### 4:30–5:30
Open dashboard.

Show:
- caller
- intent
- fields
- summary
- priority
- transcript
- tool call
- follow-up status

### 5:30–6:30
Switch to Real Estate workflow.

Demonstrate that the same generic engine handles a different business.

### 6:30–7:00
Show architecture and explain:
"The business logic is configuration-driven; adding another industry does not require rewriting the core AI agent."

---

## 38. Antigravity Coding-Agent Behavior

When working on this repository:

1. Inspect before modifying.
2. Understand existing architecture before introducing abstractions.
3. Prefer small, verifiable changes.
4. Run type checking/lint/tests after meaningful changes.
5. Fix errors before moving to the next phase.
6. Do not rewrite working code just for stylistic reasons.
7. Do not add unnecessary dependencies.
8. Do not hardcode business-specific AI behavior.
9. Do not hardcode secrets.
10. Do not create fake integrations when a real integration is required.
11. Do not silently remove requirements to make implementation easier.
12. If an external provider cannot be fully configured locally, create a clean adapter/mock boundary without corrupting the real integration design.
13. Keep provider-specific implementations isolated.
14. Prefer typed interfaces and schemas.
15. Keep business logic out of UI components.
16. Keep API handlers thin and delegate to services.
17. Keep AI prompts/configuration separate from application logic.
18. Add tests for important workflow and tool behavior.
19. Update documentation when architecture or setup changes.
20. Preserve backward compatibility when changing database/schema structures.
21. Never expose chain-of-thought or internal model reasoning in the UI.
22. Show useful structured debug information instead: tool calls, extracted fields, workflow state, and outcomes.
23. Before declaring a feature complete, verify it against the Definition of Done.
24. When requirements conflict, prioritize explicit project requirements over convenience.
25. If a requirement is technically impossible with the selected infrastructure, explain the constraint and implement the closest production-safe architecture rather than silently faking it.

---

## 39. Product Quality Bar

The finished project should feel like a coherent SaaS product.

The evaluator should be able to understand within one minute:
- what problem it solves
- who uses it
- what happens after a missed call
- how workflows are configured
- how AI uses tools
- where the customer data goes

The strongest architectural proof is:

"Create a workflow with different fields and actions, run it through the same conversation engine, and see the resulting structured customer record."

Avoid spending disproportionate effort on visual polish while core workflow execution, Calendar integration, and voice architecture remain incomplete.

Core correctness comes first.
