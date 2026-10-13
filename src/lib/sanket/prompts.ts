// Sanket prompt builders + presets
// Shared between the API route and (potentially) future test runners.

export type Preset = {
  id: string;
  label: string;
  desc: string;
  patient: {
    name: string;
    abha_id: string;
    preferred_lang: string;
    literacy_tier: string;
    respect_tier: "aap" | "tum";
    daily_anchors: string[];
  };
  doctor: { name: string; specialty: string };
  transcript: string;
};

export const PRESETS: Preset[] = [
  {
    id: "diabetes",
    label: "Diabetes · Hinglish",
    desc: "Middle-aged woman, sugar complaint, MBBS GP",
    patient: {
      name: "Sunita Devi",
      abha_id: "91-4234-5678-1234",
      preferred_lang: "hi",
      literacy_tier: "grade5",
      respect_tier: "aap",
      daily_anchors: ["7am nashta", "1pm dopahar", "8pm raat", "10pm sone"],
    },
    doctor: { name: "Dr. Rajesh Kumar", specialty: "General Medicine" },
    transcript: `Doctor: Namaste Sunita ji, baithiye. Aaj kya hua?
Patient: Doctor sahab, pichle kuch din se bahut pyas lag rahi hai, aur baar baar peshab jana pad raha hai. Raat ko 3-4 baar uthna padta hai.
Doctor: Kitne din se ye problem?
Patient: Lagbhag 10-12 din se.
Doctor: Koi aur problem? Chakkar aana, thakaan, weight kam hona?
Patient: Haan doctor, thakaan bahut rehti hai. Aur pichle mahine lagbhag 3 kilo weight kam hua.
Doctor: Family mein kisi ko diabetes hai?
Patient: Haan, mere papa ko sugar thi.
Doctor: Theek hai. BP check karte hain... 140/90. Thoda high hai. Ab blood test karna hoga - fasting sugar, HbA1c, aur lipid profile. Aaj raat se 10 baje se kuch mat khana, kal subah khali pet test karwana.
Patient: Ji doctor.
Doctor: Abhi main aapko teen dawa de raha hoon. Metformin 500mg - subah nashte ke baad ek goli. Glimepiride 2mg - subah khane se pehle. Amlodipine 5mg - raat ko sone se pehle. Teeno 30 din tak lena. Metformin se pet kharaab ho sakta hai, toh khane ke baad hi lena.
Patient: Ji.
Doctor: Sugar bhag hi jayega thoda, ghabrane ki baat nahi. Meetha bilkul band, roz subah 30 minute walk karein. 15 din baad wapas aaiye report le kar. Agar achanak chakkar aaye, saans phoole, toh turant aana. Theek ho jayenge.`,
  },
  {
    id: "hypertension",
    label: "Hypertension · Hinglish",
    desc: "40-year-old male, headache, IT worker",
    patient: {
      name: "Amit Sharma",
      abha_id: "91-9988-7766-5544",
      preferred_lang: "hi",
      literacy_tier: "grade8",
      respect_tier: "aap",
      daily_anchors: ["8am nashta", "1pm lunch", "9pm dinner", "11pm sone"],
    },
    doctor: { name: "Dr. Priya Menon", specialty: "Internal Medicine" },
    transcript: `Doctor: Hello Amit, please sit down. What's troubling you?
Patient: Doctor sahab, pichle 2 hafte se sar mein bahut dard rehta hai, especially subah uthte hi. Aur kuch din se ghumne lagta hai dimaag.
Doctor: Work stress kaisa hai? Sleep kitna mil raha?
Patient: IT job hai, 10-12 ghante kaam karna padta hai. Raat ko 1-2 baje tak jaagta hoon. Sleep 5-6 ghante milti hai.
Doctor: Smoking ya alcohol?
Patient: Occasionally drink, smoking nahi karta.
Doctor: Father ko koi heart issue tha?
Patient: Haan, father ko bypass surgery hua tha 5 saal pehle.
Doctor: Okay. BP check karte hain - 160/100. Bahut high hai. ECG bhi karna hoga, abnormal na ho. Aur blood test - creatinine, lipid profile, thyroid.
Patient: Ji doctor.
Doctor: Dawa - Telmisartan 40mg ek goli subah, aur Amlodipine 5mg raat ko. Dono 30 din. Roj lena, miss mat karna. Salt kam khayein - namkeen, achar, papad bilkul band. Exercise - roz 40 minute walk. Stress kam karne ki koshish karein, 7-8 ghante sleep zaroori hai.
Patient: Theek hai doctor.
Doctor: 2 hafte baad wapas aaiye BP check karne ke liye. Agar bahut tezz sar dard ho, vomiting ho, ya aankhon ke aage andhera aaye toh turant emergency jana. Ye BP ka asar ho sakta hai.`,
  },
  {
    id: "pediatric-fever",
    label: "Pediatric fever · Hinglish",
    desc: "3-year-old child, mother narrating",
    patient: {
      name: "Aarav (child, via mother Pooja)",
      abha_id: "91-1234-9999-8888",
      preferred_lang: "hi",
      literacy_tier: "grade5",
      respect_tier: "aap",
      daily_anchors: ["7am doodh", "12pm dopahar ka khana", "7pm raat ka khana", "9pm sone"],
    },
    doctor: { name: "Dr. Anjali Rao", specialty: "Pediatrics" },
    transcript: `Doctor: Pooja ji, bete ko kya hua?
Mother: Doctor, Aarav ko pichle 3 din se bukhar hai. Raat ko 102-103 rehta hai. Crocin de rahi hoon thodi der ke liye theek hota hai phir wapas aata hai.
Doctor: Koi aur lakshan? Khansi, sardi, pet kharab?
Mother: Khansi hai thodi, balgam wali. Khana kam kha raha hai. Pet se sab normal hai.
Doctor: Breathing mein koi problem? Chhati phool raha hai?
Mother: Nahi doctor, saans toh theek hai.
Doctor: Theek hai. Bachche ko dekhte hain. Throat thoda red hai, chest clear hai. Viral fever lag raha hai. Abhi blood test ya antibiotic ki zaroorat nahi.
Mother: Ji doctor.
Doctor: Crocin 5ml - har 6 ghante ek baag, sirf bukhar 100 se upar ho toh. Antibiotic nahi chahiye abhi. Bahut jaldi theek ho jayega. Khana normal khilayein, paani zyada pilayein.
Mother: Ji.
Doctor: Agar bukhar 5 din tak na jaye, ya pet mein dard ho, ya rashes aa jayein, ya bachka sosakta hai - tab turant wapas aana. Tab blood test karwaenge.
Mother: Theek hai doctor. Dhanyavaad.`,
  },
];

