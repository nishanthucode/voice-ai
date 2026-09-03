# Database Schema & Domain Model — Aura Voice

The database is built for multi-tenancy and configuration-driven generic workflows.

---

## Entity Relationship Summary

```text
businesses (1) ───< workflows (N)
   │                    │
   ├──< conversations (N) ├──< workflow_fields (N)
   │          │          ├──< workflow_conditions (N)
   │          ├──< conversation_fields (N)
   │          ├──< messages (N)
   │          └──< tool_calls (N)
   │
   └──< calendar_connections (1) ───< calendar_events (N)
```

---

## Tables Overview

### 1. `businesses`
- `id` (VARCHAR, PK)
- `owner_id` (VARCHAR)
- `name` (VARCHAR)
- `business_type` (VARCHAR)
- `phone_number` (VARCHAR)
- `address` (TEXT)
- `timezone` (VARCHAR)
- `default_language` (en / hi)

### 2. `workflows`
- `id` (VARCHAR, PK)
- `business_id` (VARCHAR, FK -> businesses.id)
- `name` (VARCHAR)
- `description` (TEXT)
- `trigger_type` (MISSED_CALL)
- `greeting` (TEXT)
- `closing_message` (TEXT)
- `language` (en / hi)
- `active` (BOOLEAN)

### 3. `workflow_fields`
- `id` (VARCHAR, PK)
- `workflow_id` (VARCHAR, FK -> workflows.id)
- `name` (VARCHAR) - programmatic key (e.g. `cake_type`, `flavour`, `budget`)
- `label` (VARCHAR) - human readable name
- `question` (TEXT) - prompt asked by AI
- `data_type` (string, number, datetime, boolean, enum)
- `required` (BOOLEAN)
- `order_index` (INT)

### 4. `workflow_conditions`
- `id` (VARCHAR, PK)
- `workflow_id` (VARCHAR, FK -> workflows.id)
- `field_name` (VARCHAR)
- `operator` (equals, not_equals, contains, within_hours, greater_than, etc.)
- `comparison_value` (TEXT)
- `action_config` (JSONB) - specifies priority override (`urgent`, `high`) or action triggers

### 5. `conversations`
- `id` (VARCHAR, PK)
- `business_id` (VARCHAR, FK -> businesses.id)
- `workflow_id` (VARCHAR, FK -> workflows.id)
- `caller_name` (VARCHAR)
- `phone_number` (VARCHAR)
- `intent` (VARCHAR)
- `status` (ACTIVE, COMPLETED, FAILED)
- `priority` (normal, high, urgent)
- `summary` (TEXT)
- `follow_up_status` (pending, contacted, completed, closed)

### 6. `conversation_fields`
- `id` (VARCHAR, PK)
- `conversation_id` (VARCHAR, FK -> conversations.id)
- `field_name` (VARCHAR)
- `value` (JSONB)
- `confidence` (FLOAT)

### 7. `tool_calls`
- `id` (VARCHAR, PK)
- `conversation_id` (VARCHAR, FK -> conversations.id)
- `tool_name` (VARCHAR)
- `arguments` (JSONB)
- `result` (JSONB)
- `status` (PENDING, SUCCESS, FAILED)
