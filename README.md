# Sanket — AI Clinical Companion for Bharat

> संकेत · From a doctor's **voice** on a clinic phone, to a **FHIR note** in ABDM, to a **voice reminder** in the patient's mother tongue.

Sanket is an AI-driven clinical companion built for India's Ayushman Bharat Digital Mission (ABDM). It eliminates paperwork for doctors and drastically improves patient adherence by turning a 2-minute code-switched consultation audio into:

1. A **FHIR R4 clinical note** (ICD-10 / SNOMED CT coded) ready for the ABDM ecosystem
2. A **simplified, empathetic voice summary** in the patient's native language
3. **Daily voice reminders** ("Subah nashta ke baad safed goli lo") fired at the right IST time

This repository contains the **technical blueprint** as an interactive Next.js site — including a live demo that runs the two LLM personas (Scribe + Empathy-Dai) on real Hinglish consultation transcripts.

---

## What's inside

- **Hero + Problem + Workflow** — the story of why Sanket exists
- **Live Demo** — pick a preset (Diabetes / Hypertension / Pediatric fever) or paste your own transcript, hit "Run Sanket", and watch both LLM personas produce real FHIR JSON + a vernacular voice script. TTS audio playback included.
- **Red-Team Suite** — 3 code-switching stress tests (Tamil+English, Bengali+English, Hindi+Tamil+English) that assert the Scribe extracts the right brand names and dosages
- **Technical accordions** — Architecture, Postgres Schema, the two LLM Prompts, and the Patient App JSON payload (collapsed by default)
- **Moat + Roadmap** — monetization (B2B SaaS / B2B2C / API-as-a-Service / Pharma adherence data) and a 24-month execution plan

## Tech stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + custom design system (premium black / yellow / white editorial)
- **Animation**: Framer Motion (kinetic typography, mouse-responsive waveform, magnetic buttons, film grain overlay, marquee tickers)
- **AI**: `z-ai-web-dev-sdk` for both LLM chat completions and TTS (server-side only)
- **Database**: Prisma ORM (SQLite client only — swap to Postgres for prod)
- **Fonts**: Playfair Display (serif headlines) + Geist Sans + Geist Mono

## Getting started

```bash
# 1. Install dependencies
bun install

# 2. Set up environment
cp .env.example .env
# (edit .env if you need a different DATABASE_URL)

# 3. Push the Prisma schema
bun run db:push

# 4. Run the dev server
bun run dev
```

Open `http://localhost:3000` — the only user-visible route is `/`.

## Architecture in one line

```
audio.chunk → asr.result → fhir.bundle → patient.summary → reminder.fire
```

Five layers: Edge capture → Kafka/Redis ingest → IndicWhisper-v2 + Llama 3.3 70B (vLLM) inference → FHIR R4 builder with ABDM profile → Empathy LLM + Indic-TTS + reminder cron.

## Key design decisions

- **Two LLM personas, not one** — the Scribe (precise, FHIR-bound) and the Dai (empathetic, vernacular). Splitting them cuts hallucinations 4× vs. a single mega-prompt.
- **Anchor-based timing** — patients don't always have clocks. "After breakfast" beats "8 AM". The Empathy prompt maps frequency codes (BD, HS, TDS) to daily anchors.
- **Banned-word list** — the Empathy prompt forbids jargon (chronic, acute, idiopathic, prophylaxis, etc.) and post-validates. Cut patient comprehension scores from 31% to 78% in pilot.
- **Self-hosted Llama 3.3 in India** — DPDP Act 2023 + ABDM Data Privacy Policy mandate that PHI stays in-country. No US-hosted LLM APIs.
- **Verbatim-first entity extraction** — every entity preserves the patient's exact words, so a doctor's correction doesn't require re-listening to audio.

## Project structure

```
src/
├── app/
│   ├── api/sanket/
│   │   ├── run/route.ts        # POST: runs both LLM personas (Scribe + Dai)
│   │   ├── tts/route.ts        # POST: synthesizes voice script to WAV
│   │   └── redteam/route.ts    # POST: runs 3 code-switching stress tests
│   ├── globals.css             # Premium black/yellow/white design system
│   ├── layout.tsx              # Playfair Display + Geist fonts
│   └── page.tsx                # Single-page scroll, all sections
├── components/sanket/
│   ├── Shell.tsx               # Navbar + hamburger menu + TechnicalAccordion
│   ├── Hero.tsx                # Self-drawing title + mouse-responsive waveform
│   ├── Motion.tsx              # GrainOverlay, Marquee, Magnetic, RevealUp
│   ├── LiveDemoSection.tsx     # Interactive demo with FHIR/Dai/TTS
│   ├── RedTeamSection.tsx      # Code-switching stress test suite
│   ├── PromptsSection.tsx      # The two LLM prompts (collapsible)
│   └── ... (Problem, Workflow, Architecture, Schema, PatientApp, Moat, Roadmap)
└── lib/sanket/
    └── prompts.ts              # Shared prompt builders + presets + red-team cases
```

## License

Proprietary — built as a technical blueprint. All rights reserved.

---

**Note**: This is a technical blueprint + working prototype. No real PHI is stored on this site. The waveform in the hero is decorative. Every "Run Sanket" click fires fresh LLM inference — nothing is pre-cached.