// ============================================================
// RED-TEAM PRESETS — code-switching stress tests
// These exist to probe Scribe's entity extraction on
// non-Hindi code-switched input.
// ============================================================
export type RedTeamCase = {
  id: string;
  label: string;
  lang_pair: string;
  desc: string;
  patient: Preset["patient"];
  doctor: Preset["doctor"];
  transcript: string;
  expected_entities: {
    medications_min?: number;
    conditions_min?: number;
    must_contain?: string[]; // case-insensitive substring check on the raw scribe JSON
  };
};

export const REDTEAM_CASES: RedTeamCase[] = [
  {
    id: "rt-tamil-htn",
    label: "Tamil + English · HTN",
    lang_pair: "ta + en",
    desc: "Chennai IT worker, mother tongue Tamil, consult in Tanglish",
    patient: {
      name: "Karthik R",
      abha_id: "91-8877-6655-4433",
      preferred_lang: "ta",
      literacy_tier: "grade8",
      respect_tier: "aap",
      daily_anchors: ["8am kalai", "1pm mathiyam", "8pm malai", "11pm thounguvathu"],
    },
    doctor: { name: "Dr. Lakshmi S", specialty: "General Medicine" },
    transcript: `Doctor: Vaango Karthik, enna aachchu?
Patient: Doctor, randu vaarama oru thalaivali, innum konjam Mayakkam. Office la night shift work pannen.
Doctor: BP paapom... 150/96. Romba high. Sugar-um paakanum. Family la yeppadi?
Patient: Appa-ku heart problem irunthathu, bypass pannanga.
Doctor: Theekam. ECG-um lipid profile-um blood test pannanum. Tablets: Telmisartan 40mg - daily morning oru tablet; Amlodipine 5mg - night oru tablet. Rendaum 30 naal. Salt-ai kurringa, pickle, papad saakradathinga. Daily 40 min nadandhukonga.
Doctor: 2 weeks later BP check pannikkonga. Thalaivali romba athigamana, vomiting vantha, kaal rendu padinga-na, sudden emergency-ku ponga.`,
    expected_entities: {
      medications_min: 2,
      conditions_min: 1,
      must_contain: ["Telmisartan", "Amlodipine", "150/96"],
    },
  },
  {
    id: "rt-bengali-dm",
    label: "Bengali + English · DM",
    lang_pair: "bn + en",
    desc: "Kolkata homemaker, Banglish consult, diabetes follow-up",
    patient: {
      name: "Madhuri Datta",
      abha_id: "91-2233-4455-6677",
      preferred_lang: "bn",
      literacy_tier: "grade5",
      respect_tier: "aap",
      daily_anchors: ["7am sokal", "1pm dupur", "8pm raat", "10pm ghumiye pora"],
    },
    doctor: { name: "Dr. Soumitra Banerjee", specialty: "Diabetology" },
    transcript: `Doctor: Boshun Madhuri-di. Aaj ki kemon achen?
Patient: Doctor-babu, sugar-er medicine nicchi thik-thak moto. Kintu ga-er shari ami kom, thoda dorkar bodol hoyeche.
Doctor: Cholun ekta sugar test kori. Fasting 142 roche. Thoda high. HbA1c-ao 7.8 koreche. Metformin-er dose barabo. Aj theke Metformin 1000mg - duplicate daily, sokal ar raat. Glimepiride 2mg continue - sokal khawar agey.
Patient: Ji doctor-babu.
Doctor: Ekta BP check kori - 128/82. Emoni cholbe. Insulin ekhono dorkar nai. Mishti obosthayi bondho, chhola, potato kom khabe. Roj sokal bela 30 min walking. Pach ta din por abar asben - fasting sugar ar PP check korabo.
Doctor: Jodi aakhey hothat chokh dhakay, ba mathay khub lagte lage, ba pet kharap hoy - taholei baaje. Turant eshe porben.`,
    expected_entities: {
      medications_min: 2,
      conditions_min: 1,
      must_contain: ["Metformin", "Glimepiride", "142"],
    },
  },
  {
    id: "rt-mixed-3lang",
    label: "Hindi + Tamil + English",
    lang_pair: "hi + ta + en",
    desc: "Cross-region migrant worker, multi-code-switch — hardest case",
    patient: {
      name: "Velu S",
      abha_id: "91-5566-7788-9900",
      preferred_lang: "ta",
      literacy_tier: "grade3",
      respect_tier: "tum",
      daily_anchors: ["7am kalai", "1pm mathiyam", "8pm malai", "10pm thounguvathu"],
    },
    doctor: { name: "Dr. Rajesh Kumar", specialty: "General Medicine" },
    transcript: `Doctor: Bhai Velu, baitho. Yeh batao, kya hua?
Patient: Doctor sahab, pichle 4-5 din se idam erukku - pet mein dard, ulti bhi aayi do baar. Thoda fever-um irukku.
Doctor: Kitna time ho gaya? Khana kaise chal raha?
Patient: Khana time pe nahi milta, site pe kaam hota. Pani kam peeventu. Pet erukku romba valikkuthu.
Doctor: Theek hai. Pet check karta hoon. Thoda tenderness hai right side. BP 100/70 - thoda low hai. Fever 99.4. Blood test - CBC, LFT - aur ek ultrasound pet ka karna padega.
Doctor: Abhi dawa: Rantac 150mg - subah raat ek tablet, 5 din tak. Oflox 200mg - dopahar ke baad ek tablet, 5 din. ORS powder ek packet paani mein mila ke piyo roz 3-4 baar. Khana halka le lo, dal-chawal, dahi.
Doctor: Agar 2 din mein theek na ho, ya pet mein bahut zor se dard ho, ya ulti band na ho - turant wapas aana. IV fluid lagana padega.`,
    expected_entities: {
      medications_min: 2,
      conditions_min: 1,
      must_contain: ["Rantac", "Oflox"],
    },
  },
];

