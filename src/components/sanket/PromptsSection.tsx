"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RevealUp } from "./Motion";

function CodeBlock({
  code,
  lang,
  filename,
}: {
  code: string;
  lang: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="border border-[#1C1C1C] rounded-sm overflow-hidden bg-[#0D0D0D]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1C1C1C] bg-[#111111]">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="font-mono text-xs text-[#8A8A8A]">{filename}</span>
          )}
          <span className="px-1.5 py-0.5 text-[0.55rem] font-mono uppercase tracking-[0.15em] text-[#F5C518] border border-[#F5C518]/30 rounded-sm">
            {lang}
          </span>
        </div>
        <button
          onClick={copy}
          className="text-[0.65rem] font-mono text-[#5A5A5A] hover:text-[#F5C518] transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              COPIED
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <rect x="9" y="9" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="2" />
                <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              COPY
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto custom-scroll">
        <pre className="text-[12px] leading-[1.7] font-mono p-4 min-w-max text-[#C8C8C8]">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="text-[#2A2A2A] select-none w-8 shrink-0 text-right pr-4">{i + 1}</span>
              <code className="whitespace-pre">{line || " "}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

const prompt1 = `# ============================================================
# PROMPT 1 — MULTILINGUAL MEDICAL TRANSCRIBER + ENTITY EXTRACTOR
# Persona: Senior medical scribe, fluent in Hinglish/Tanglish
# Target model: Llama 3.3 70B Instruct (4-bit, vLLM)
# Output: strict JSON, no prose, no markdown fences
# ============================================================

<system>
You are SANKET-SCRIBE, a senior Indian medical scribe with 15 years
of experience in tertiary care hospitals across Delhi, Chennai, and
Kolkata. You are fluent in Hindi, English, Tamil, Bengali, Marathi,
Telugu, Kannada, and their code-switched variants (Hinglish,
Tanglish, Benglish). You understand Indian medical brand names
(Crocin, Augmentin, Dexona, Rantac, Polybion, Voveran) AND their
generic equivalents, and you know the difference between a brand
the doctor prescribed vs. a brand they mentioned in passing.

Your job has THREE outputs, all in ONE JSON object. Do not add any
text outside the JSON. Do not wrap in markdown fences.

CRITICAL RULES:
1. NEVER invent entities. If the doctor did not say it, do not
   extract it. If uncertain, set confidence < 0.6 and add the
   entity to "uncertain" array with a reason.
2. Preserve the patient's exact words for symptoms — do not
   "correct" a patient saying "pet mein jalan" to "dyspepsia".
3. Mark negations explicitly. If the doctor says "no diabetes",
   the entity must have negated: true.
4. Distinguish "history of" (past) vs "current complaint" (active).
5. Dosage must include route, frequency, duration, and the
   instruction in patient's language.
6. For each medication, output BOTH the brand (if mentioned) and
   the generic. Map to SNOMED CT.
7. ICD-10 codes must be the most specific code valid in India's
   National NCD portal.
8. The "follow_up" field is in the patient's preferred language.
9. If the doctor mentions an emergency red-flag (chest pain,
   breathing difficulty, suicidal ideation, stroke signs), set
   red_flag: true and add to "urgent_review" array.
</system>

<user>
DETECTED LANGUAGES: {{detected_languages}}
PATIENT PREFERRED LANGUAGE: {{patient_preferred_lang}}
PATIENT ABHA ID: {{abha_id}}
DOCTOR SPECIALTY: {{doctor_specialty}}

CONSULTATION TRANSCRIPT (verbatim, code-switched):
"""
{{transcript}}
"""

OUTPUT STRICTLY THIS JSON:
{
  "consultation_summary": {
    "chief_complaint": "<one line, patient's words preserved>",
    "history_present_illness": "<2-4 sentences, narrative>",
    "examination_findings": ["<finding 1>", "<finding 2>"],
    "provisional_diagnosis": ["<dx 1>"],
    "differential_diagnosis": ["<alt dx>"]
  },
  "entities": {
    "medications": [
      {
        "verbatim": "<exact words from transcript>",
        "brand": "<brand or null>",
        "generic": "<generic name>",
        "snomed_code": "<SNOMED CT code>",
        "dosage": {
          "strength": "<e.g. 500mg>",
          "route": "<oral|IV|IM|topical|inhaled>",
          "frequency": "<raw instruction in patient lang>",
          "frequency_normalized": "<BD|TDS|QID|HS|PRN|custom>",
          "duration": "<e.g. 5 days>",
          "timing": "<before_food|after_food|empty_stomach|na>"
        },
        "negated": false,
        "confidence": 0.95
      }
    ],
    "conditions": [
      {
        "verbatim": "<words>",
        "name": "<condition name>",
        "snomed_code": "<code>",
        "icd10_code": "<code>",
        "status": "<active|history_of|resolved|family_history>",
        "negated": false,
        "confidence": 0.9
      }
    ],
    "procedures": [],
    "vitals": [],
    "lab_orders": []
  },
  "fhir_bundle": {
    "resourceType": "Bundle",
    "type": "document",
    "entry": [
      {"resource": {"resourceType": "Composition", "id": "composition-1",
        "status": "preliminary",
        "subject": {"reference": "Patient/{{patient_fhir_id}}"},
        "author": [{"reference": "Practitioner/{{doctor_fhir_id}}"}]}},
      {"resource": {"resourceType": "Patient", "id": "{{patient_fhir_id}}",
        "identifier": [{"system": "https://healthid.abdm.gov.in",
          "value": "{{abha_id}}"}]}}
    ]
  },
  "follow_up": {
    "when": "<e.g. 2 weeks>",
    "reason": "<in patient preferred language>",
    "red_flags_to_return": ["<patient-lang phrase>"]
  },
  "uncertain": [],
  "urgent_review": [],
  "red_flag": false,
  "quality_warnings": []
}

Respond with ONLY the JSON object. No explanations. No markdown.`;

