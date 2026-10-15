"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "./Shell";

const phases = [
  {
    phase: "Phase 0",
    period: "Months 0 – 2",
    title: "Forge the spine",
    status: "Foundation",
    items: [
      "Stand up FastAPI gateway + Postgres (in-region, Mumbai)",
      "Self-host IndicWhisper-v2 on a single A10G, batched",
      "Self-host Llama 3.3 70B 4-bit on vLLM (1× A100 80GB)",
      "Wire Prompt 1 (scribe) end-to-end with FHIR R4 builder",
      "ABDM sandbox registration as a HIP — get test ABHA IDs",
      "5 friendly-doctor pilot: 100 consults, manual review",
    ],
    exit: "Doctor types nothing for 100 consults. FHIR bundle validates against ABDM sandbox.",
  },
  {
    phase: "Phase 1",
    period: "Months 2 – 4",
    title: "Close the loop",
    status: "Pilot",
    items: [
      "Build Prompt 2 (empathy) with banned-word validator",
      "Integrate AI4Bharat Indic-TTS, pre-cache per consult",
      "Ship the Patient App PWA: voice notes + reminder list",
      "Local-cron + FCM reminder scheduler, IST-aware",
      "Red-flag escalation flow (108 ambulance + doctor call)",
      "30-doctor pilot across 3 cities (Delhi, Pune, Madurai)",
    ],
    exit: "Adherence measured at 65% vs 28% baseline. Doctor NPS > 60.",
  },
  {
    phase: "Phase 2",
    period: "Months 4 – 8",
    title: "Go ABDM-live",
    status: "Production",
    items: [
      "Full ABDM production HIP certification",
      "HFR-registered facility onboarding flow",
      "Consent Manager integration (HIU side)",
      "B2B SaaS launch: per-doctor pricing, 3 clinic chains",
      "Pharma pilot: 1 adherence study with Sun Pharma (diabetes)",
      "Open the API-as-a-Service layer (transcribe + extract)",
    ],
    exit: "1,000 doctors live. 50,000 consults/month. ABDM pushes succeeding at 99.4%.",
  },
  {
    phase: "Phase 3",
    period: "Months 8 – 14",
    title: "Vernacular flywheel",
    status: "Scale",
    items: [
      "Expand to all 22 scheduled languages + 4 major dialects",
      "Specialty prompt packs: cardiology, oncology, OBGYN, pediatrics",
      "On-prem GPU offering for hospital chains (data-sovereignty tier)",
      "PM-JAY integration: free for government PHCs, paid by NHA grant",
      "Adherence dataset reaches 1M annotated reminder fires",
      "Series A: ₹80–120 Cr, led by health-tech focused fund",
    ],
    exit: "10,000 doctors, 8M consults/month. Adherence dataset becomes the moat.",
  },
  {
    phase: "Phase 4",
    period: "Months 14 – 24",
    title: "Become the rails",
    status: "Platform",
    items: [
      "Open the Sanket Voice SDK — any EMR can embed our capture tile",
      "Pharma partnerships: 5 ongoing adherence studies (₹2Cr/qtr each)",
      "Insurance tie-ups: adherence data lowers claims → revenue share",
      "Build a vernacular medical LLM fine-tune on consented data",
      "Expand to South-East Asia (Indonesia, Vietnam, Philippines)",
      "Path to profitability at 25,000-doctor scale",
    ],
    exit: "Sanket is the default documentation layer for Indian healthcare.",
  },
];

export function RoadmapSection() {
  return (
    <section id="roadmap" className="relative py-24 sm:py-32 border-t border-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionLabel
          number="10"
          title="Execution plan — 24 months from zero to rails."
          subtitle="Five phases. Each phase has one exit criterion we won't compromise on. We don't move to the next phase until the previous one's exit metric is hit — no fake-progress theater."
        />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-[#1C1C1C]" />

          <div className="space-y-6">
            {phases.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative pl-12 sm:pl-16"
              >
                {/* Node */}
                <div className="absolute left-0 top-2 h-8 sm:h-12 w-8 sm:w-12 rounded-sm border border-[#F5C518] bg-[#0A0A0A] flex items-center justify-center font-mono text-xs font-bold text-[#F5C518]">
                  {i}
                </div>

                <div className="border border-[#1C1C1C] rounded-sm p-5 sm:p-6 bg-[#0D0D0D] lift-card">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="num-marker">{p.phase}</span>
                    <span className="text-[#3A3A3A]">·</span>
                    <span className="text-xs text-[#5A5A5A] font-mono">{p.period}</span>
                    <span className="ml-auto px-2 py-0.5 text-[0.6rem] font-mono uppercase tracking-[0.15em] text-[#F5C518] border border-[#F5C518]/30 rounded-sm">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">{p.title}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                    {p.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-[#F5C518] mt-1 h-1 w-1 rounded-full shrink-0" />
                        <span className="text-xs text-[#B8B8B8] leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#1C1C1C] flex items-start gap-2">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 mt-0.5 text-[#F5C518]">
                      <path d="M9 12l2 2 4-4M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <div className="num-marker mb-0.5" style={{ color: "#5A5A5A" }}>EXIT CRITERION</div>
                      <p className="text-xs text-[#D4D4D4] italic leading-relaxed">{p.exit}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 border border-[#1C1C1C] rounded-sm p-8 sm:p-12 text-center bg-[#0D0D0D]"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] pulse-yellow" />
            <span className="text-[0.65rem] font-mono uppercase tracking-[0.3em] text-[#5A5A5A]">Ready to build</span>
          </div>
          <h2 className="display-lg text-balance mb-4">
            The blueprint is done.
            <br />
            <span className="text-[#F5C518]">Now we ship.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#8A8A8A] leading-relaxed mb-8">
            Sanket is not a feature. It&apos;s a wedge into the most under-served corner of Indian healthcare — the 60 seconds between a doctor&apos;s last word and a patient walking out the door. Win that minute, and the rest of the stack follows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#hero" className="btn-yellow">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Back to top
            </a>
            <a href="#architecture" className="btn-outline">Re-read the architecture</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#1C1C1C] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-sm bg-[#F5C518] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#0A0A0A]">
                <path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="font-serif-display font-semibold text-sm">Sanket</div>
              <div className="text-[0.65rem] text-[#5A5A5A] font-mono">संकेत · Clinical AI for Bharat</div>
            </div>
          </div>

          <div className="text-[0.7rem] text-[#5A5A5A] font-mono flex flex-wrap gap-x-4 gap-y-1">
            <span>ABDM-compliant</span><span>·</span>
            <span>DPDP 2023</span><span>·</span>
            <span>FHIR R4</span><span>·</span>
            <span>Self-hosted Llama 3.3</span><span>·</span>
            <span>Made in India</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.65rem] text-[#5A5A5A]">
          <div>This is a technical blueprint. No PHI is stored on this page. The waveform above is decorative.</div>
          <div className="font-mono">v1.0 · IST</div>
        </div>
      </div>
    </footer>
  );
}