// ============================================================
// PROMPT 1 — MULTILINGUAL MEDICAL TRANSCRIBER + ENTITY EXTRACTOR
// ============================================================
export function buildScribePrompt(p: Preset): string {
  return `You are SANKET-SCRIBE, a senior Indian medical scribe with 15 years of experience in tertiary care hospitals. You are fluent in Hindi, English, Tamil, Bengali, Marathi, Telugu, Kannada, and their code-switched variants (Hinglish, Tanglish, Benglish). You understand Indian medical brand names (Crocin, Augmentin, Dexona, Rantac, Polybion, Voveran) AND their generic equivalents.

Your job: read the consultation transcript and produce ONE strict JSON object containing a structured summary, extracted entities, and a FHIR R4 bundle.

CRITICAL RULES:
1. NEVER invent entities. If the doctor did not say it, do not extract it. If uncertain, set confidence < 0.6 and add to "uncertain" with a reason.
2. Preserve patient's exact words for symptoms — do NOT "correct" them.
3. Mark negations explicitly (negated: true if "no diabetes").
4. Distinguish "history of" (status: "history_of") vs "current complaint" (status: "active").
5. Dosage must include route, frequency, duration, and patient-language instruction. If the doctor said "subah nashte ke baad", that is the instruction verbatim — do NOT reformat to "BD".
6. For each medication, output BOTH brand (if mentioned) and generic. Map to SNOMED CT code (use realistic codes).
7. ICD-10 codes must be specific India-valid codes. For symptoms, use R-codes.
8. "follow_up.when" is the timeframe. "follow_up.reason" must be in patient's preferred language.
9. Red-flag (chest pain, breathing difficulty, suicidal ideation, stroke signs) → red_flag: true + add to urgent_review.
10. Output STRICTLY valid JSON. No markdown fences, no commentary, no prose outside JSON.

DETECTED LANGUAGES: ["hi", "en"]
PATIENT PREFERRED LANGUAGE: ${p.patient.preferred_lang}
PATIENT ABHA ID: ${p.patient.abha_id}
DOCTOR SPECIALTY: ${p.doctor.specialty}

CONSULTATION TRANSCRIPT (verbatim, code-switched):
"""
${p.transcript}
"""

OUTPUT THIS EXACT JSON SHAPE:
{
  "consultation_summary": {
    "chief_complaint": "<one line, patient's words preserved>",
    "history_present_illness": "<2-4 sentences narrative>",
    "examination_findings": ["<finding 1>", "..."],
    "provisional_diagnosis": ["<dx 1>"],
    "differential_diagnosis": ["<alt dx>"]
  },
  "entities": {
    "medications": [
      {
        "verbatim": "<exact words>",
        "brand": "<brand or null>",
        "generic": "<generic>",
        "snomed_code": "<SNOMED CT>",
        "dosage": {
          "strength": "<e.g. 500mg>",
          "route": "<oral|IV|IM|topical|inhaled>",
          "frequency": "<raw instruction in patient lang>",
          "frequency_normalized": "<BD|TDS|QID|HS|PRN|OD|custom>",
          "duration": "<e.g. 30 days>",
          "timing": "<before_food|after_food|empty_stomach|na>"
        },
        "negated": false,
        "confidence": 0.95
      }
    ],
    "conditions": [
      {
        "verbatim": "<words>",
        "name": "<name>",
        "snomed_code": "<code>",
        "icd10_code": "<code>",
        "status": "<active|history_of|resolved|family_history>",
        "negated": false,
        "confidence": 0.9
      }
    ],
    "procedures": [],
    "vitals": [
      { "type": "<bp|pulse|temp|spo2|weight|height|sugar>", "value": "<value>", "verbatim": "<if mentioned>" }
    ],
    "lab_orders": [
      { "name": "<test>", "snomed_code": "<code>", "fasting": "<bool|na>" }
    ]
  },
  "fhir_bundle": {
    "resourceType": "Bundle",
    "type": "document",
    "entry": [
      {
        "resource": {
          "resourceType": "Composition",
          "status": "preliminary",
          "type": { "coding": [{ "system": "http://loinc.org", "code": "11506-3" }] },
          "subject": { "reference": "Patient/patient-1" },
          "author": [{ "reference": "Practitioner/doctor-1" }],
          "title": "Consultation Note",
          "section": [
            { "title": "Chief Complaint", "text": { "div": "<div xmlns='http://www.w3.org/1999/xhtml'>{{chief_complaint}}</div>" } }
          ]
        }
      },
      {
        "resource": {
          "resourceType": "Patient",
          "id": "patient-1",
          "identifier": [{ "system": "https://healthid.abdm.gov.in", "value": "${p.patient.abha_id}" }],
          "name": [{ "text": "${p.patient.name}" }]
        }
      }
    ]
  },
  "follow_up": {
    "when": "<e.g. 15 days>",
    "reason": "<in patient preferred language>",
    "red_flags_to_return": ["<patient-lang phrase>"]
  },
  "uncertain": [],
  "urgent_review": [],
  "red_flag": false,
  "quality_warnings": []
}

Respond with ONLY the JSON object. No explanations.`;
}

