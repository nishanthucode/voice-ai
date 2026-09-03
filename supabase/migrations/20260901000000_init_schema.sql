-- Missed Call AI Assistant Platform (Aura Voice) Initial Database Schema

CREATE TABLE IF NOT EXISTS businesses (
  id VARCHAR(64) PRIMARY KEY,
  owner_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  business_type VARCHAR(255) NOT NULL,
  phone_number VARCHAR(64) NOT NULL,
  address TEXT NOT NULL,
  timezone VARCHAR(64) DEFAULT 'America/Los_Angeles',
  default_language VARCHAR(8) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflows (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(32) DEFAULT 'MISSED_CALL',
  greeting TEXT NOT NULL,
  closing_message TEXT NOT NULL,
  language VARCHAR(8) DEFAULT 'en',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_fields (
  id VARCHAR(64) PRIMARY KEY,
  workflow_id VARCHAR(64) REFERENCES workflows(id) ON DELETE CASCADE,
  name VARCHAR(64) NOT NULL,
  label VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  data_type VARCHAR(32) NOT NULL,
  required BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  validation_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_conditions (
  id VARCHAR(64) PRIMARY KEY,
  workflow_id VARCHAR(64) REFERENCES workflows(id) ON DELETE CASCADE,
  field_name VARCHAR(64) NOT NULL,
  operator VARCHAR(32) NOT NULL,
  comparison_value TEXT NOT NULL,
  action_config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_actions (
  id VARCHAR(64) PRIMARY KEY,
  workflow_id VARCHAR(64) REFERENCES workflows(id) ON DELETE CASCADE,
  action_type VARCHAR(64) NOT NULL,
  configuration JSONB DEFAULT '{}'::jsonb,
  order_index INT DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS conversations (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  workflow_id VARCHAR(64) REFERENCES workflows(id) ON DELETE CASCADE,
  caller_name VARCHAR(255) DEFAULT 'Guest Caller',
  phone_number VARCHAR(64) NOT NULL,
  intent VARCHAR(255),
  language VARCHAR(8) DEFAULT 'en',
  status VARCHAR(32) DEFAULT 'ACTIVE',
  priority VARCHAR(32) DEFAULT 'normal',
  summary TEXT,
  action_status VARCHAR(255),
  follow_up_status VARCHAR(32) DEFAULT 'pending',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_fields (
  id VARCHAR(64) PRIMARY KEY,
  conversation_id VARCHAR(64) REFERENCES conversations(id) ON DELETE CASCADE,
  field_name VARCHAR(64) NOT NULL,
  value JSONB NOT NULL,
  confidence FLOAT DEFAULT 1.0,
  source VARCHAR(32) DEFAULT 'extracted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(64) PRIMARY KEY,
  conversation_id VARCHAR(64) REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE IF NOT EXISTS tool_calls (
  id VARCHAR(64) PRIMARY KEY,
  conversation_id VARCHAR(64) REFERENCES conversations(id) ON DELETE CASCADE,
  tool_name VARCHAR(64) NOT NULL,
  arguments JSONB NOT NULL,
  result JSONB,
  status VARCHAR(32) DEFAULT 'PENDING',
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS calendar_connections (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  google_account_email VARCHAR(255) NOT NULL,
  refresh_token TEXT NOT NULL,
  calendar_id VARCHAR(255) DEFAULT 'primary',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  conversation_id VARCHAR(64) REFERENCES conversations(id) ON DELETE SET NULL,
  google_event_id VARCHAR(255) NOT NULL,
  status VARCHAR(32) DEFAULT 'confirmed',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  title TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_records (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  conversation_id VARCHAR(64) REFERENCES conversations(id) ON DELETE SET NULL,
  provider VARCHAR(32) NOT NULL,
  provider_call_id VARCHAR(255) NOT NULL,
  direction VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  from_number VARCHAR(64) NOT NULL,
  to_number VARCHAR(64) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast query performance & tenant isolation
CREATE INDEX IF NOT EXISTS idx_workflows_business ON workflows(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business ON conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_priority ON conversations(priority);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tool_calls_conversation ON tool_calls(conversation_id);
CREATE INDEX IF NOT EXISTS idx_call_records_provider_call ON call_records(provider_call_id);
