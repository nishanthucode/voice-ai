# Loom Walkthrough & Demo Script — Aura Voice (7-Minute Flow)

Use this step-by-step video script for Loom / YouTube submission.

---

## 🕒 Minute 0:00 – 0:40 — Problem Statement & Product Overview
- **Visual**: Open Dashboard (`/`). Show top bar with tenant switcher.
- **Script**:
  > "Small businesses lose thousands of dollars every month when they miss customer phone calls. Existing voice agents are rigid or hardcoded for a single niche. Aura Voice is a generic, configuration-driven AI receptionist platform. When a call is missed, Aura Voice initiates an AI callback, collects structured details according to the business workflow, checks Google Calendar availability, creates events, and logs the complete audit trail into the business dashboard."

---

## 🕒 Minute 0:40 – 1:30 — Generic Workflow & Dynamic Field Builder
- **Visual**: Navigate to **Workflow Builder** (`/workflows`). Show `Sweet Moments Bakery` workflow.
- **Script**:
  > "Notice that our AI agent contains zero hardcoded cake shop or real estate logic. Here in the Workflow Builder, business owners define custom dynamic fields—like Cake Type, Flavour, Weight, and Delivery Address. We can toggle fields as Required or Optional, set custom AI question prompts, and define rules. For instance: IF the required date is within 24 hours, THEN automatically elevate priority to URGENT."

---

## 🕒 Minute 1:30 – 3:00 — Live Cake Shop Interactive Call Simulation
- **Visual**: Open **AI Text & Voice Simulator** (`/simulator`). Select `Cake Order Enquiry`.
- **Script**:
  > "Let's run a live simulated callback. As the caller, I say: 'Hi, I want to order a 2kg Belgian dark chocolate birthday cake for tomorrow afternoon at 3 PM.'
  > Notice the Developer Audit Debug Panel on the right side! It instantly extracts `cake_type = Birthday Cake`, `flavour = Belgian Dark Chocolate`, `weight = 2 kg`, and `required_date`. Because the requested delivery is within 24 hours, our dynamic condition evaluator automatically flags the call priority as URGENT."

---

## 🕒 Minute 3:00 – 4:30 — Google Calendar Tool Calling & Scheduling
- **Visual**: Type in simulator: *"Please book a delivery confirmation slot for tomorrow at 3 PM."*
- **Script**:
  > "Now watch Google Calendar tool calling in action. Gemini identifies that scheduling is requested and invokes our central tool registry. First, it runs `check_calendar_availability`. Finding the slot open, it executes `create_calendar_event` on Google Calendar and records the event ID in our audit log!"

---

## 🕒 Minute 4:30 – 5:30 — Dashboard & Audit Trail Verification
- **Visual**: Navigate back to **Dashboard** (`/`). Click into conversation details (`/conversations/[id]`).
- **Script**:
  > "Back on the dashboard, the missed call is updated in real time. We see the customer name, urgent priority badge, captured dynamic fields, full call transcript, and executed tool calls. We can toggle the follow-up status to 'Contacted' or 'Completed'."

---

## 🕒 Minute 5:30 – 6:30 — Multi-Tenant Proof: Real Estate Workflow Test
- **Visual**: Use sidebar tenant switcher to select `Apex Horizon Realty`. Open Simulator (`/simulator`).
- **Script**:
  > "To prove our platform is truly generic, we switch tenants to Apex Horizon Realty. Without modifying a single line of backend code, the same AI engine now handles real estate lead qualification—capturing property type, preferred location, budget, and scheduling site visits on Google Calendar!"

---

## 🕒 Minute 6:30 – 7:00 — Architecture & Summary
- **Visual**: Show `docs/architecture.md` diagram.
- **Script**:
  > "Aura Voice separates workflow configuration from AI execution. It combines Gemini 3 function calling, Google Calendar OAuth, Twilio webhooks, and Pipecat voice pipelines into a complete SaaS product. Thank you!"
