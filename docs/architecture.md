# System Architecture & Flow — Aura Voice

## Overview

Aura Voice is structured around a **generic workflow core**. The AI receptionist does not hardcode business domain logic. Instead, business rules, question sequences, field extractions, priority conditions, and approved tool capabilities are loaded dynamically at runtime.

---

## Mermaid Architecture Diagram

```mermaid
graph TD
    User["Customer / Phone Caller"] -->|Missed Call / Audio| Telnyx["Telnyx TeXML Webhook"]
    Telnyx -->|Webhook / API| API["Next.js App Server / API Routes"]
    
    subgraph "Core Generic Platform Engine"
        API --> DB["PostgreSQL / Supabase DB"]
        API --> Engine["Generic Workflow Engine"]
        Engine --> ConditionEval["Dynamic Condition Evaluator"]
        Engine --> FieldExtract["Dynamic Field Extractor"]
        Engine --> PromptBuilder["Dynamic System Prompt Builder"]
    end

    subgraph "AI & Tool Reasoning Layer"
        PromptBuilder --> Gemini["Gemini 3 LLM Engine"]
        Gemini -->|Function Calling| ToolRegistry["Central Tool Registry"]
        ToolRegistry -->|Check / Create / Cancel Event| GCal["Google Calendar API (OAuth 2.0)"]
        ToolRegistry -->|Log Lead Enquiry| DB
    end

    subgraph "Voice & Simulation Pipeline"
        User <-->|Interactive Test| Simulator["Text & Audio Phone Simulator"]
        Simulator <--> Engine
        Telnyx <--> Pipecat["Pipecat Voice Worker"]
        Pipecat <--> Deepgram["Deepgram STT"]
        Pipecat <--> ElevenLabs["ElevenLabs TTS"]
        Pipecat <--> Gemini
    end

    subgraph "Dashboard & Management"
        DB --> Dashboard["Multi-Tenant Business Dashboard"]
        Dashboard --> AuditFeed["Tool Call Audit Trail & Transcripts"]
    end
```

---

## Component Boundaries

1. **Next.js Web / API Layer**: Handles web dashboard rendering, workflow editing, user authentication, and REST API handlers.
2. **Generic Workflow Engine**: Executes dynamic field extraction (`field-extractor.ts`), evaluates condition rules (`conditions.ts`), and synthesizes custom prompt instructions (`prompt-builder.ts`).
3. **Gemini 3 LLM Engine**: Receives system prompts and handles natural language conversation while triggering native function calls.
4. **Central Tool Registry**: Authorizes and runs external tool operations (`check_calendar_availability`, `create_calendar_event`, `create_customer_enquiry`) while persisting audit records.
5. **Voice Pipeline (Pipecat Worker)**: Manages real-time WebSockets/RTP audio streams connecting Telnyx, Deepgram STT, Gemini 3, and ElevenLabs TTS.