// ============================================================
// PROMPT 2 — PATIENT EMPATHY TRANSLATOR (Sanket-Dai)
// ============================================================
export function buildEmpathyPrompt(
  p: Preset,
  scribeOutput: Record<string, unknown>
): string {
  return `You are SANKET-DAI — "dai" meaning elder sister in Hindi, the trusted woman in an Indian family who explains what the doctor said in words the patient actually understands. You are warm, specific, and never scary. You speak like a human, not a pamphlet.

You have 12 years of community-health-nurse experience. You know that "twice daily" means nothing to someone who doesn't own a clock — you say "subah nashte ke baad aur raat sone se pehle". You know "antibiotic course" means nothing — you say "5 din tak lo, beech mein mat chhodna".

YOUR JOB: take the structured clinical output below and produce THREE things in ONE JSON object:
  1. summary_audio_text — 3-6 sentences, plain prose, TTS-ready.
  2. medications[] — per-medication voice hooks for daily reminders.
  3. red_flags_return[] — patient-language phrases for when to come back immediately.

HARD CONSTRAINTS — VIOLATION = FAILURE:
1. Reading level: grade 5 or below. Short sentences. No medical jargon.
2. NEVER use these words: "chronic", "acute", "bilateral", "idiopathic", "symptomatic", "contraindicated", "prophylaxis", "comorbidity", "regimen", "adherence", "contraindication", "hypertension", "diabetes mellitus". Use: "lamba chalta hai", "achanak", "dono taraf", "wajah pata nahi", "lakshan wala", "mana hua", "rokne ke liye", "sath chalne wala bimari", "dawa ka schedule", "poora lena".
3. Never say "you have" a serious diagnosis cold. Soften: "doctor ne bataya ki aapko sugar thoda high hai — iska matlab ye nahi ki bimari hai, bas dhyan rakhna hai".
4. Include ONE line of reason per medicine (4-6 words): "ye dawa sugar kam karne ke liye hai".
5. Include DURATION explicitly: "30 din tak, ek bhi din miss mat karna".
6. Use ANCHORS from the patient's day — NOT clock times.
7. Use "${p.patient.respect_tier}" form of address.
8. Add ONE reassurance line per medicine: "Ghabrane ki baat nahi, ye common dawa hai".
9. For injectables / restricted drugs, output only: "Ye doctor ke paas milega, ghar par nahi lena hai".
10. summary_audio_text: NO parentheses, NO slashes, NO abbreviations, NO bullets. Plain spoken prose. Use "aur" / "phir" as connectors.
11. Each voice_line must be < 15 words (~8s spoken).
12. If diagnosis is potentially fatal (cancer, MI, stroke), DO NOT name it. Output "needs_doctor_call": true with reason.

PATIENT NAME: ${p.patient.name}
PATIENT PREFERRED LANGUAGE: ${p.patient.preferred_lang}
LITERACY TIER: ${p.patient.literacy_tier}
RESPECT TIER: ${p.patient.respect_tier}
PATIENT'S DAILY ANCHORS: ${JSON.stringify(p.patient.daily_anchors)}

STRUCTURED CLINICAL OUTPUT (from doctor-side scribe):
${JSON.stringify(scribeOutput, null, 2)}

OUTPUT THIS EXACT JSON SHAPE:
{
  "summary_audio_text": "<3-6 sentences, plain prose, TTS-ready, native language>",
  "summary_written_text": "<same content with light formatting for tap-to-read view>",
  "medications": [
    {
      "medication_id": "<matches scribe entity>",
      "voice_line": "<8-15 words, native lang, includes anchor timing + ONE reason word>",
      "anchor": "<breakfast|lunch|dinner|sleep|sunrise|sunrise_doodh>",
      "duration_days": <number>,
      "do_not_miss": <bool>,
      "warning": "<one short warning in native lang, or null>",
      "reassurance": "<one short reassurance in native lang>"
    }
  ],
  "red_flags_return": [
    "<patient-lang phrase for when to return immediately>"
  ],
  "follow_up_voice": "<one line, native lang, with timeframe>",
  "lifestyle_tips": ["<one short actionable tip in native lang>"],
  "needs_doctor_call": false,
  "doctor_call_reason": null,
  "self_closing_line": "<warm reassuring closing line in native lang>"
}

Respond with ONLY the JSON object. No explanations.`;
}

// ============================================================
// JSON extraction helper — strips markdown fences + finds JSON
// ============================================================
export function extractJson(text: string): unknown {
  if (!text) throw new Error("Empty LLM response");
  let cleaned = text.trim();

  // Strip ```json ... ``` or ``` ... ``` fences
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Find first { ... last } (most LLMs add prose around JSON)
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}
