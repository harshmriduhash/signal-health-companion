

# SignalRX — Full Stack Healthcare AI SaaS

## Overview
SignalRX is a healthcare AI platform that monitors post-prescription medication adherence and side-effect patterns. Built with Lovable Cloud (Supabase backend) and Lovable AI gateway for all AI features. Prototype stage with synthetic data.

**Design Style**: Modern clinical — clean white/slate backgrounds, blue-teal accent palette, professional typography, card-based layouts with subtle shadows. Accessible and calm, inspired by modern health-tech apps.

---

## Phase 1: Foundation & Authentication

### 1.1 Database Schema
Set up the complete data model in Supabase:
- **profiles** — user profile data (name, avatar, phone)
- **user_roles** — RBAC roles (patient, doctor, admin) in a separate table with `has_role()` security definer function
- **medications** — drug name, dosage, schedule, linked to patient
- **medication_logs** — daily intake tracking (taken/missed + timestamp)
- **symptom_logs** — patient-reported symptoms with severity
- **ai_recommendations** — AI-generated insights per patient
- **alerts** — risk alerts linking patients to doctors
- **chat_messages** — conversation history for AI chat
- **audit_logs** — track medication changes, AI recommendations, doctor actions

### 1.2 Authentication & RBAC
- Email/password signup and login via Supabase Auth
- Role assignment on signup (patient by default, admin can assign doctor/admin)
- Role-based route guards on frontend
- RLS policies on all tables using `has_role()` function
- Session management with `onAuthStateChange`

---

## Phase 2: Patient Experience

### 2.1 Patient Dashboard
- Today's medication list with take/skip buttons
- Adherence streak and weekly adherence percentage
- Recent symptom log summary
- AI recommendation cards (loaded asynchronously with shimmer skeletons)
- Quick-action buttons: Log Symptom, Chat with AI

### 2.2 Medication Management
- View all prescribed medications with dosage and schedule
- Daily medication logging (mark as taken/missed)
- Medication history with calendar view

### 2.3 Symptom Logging
- Form-based symptom entry (symptom text, severity 1-5, timestamp)
- Recent symptoms list with infinite scroll (cursor-based pagination)

### 2.4 Patient Timeline
- Unified timeline of medication logs, symptom entries, and AI recommendations
- Infinite scroll with cursor-based pagination
- Skeleton loaders for each entry
- Filter by type (medication, symptom, AI insight)

---

## Phase 3: AI Features (Lovable AI Gateway)

### 3.1 AI Chat Interface
- Conversational chat with streaming responses (SSE)
- Messages persisted in `chat_messages` table
- Typing indicator during AI generation
- Patient context sent to AI (medications, recent symptoms, adherence data)
- AI acts as a health assistant — answers medication questions, symptom guidance

### 3.2 AI Recommendation Engine
- Edge function that analyzes patient data and generates recommendations
- **Adherence Detection**: Flags missed medication patterns
- **Side-Effect Pattern Detection**: Correlates symptoms with medications
- **Risk Scoring**: Assigns risk level to patients based on adherence + symptoms
- Results stored in `ai_recommendations` table
- Triggered on symptom log or missed medication events

### 3.3 AI Alerts
- When risk score exceeds threshold, auto-create alert for assigned doctor
- Alert severity levels: low, medium, high, critical
- Alerts displayed on both patient and doctor dashboards

---

## Phase 4: Doctor Experience

### 4.1 Doctor Dashboard
- Paginated patient list with search and filter by risk score
- Patient cards showing: name, adherence %, risk level, last activity
- Click-through to detailed patient view

### 4.2 Patient Detail View (Doctor)
- Full medication list and adherence history
- Symptom log timeline
- AI recommendations and risk history
- Action buttons: Add note, Acknowledge alert, Flag for review

### 4.3 Alert Management
- List of active alerts sorted by severity
- Acknowledge/resolve alerts with notes
- Audit log entry on every doctor action

---

## Phase 5: Admin Panel

### 5.1 User Management
- Paginated user list with role filter
- Assign/change user roles
- Deactivate accounts

### 5.2 System Overview
- Total users, active patients, alerts today
- Basic system metrics cards
- Recent audit log entries

---

## Phase 6: Marketing Homepage

### 6.1 Landing Page
- Hero section with product value proposition
- Feature highlights (AI monitoring, doctor alerts, medication tracking)
- How it works section
- CTA to sign up
- No authenticated data, fast static load

---

## Technical Approach

- **Frontend**: React + TypeScript + Tailwind + shadcn/ui components
- **Backend**: Lovable Cloud (Supabase) — database, auth, edge functions, RLS
- **AI**: Lovable AI Gateway via edge functions (Gemini model for chat + analysis)
- **Pagination**: Cursor-based for all list APIs, infinite scroll on timelines
- **Loading States**: Shimmer skeletons for lists, typing dots for AI, progress indicators
- **Security**: RLS on all tables, `has_role()` function, audit logging, no raw SQL exposure

