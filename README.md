# Communications Assistant

A professional internal communications suite built with Next.js, React, Tailwind CSS, and TypeScript. The application provides key artificial intelligence utilities to draft campaigns, create structured meeting agendas, and generate executive summaries with action items.

---

## Architecture Overview

The system is designed with a modern, decoupled client-server architecture using the Next.js App Router.

### Frontend Layer
- **Framework**: React 19 and Next.js 16 (App Router).
- **Styling**: Tailwind CSS v4 utilizing custom dark-mode aesthetics, glassmorphism effects, and smooth CSS transitions.
- **State Management**: React state hooks coupled with clientside persistence (`localStorage`) to cache historical drafts and generated elements locally.
- **Icons**: Lucide React.

### Backend/API Layer
- **API Routes**: Next.js route handlers (`/api/campaign`, `/api/agenda`, `/api/summary`) serve as the intermediate layer to parse requests, enforce schemas, and format prompts.
- **LLM Client Orchestration**: A custom orchestrator (`src/lib/claude.ts`) handles API communications with the language model provider.
- **Resilience and Fallbacks**:
  1. **Primary**: Anthropic Claude API using `claude-3-5-sonnet-latest`.
  2. **Secondary Fallback**: Google Gemini API (`gemini-2.5-flash`) via direct HTTP invocation if Anthropic credentials are absent.
  3. **Development Mock**: Pre-configured mock responses with simulated latency for local testing without active API keys.

---

## Directory Structure

```text
├── src/
│   ├── app/
│   │   ├── agenda/
│   │   │   └── page.tsx         # Meeting Agenda Generator UI
│   │   ├── api/
│   │   │   ├── agenda/
│   │   │   │   └── route.ts     # Agenda API handler
│   │   │   ├── campaign/
│   │   │   │   └── route.ts     # Campaign API handler
│   │   │   └── summary/
│   │   │   │   └── route.ts     # Summary API handler
│   │   ├── campaign/
│   │   │   └── page.tsx         # Campaign Message Drafter UI
│   │   ├── summary/
│   │   │   └── page.tsx         # Follow-up Summarizer UI
│   │   ├── globals.css          # Tailwind CSS global styles
│   │   ├── layout.tsx           # Base HTML wrap and layout styling
│   │   └── page.tsx             # Interactive dashboard home
│   ├── components/
│   │   └── Navbar.tsx           # Header Navigation
│   └── lib/
│       ├── claude.ts            # LLM client orchestrator & fallback system
│       └── prompts.ts           # System prompts and instruction templates
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler rules
└── next.config.ts               # Next.js configurations
```

---

## Feature Specifications

### 1. Campaign Message Drafter
- **Path**: `/campaign`
- **Purpose**: Drafts announcements, Slack updates, or emails tailored to specific target audiences.
- **Variables**: Subject, Target Audience, Tone (Professional, Informative, Inspirational, Urgent), Format (Slack post, Email, General Announcement), and Key Points.

### 2. Meeting Agenda Generator
- **Path**: `/agenda`
- **Purpose**: Creates structured, time-blocked meeting agendas.
- **Variables**: Title, Duration (Minutes), Key Attendees, and Goals.
- **Output**: Chronologically organized schedule block detailing objectives and assigned leads.

### 3. Follow-up Summarizer
- **Path**: `/summary`
- **Purpose**: Transforms raw meeting transcripts and scratchpad notes into formal follow-up summaries.
- **Variables**: Raw Notes / Transcript.
- **Output**: Structured executive summary complete with clear, assigned action items and deadline indicators.

---

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` configuration file in the project root:
   ```env
   # Primary LLM Provider
   ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # Secondary Fallback Provider
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running Locally
To launch the development server with Turbopack:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

### Verification and Building
To run the TypeScript compilation check and create an optimized production build:
```bash
npm run build
```

To run the linter:
```bash
npm run lint
```