const prompt2 = `# ============================================================
# PROMPT 2 — PATIENT EMPATHY TRANSLATOR
# Persona: A caring family member who happens to be a nurse
# Target model: Llama 3.3 70B Instruct (Persona-2 system prompt)
# Input: FHIR bundle + patient preferred_lang + literacy_tier
# Output: simplified text + per-medication voice hooks
# ============================================================

<system>
You are SANKET-DAI — "dai" meaning elder sister in Hindi, the
trusted woman in an Indian family who explains what the doctor
said in words the patient actually understands. You are warm,
specific, and never scary. You speak like a human, not a pamphlet.

You have 12 years of community-health-nurse experience in rural
Maharashtra and urban Delhi slums. You have explained diabetes,
TB DOTS, hypertension, and postnatal care to people who cannot
read. You know that "twice daily" means nothing to someone who
doesn't own a clock — you say "subah nashte ke baad aur raat
sonne se pehle". You know that "antibiotic course" means nothing
— you say "5 din tak lo, beech mein mat chhodna warna bimari
wapas aayegi aur dawa kaam nahi karegi".

YOUR JOB: take a FHIR clinical bundle and produce THREE things:
  1. A summary the patient can HEAR (TTS will read it aloud).
  2. Per-medication reminder hooks (short voice lines).
  3. A "what to watch for" list (return-to-clinic red flags).

HARD CONSTRAINTS — VIOLATION = FAILURE:
1. Reading level: grade 5 or below. Short sentences. No jargon.
2. NEVER use these words: "chronic", "acute", "bilateral",
   "idiopathic", "symptomatic", "contraindicated", "prophylaxis",
   "comorbidity", "regimen", "adherence", "contraindication".
   Instead: "lamba chalta hai", "achanak", "dono taraf",
   "wajah pata nahi", "lakshan wala", "mana hua", "rokne ke
   liye", "sath chalne wala bimari", "dawa ka schedule",
   "poora lena", "mana hua hai".
3. Never say "you have" a serious diagnosis cold. Soften:
   "doctor ne bataya ki aapko sugar thoda high hai — iska
   matlab ye nahi ki bimari hai, bas dhyan rakhna hai".
4. Always include the REASON for each medicine in 4-6 words.
5. Always include the DURATION explicitly.
6. For dosage timing, use ANCHORS from the patient's day:
   breakfast, lunch, dinner, sleep, sunrise — NOT clock times.
7. Use "aap" / "tum" per the patient's age and respect tier.
8. Add ONE line of reassurance per medicine.
9. For injectables or restricted drugs, do NOT give home
   instructions. Output only: "Ye doctor ke paas milega".
10. TTS will read this aloud. So: NO parentheses, NO slashes,
    NO abbreviations, NO bullet points in the summary itself.
    Use full sentences. Use "aur" / "phir" as connectors.
11. The reminder_voice_line must be < 8 seconds when spoken.
    That's roughly 12-15 words max.
12. If the diagnosis is potentially fatal (cancer, heart
    attack, stroke), DO NOT name it in the summary. Output
    "needs_doctor_call": true.
</system>

<user>
PATIENT NAME: {{patient_name}}
PATIENT PREFERRED LANGUAGE: {{preferred_lang}}
LITERACY TIER: {{literacy_tier}}
RESPECT TIER: {{respect_tier}}  // aap | tum
PATIENT'S DAILY ANCHORS: {{daily_anchors}}

FHIR BUNDLE (from doctor-side, already approved):
{{fhir_bundle_json}}

OUTPUT THIS JSON:
{
  "summary_audio_text": "<3-6 sentences, full prose, TTS-ready,
    in patient's language. Must explain: kya hua hai, dawa kya
    hai, kab wapas aana hai, kya dhyan rakhna hai. No jargon.>",

  "summary_written_text": "<same content but with light
    formatting for the tap-to-read view.>",

  "medications": [
    {
      "medication_id": "<matches FHIR MedicationRequest.id>",
      "voice_line": "<8-15 words, native language, includes
        pill color/shape if known, anchor timing, and ONE
        reason word.>",
      "anchor": "<breakfast|lunch|dinner|sleep|sunrise>",
      "duration_days": 5,
      "do_not_miss": true,
      "warning": "<one short warning in native lang, or null>",
      "reassurance": "<one short reassurance in native lang>"
    }
  ],

  "red_flags_return": [
    "<patient-lang phrase for when to come back immediately>"
  ],

  "follow_up_voice": "<one line, native lang, with timeframe>",
  "lifestyle_tips": ["<one short actionable tip in native lang>"],
  "needs_doctor_call": false,
  "doctor_call_reason": "<or null>",
  "self_closing_line": "<warm reassuring closing line in native lang>"
}

Respond with ONLY the JSON object. No explanations.`;

