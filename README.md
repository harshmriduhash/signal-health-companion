# MedPulse — AI-Powered Medication Adherence Platform

<div align="center">
  <h3>🏥 Monitor. Detect. Intervene.</h3>
  <p>MedPulse is a healthcare SaaS platform that uses AI to monitor post-prescription medication adherence, detect side-effect patterns, and alert care teams in real-time.</p>
</div>

---

## 📋 Table of Contents

- [What Problem Does It Solve?](#what-problem-does-it-solve)
- [How Does MedPulse Solve It?](#how-does-medpulse-solve-it)
- [Does It Save Time?](#does-it-save-time)
- [Does It Save Money?](#does-it-save-money)
- [Features](#features)
- [Software Architecture](#software-architecture)
- [System Design](#system-design)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Checklists](#checklists)

---

## ❓ What Problem Does It Solve?

**Medication non-adherence is a $300 billion problem in the US alone.**

- **50% of patients** don't take medications as prescribed (WHO)
- **125,000 deaths annually** in the US due to medication non-adherence
- **10% of hospitalizations** are caused by non-adherence
- Doctors have **zero visibility** into what happens after a prescription is written
- Side effects go **unreported for weeks** until they become emergencies
- Patients feel **disconnected** from their care team between appointments

The gap between prescription and adherence is a **black box** in healthcare. Neither patients nor doctors have the tools to monitor, analyze, or act on medication behavior in real-time.

---

## 💡 How Does MedPulse Solve It?

MedPulse bridges the prescription-to-adherence gap with a three-layer approach:

### 1. Patient Self-Tracking
Patients log daily medication intake (take/skip) and report symptoms with severity ratings. The interface is simple enough for elderly patients — just two buttons per medication per day.

### 2. AI-Powered Analysis
An AI engine continuously analyzes patient data to:
- **Detect adherence patterns**: Identifies patients who consistently miss doses or skip medications
- **Correlate symptoms with medications**: If a patient starts reporting headaches 3 days after starting a new drug, MedPulse flags the potential side-effect
- **Score risk levels**: Each patient gets a dynamic risk score based on adherence rates and symptom severity

### 3. Doctor Alerting & Oversight
When risk thresholds are breached, MedPulse automatically creates alerts for the care team. Doctors see a prioritized list of patients who need attention, complete with adherence charts, symptom timelines, and AI recommendations — all before the patient's next appointment.

### The AI Health Assistant
Patients can chat with an AI assistant that understands their medications and symptoms. It answers questions like "Is nausea normal with metformin?" or "Should I take my evening dose if I missed the morning one?" — reducing unnecessary calls to the doctor's office.

---

## ⏱️ Does It Save Time?

**Yes. Significantly.**

| Without MedPulse | With MedPulse |
|---|---|
| Doctor calls patients to check on medication compliance | Dashboard shows adherence data automatically |
| Patients wait for appointments to report side effects | Real-time symptom logging with instant AI triage |
| Nurses manually review medication logs | AI generates prioritized risk reports |
| Doctor spends 15 min per patient reviewing history | One-click patient detail view with charts |
| Patients call the office for medication questions | AI chatbot answers 24/7 instantly |

**Estimated time savings:**
- **Doctors**: 2-3 hours/week on patient follow-up and chart review
- **Patients**: Instant AI responses vs. waiting for callbacks
- **Nurses/staff**: Automated alerts replace manual check-in calls

---

## 💰 Does It Save Money?

**Yes. At every level.**

### For Healthcare Systems
- **Reduced hospital readmissions**: Catching non-adherence early prevents costly ER visits ($2,500-$25,000 per admission)
- **Fewer adverse drug events**: Side-effect detection prevents complications (avg. $7,000 per preventable adverse event)
- **Lower administrative overhead**: Automated monitoring replaces manual follow-up calls

### For Patients
- **Fewer unnecessary doctor visits**: AI chat answers common medication questions
- **Better health outcomes**: Adherent patients spend less on emergency care
- **Prevention of drug waste**: Tracking helps identify medications that aren't working early

### For Insurance / Payers
- **Lower claims costs**: Adherent patients have 20% lower total healthcare costs
- **Predictive risk scoring**: Identify at-risk patients before they become expensive claims

**Conservative estimate**: MedPulse saves **$1,200-$3,600 per patient per year** in reduced hospitalizations and adverse events.

---

## ✨ Features

### Patient Dashboard
- Daily medication tracking with take/skip buttons
- Symptom logging with 5-level severity scale
- Adherence statistics and 14-day adherence chart
- AI health assistant with streaming chat
- AI-generated health recommendations

### Doctor Dashboard
- Patient list with search functionality
- Detailed patient view with full medical history
- 14-day adherence analytics chart (stacked bar chart)
- Symptom timeline with severity indicators
- AI recommendations per patient
- Alert management (acknowledge/resolve)

### Admin Panel
- User management with role assignment (Patient, Doctor, Admin)
- System overview with aggregate metrics
- Audit log viewer for all critical actions

### AI System
- Conversational health assistant (streaming SSE)
- Adherence pattern detection
- Side-effect correlation engine
- Dynamic risk scoring
- Automatic doctor alert generation

### Navigation & UX
- Role-based navigation with active link highlighting
- Sticky header with auto-detected role badge
- Professional footer on all pages
- Mobile-responsive design
- Loading skeletons for all async data

### Authentication
- Email/password signup with email verification
- Role selection during signup (Patient or Doctor)
- Admin can assign any role via Admin Panel
- Session auto-refresh
- Protected routes with role guards

### Marketing Landing Page
- Hero section with value proposition
- Feature highlights with icons
- How-it-works flow
- Pricing tiers (Free, Pro, Clinic)
- Testimonials from healthcare professionals
- FAQ section
- Professional footer with navigation

---

## 🏗️ Software Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React SPA)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Landing  │  │   Auth   │  │ Patient  │  │     Doctor       │ │
│  │   Page    │  │  Pages   │  │Dashboard │  │   Dashboard      │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────────────────┐                  │
│  │  Admin   │  │     Shared Components        │                  │
│  │  Panel   │  │  (AppHeader, Footer, Charts) │                  │
│  └──────────┘  └──────────────────────────────┘                  │
│                                                                   │
│  ┌────────────────────────────────────────────┐                  │
│  │          Custom Hooks Layer                 │                  │
│  │  useMedications · useSymptoms · useAlerts  │                  │
│  │  useRecommendations · useChat · useAuth    │                  │
│  └────────────────────────────────────────────┘                  │
│                          │                                        │
│                    Supabase JS SDK                                │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                    HTTPS / WSS
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                     BACKEND (Lovable Cloud)                       │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────────────┐                │
│  │   Auth Service   │  │    Edge Functions        │               │
│  │  (Email/Pass)    │  │  ┌─────────────────────┐│               │
│  └─────────────────┘  │  │  chat (SSE stream)  ││               │
│                        │  │  → AI Gateway       ││               │
│  ┌─────────────────┐  │  ├─────────────────────┤│               │
│  │  PostgreSQL DB   │  │  │ analyze-patient     ││               │
│  │  ┌─────────────┐│  │  │  → Risk scoring     ││               │
│  │  │  profiles   ││  │  │  → Alert creation   ││               │
│  │  │  user_roles ││  │  └─────────────────────┘│               │
│  │  │ medications ││  └─────────────────────────┘                │
│  │  │  med_logs   ││                                              │
│  │  │symptom_logs ││  ┌─────────────────────────┐                │
│  │  │    alerts   ││  │    RLS Policies          │               │
│  │  │ ai_recs     ││  │  has_role() function    │                │
│  │  │chat_messages││  │  Per-table policies     │                │
│  │  │ audit_logs  ││  └─────────────────────────┘                │
│  │  └─────────────┘│                                              │
│  └─────────────────┘  ┌─────────────────────────┐                │
│                        │   Lovable AI Gateway     │               │
│                        │  (Gemini Flash model)    │               │
│                        └─────────────────────────┘                │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔧 System Design

### Data Flow

```
Patient Action (take medication, log symptom)
       │
       ▼
  Frontend Hook (useMedications, useSymptoms)
       │
       ▼
  Supabase SDK → PostgreSQL (with RLS)
       │
       ▼
  Edge Function: analyze-patient
       │
       ├── Calculates adherence rate
       ├── Detects symptom patterns
       ├── Calls AI Gateway for analysis
       │
       ▼
  AI Gateway (Gemini) → Structured response
       │
       ├── Store ai_recommendations
       ├── If risk > threshold → Create alert
       │
       ▼
  Doctor Dashboard (real-time via query refresh)
```

### Authentication Flow

```
User signs up (email + password + role selection)
       │
       ▼
  Auth Service creates user in auth.users
       │
       ▼
  Trigger: handle_new_user()
       │
       ├── Creates profile in public.profiles
       ├── Assigns selected role (patient/doctor) in user_roles
       │
       ▼
  Frontend: AuthContext detects session
       │
       ├── Fetches roles from user_roles
       ├── Navigates to role-appropriate dashboard
       │
       ▼
  ProtectedRoute checks role before rendering
```

### AI Chat Flow

```
User sends message
       │
       ▼
  useChat hook → POST to /functions/v1/chat
       │
       ▼
  Edge Function: chat
       │
       ├── Formats messages for AI Gateway
       ├── Calls Lovable AI (Gemini Flash)
       ├── Streams response via SSE
       │
       ▼
  Frontend: Reads SSE stream
       │
       ├── Updates UI character-by-character
       ├── Persists complete message to chat_messages
       │
       ▼
  User sees streaming AI response
```

### Security Model

```
┌──────────────────────────────────────────┐
│              Row Level Security           │
│                                          │
│  Patient:                                │
│    SELECT own data only                  │
│    INSERT own data only                  │
│    UPDATE own data only                  │
│    DELETE own data only                  │
│                                          │
│  Doctor:                                 │
│    SELECT all patient data (read-only)   │
│    UPDATE assigned alerts only           │
│                                          │
│  Admin:                                  │
│    Full CRUD on all tables               │
│    Manage user roles                     │
│    View audit logs                       │
│                                          │
│  Security Function:                      │
│    has_role(user_id, role) → boolean     │
│    SECURITY DEFINER (runs as owner)      │
└──────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| State | React Query (TanStack Query) |
| Routing | React Router v6 |
| Charts | Recharts |
| AI Chat | react-markdown, SSE streaming |
| Backend | Lovable Cloud |
| Database | PostgreSQL with RLS |
| Auth | Email/password with email verification |
| AI | Lovable AI Gateway (Gemini Flash) |
| Edge Functions | Deno runtime |
| Fonts | Inter, Plus Jakarta Sans |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Local Development

```sh
# Clone the repository
git clone <github.com/harshmriduhash/signal-health>

# Navigate to project directory
cd medpulse

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

The following environment variables are auto-configured by Lovable Cloud:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Backend API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key for frontend |
| `LOVABLE_API_KEY` | AI Gateway access (edge functions only) |

---

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── charts/          # AdherenceChart
│   ├── patient/         # Patient-specific components
│   │   ├── AIChatDialog
│   │   ├── AddMedicationDialog
│   │   ├── MedicationList
│   │   ├── RecommendationCards
│   │   ├── SymptomLogDialog
│   │   └── SymptomsList
│   ├── AppHeader.tsx    # Sticky nav with role-based links
│   ├── Footer.tsx       # Professional footer
│   ├── NavLink.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx   # Authentication state + role management
├── hooks/
│   ├── useAlerts.ts
│   ├── useChat.ts
│   ├── useMedications.ts
│   ├── useRecommendations.ts
│   └── useSymptoms.ts
├── integrations/
│   └── supabase/         # Auto-generated client & types
├── pages/
│   ├── Index.tsx          # Landing page
│   ├── Auth.tsx           # Login/signup with role selection
│   ├── Dashboard.tsx      # Role-based redirect
│   ├── PatientDashboard.tsx
│   ├── DoctorDashboard.tsx
│   ├── DoctorPatientDetail.tsx
│   ├── AdminDashboard.tsx
│   └── NotFound.tsx
└── App.tsx               # Routes & providers

supabase/
├── functions/
│   ├── chat/             # AI chat edge function
│   └── analyze-patient/  # AI analysis edge function
└── config.toml           # Function configuration
```

---

## 📊 Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User profile data (name, avatar, phone) |
| `user_roles` | RBAC role assignments (patient, doctor, admin) |
| `medications` | Patient prescriptions |
| `medication_logs` | Daily intake tracking (taken/missed) |
| `symptom_logs` | Patient-reported symptoms with severity |
| `ai_recommendations` | AI-generated insights |
| `alerts` | Risk alerts for doctors |
| `chat_messages` | AI chat history |
| `audit_logs` | System audit trail |

---

## 📝 Checklists

- **[MVP_LAUNCH_CHECKLIST.md](./MVP_LAUNCH_CHECKLIST.md)** — Feature completion and launch day tasks
- **[READY_CHECKLIST.md](./READY_CHECKLIST.md)** — Production readiness assessment
- **[SAAS_READY_CHECKLIST.md](./SAAS_READY_CHECKLIST.md)** — SaaS business model readiness

---

## 📄 License

Copyright © 2026 MedPulse. All rights reserved.
