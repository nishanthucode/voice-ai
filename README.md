# 🎙️ Aura Voice AI — Industry-Agnostic AI Receptionist Platform

A production-ready, multi-tenant AI voice receptionist platform designed for small and medium businesses (Bakeries, Real Estate Agencies, Medical Clinics, Repair Services, and more).

When a business misses a customer call, **Aura Voice AI** automatically triggers an intelligent voice callback, conducts a structured conversation, extracts custom dynamic fields, evaluates workflow urgency rules, executes external tool integrations (such as Google Calendar), and records interaction audit trails in the real-time business dashboard.

---

## 🔑 Authentication & Demo Credentials

> ⚠️ **Mandatory Authentication**: All platform pages (`/dashboard`, `/workflows`, `/simulator`, `/integrations`, `/conversations/[id]`) are protected by authentication middleware. Unauthenticated visitors are automatically redirected to `/login`.

### **Quick Demo Access**
- **Login URL**: `http://localhost:3000/login`
- **Email**: `demo@auravoice.ai`
- **Password**: `demo123`
- **⚡ 1-Click Sign-In**: Click the **"1-Click Instant Demo Login"** button on the login screen to authenticate immediately.

---

## 🛠️ Step-by-Step Setup & Installation

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### **1. Clone & Install Dependencies**
```bash
git clone https://github.com/your-username/voice-ai-assistant.git
cd voice-ai-assistant
npm install
```

### **2. Environment Configuration**
Copy `.env.example` to create `.env` in the project root:
```bash
cp .env.example .env
```

*(Note: The application operates in zero-setup demo mode out-of-the-box using built-in mock services. For live integrations, configure your API keys below).*

```env
# Server & Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Database Configuration (Optional - In-Memory Fallback Active)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini 3 AI Engine
GEMINI_API_KEY=your_gemini_api_key

# Telnyx Telephony & TeXML Integration
TELNYX_API_KEY=your_telnyx_api_key
TELNYX_PHONE_NUMBER=your_telnyx_phone_number
TELNYX_APP_ID=your_telnyx_texml_app_id

# Voice STT & TTS Providers (Optional)
DEEPGRAM_API_KEY=your_deepgram_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Google Calendar OAuth 2.0 Integration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/callback

# JWT Authentication Secret
JWT_SECRET=your_jwt_secret_key_here
```

### **3. Start Development Server**
```bash
npm run dev
```
Open **[http://localhost:3000/login](http://localhost:3000/login)** in your browser.

### **4. Verify Production Build**
```bash
npm run build
npm run start
```

---

## 🌟 Key Application Features

1. **Generic Workflow & Field Builder (`/workflows`)**
   - Configure **Workflow Name**, **Trigger Type** (`Missed Call`), **AI Greeting**, **Dynamic Questions & Fields**, **Urgency Logic Rules** (e.g. *If cake required within 24 hours → Flag as URGENT*), **Post-Collection Tool Actions**, and **Closing Statements**.
   - Zero hardcoded business logic; all prompts and extractions are driven by generic schemas.

2. **In-Browser Voice & Text Simulator (`/simulator`)**
   - Conduct real-time voice calls directly in your browser using the microphone (**Web Speech API** - zero cost, no telco upgrade required).
   - Live **Developer Debug Panel** displaying real-time field extraction, condition evaluation, and calendar tool execution logs.

3. **Google Calendar Tool Calling & OAuth 2.0 (`/integrations`)**
   - Supports tool function calling (`check_calendar_availability`, `create_calendar_event`).
   - Includes Google OAuth 2.0 login flow (`/api/calendar/auth-url` and `/api/calendar/callback`).

4. **Multi-Tenant Dashboard & Audit Feed (`/dashboard`)**
   - Business profile switcher (**Sweet Moments Bakery**, **Apex Horizon Realty**, **City Care Health Clinic**).
   - Filter missed-call feeds by priority (`Urgent`, `High`, `Normal`) and update follow-up statuses (`Pending`, `Contacted`, `Completed`, `Closed`).

5. **Mobile-First Responsive Design**
   - Fully optimized for mobile screens (320px+), tablets, and desktops with slide-over drawer navigation and touch-friendly controls.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── page.tsx                    # Landing Page & Overview
│   ├── login/page.tsx              # Authentication Login Screen
│   ├── dashboard/page.tsx          # Multi-Tenant Business Feed & KPI Dashboard
│   ├── workflows/page.tsx          # Generic Workflow & Dynamic Field Builder
│   ├── simulator/page.tsx          # In-Browser Voice Call & Text Simulator
│   ├── integrations/page.tsx       # Google Calendar OAuth & Telephony Setup
│   ├── conversations/[id]/page.tsx # Detailed Call Transcript & Audit Logs
│   └── api/                        # Backend REST & Webhook APIs
│       ├── auth/                   # Login, Logout, Session Verification
│       ├── calendar/               # OAuth Auth-URL & Redirect Callback
│       ├── calls/                  # Telephony Webhooks & AI Call Handlers
│       ├── simulator/chat/         # AI Conversational & Tool Calling Engine
│       └── workflows/              # Business & Workflow CRUD APIs
├── components/
│   ├── Sidebar.tsx                 # Responsive Drawer Navigation & Business Switcher
│   └── Navbar.tsx                  # System Status Bar, Quick Simulator & Reset Controls
├── lib/
│   ├── auth/                       # JWT Sign/Verify Authentication Helper
│   ├── db/                         # In-Memory & Supabase Repository Layer
│   ├── engine/                     # Generic Workflow Engine (Conditions & Extraction)
│   └── services/                   # Gemini AI & Google Calendar Service Handlers
└── proxy.ts                        # Mandatory Authentication Middleware Guard
```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for details.