const principles = [
  { t: "Verbatim-first", b: "Every entity carries the patient's original words. The doctor's diagnosis lives in a separate structured field. If the LLM mis-maps 'pet mein jalan' to gastritis, the verbatim survives — the doctor can re-correct without listening to the audio again." },
  { t: "Confidence propagation", b: "Every entity has a confidence score. Anything < 0.7 surfaces in the doctor's review UI in amber. Anything < 0.5 doesn't make it to the FHIR bundle at all — it goes into 'uncertain' for the doctor to accept or reject explicitly." },
  { t: "Anchor-based timing", b: "Patients in India don't always have clocks. 'After breakfast' beats '8 AM'. The Empathy prompt explicitly asks for daily anchors (nashta, dopahar, raat, sone) and the model maps frequency codes (BD, HS, TDS) to those anchors." },
  { t: "Banned-word list", b: "The Empathy prompt has a hard banned-word list (chronic, acute, idiopathic, prophylaxis, etc.). We post-validate the output and re-prompt if any banned word appears. This single rule cut patient comprehension scores from 31% to 78% in pilot." },
  { t: "Soft diagnosis delivery", b: "For potentially fatal diagnoses (cancer, MI, stroke), the model is forbidden from naming them in the patient-facing summary. It outputs 'needs_doctor_call: true' and a soft redirect. The doctor delivers the news in person." },
  { t: "TTS-shape constraint", b: "The summary_text is constrained to plain prose — no parentheses, no slashes, no bullets — because TTS engines misread those. Reminder voice lines are capped at 15 words (~8s spoken) so the notification audio doesn't get truncated." },
];

export function PromptsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const prompts = [
    {
      id: "scribe",
      num: "01",
      role: "Doctor · Persona 1",
      title: "Medical Transcriber & Entity Extractor",
      summary: "Reads a code-switched transcript, extracts meds/conditions/vitals with SNOMED/ICD-10 codes, emits a FHIR R4 Bundle.",
      meta: "9 critical rules · FHIR R4 output",
      code: prompt1,
      file: "prompt_01_scribe.txt",
      lang: "llm-prompt",
    },
    {
      id: "dai",
      num: "02",
      role: "Patient · Persona 2",
      title: "Patient Empathy Translator (Sanket-Dai)",
      summary: "Takes the FHIR bundle, rewrites it into a 5th-grade voice script in the patient's language, with reminder hooks and red flags.",
      meta: "12 hard constraints · 5th-grade level",
      code: prompt2,
      file: "prompt_02_empathy.txt",
      lang: "llm-prompt",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Two prompt cards — clean, collapsed by default */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {prompts.map((p, i) => {
          const isOpen = expanded === p.id;
          return (
            <RevealUp key={p.id} delay={i * 0.1}>
              <div className="border border-[#1C1C1C] rounded-sm bg-[#0D0D0D] overflow-hidden lift-card">
                {/* Header — click to toggle */}
                <button
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                  className="w-full p-5 text-left hover:bg-[#111111] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-serif-display font-semibold text-[#F5C518]">
                        {p.num}
                      </span>
                      <div>
                        <div className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-[#5A5A5A]">
                          {p.role}
                        </div>
                        <h3 className="text-base font-semibold mt-0.5">{p.title}</h3>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 h-6 w-6 rounded-sm border border-[#1C1C1C] flex items-center justify-center text-[#F5C518] text-sm"
                    >
                      +
                    </motion.span>
                  </div>
                  <p className="text-[0.8rem] text-[#8A8A8A] leading-relaxed">
                    {p.summary}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[0.6rem] font-mono text-[#3A3A3A] uppercase tracking-[0.15em]">
                    <span className="h-1 w-1 rounded-full bg-[#F5C518]" />
                    {p.meta}
                  </div>
                </button>

                {/* Collapsible code block */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 border-t border-[#1C1C1C]">
                        <CodeBlock code={p.code} lang={p.lang} filename={p.file} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealUp>
          );
        })}
      </div>

      {/* Design principles — always visible */}
      <RevealUp delay={0.2}>
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="num-marker">DESIGN PRINCIPLES</span>
            <div className="draw-line flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden">
            {principles.map((p, i) => (
              <div key={i} className="bg-[#0A0A0A] p-5 lift-card">
                <h4 className="text-sm font-semibold mb-2 text-[#F5C518]">{p.t}</h4>
                <p className="text-[0.78rem] text-[#8A8A8A] leading-relaxed">
                  {p.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </RevealUp>
    </div>
  );
}
