"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "./Shell";

const revenueStreams = [
  {
    name: "B2B SaaS · Per-Doctor",
    pricing: "₹2,500 – ₹6,000 / doctor / month",
    volume: "Tiered by consult volume",
    detail:
      "Sold to clinic chains (Apollo, Fortis, Manipal), standalone practitioners, and government PHCs via the ABDM integrator program. Free 30-day pilot, then per-doctor seat license. Includes unlimited consults, ABDM sync, and 1,000 patient reminders/month. Overages billed at ₹0.40/reminder.",
    moat: "Locks in the doctor's muscle memory. Once a doctor has done 200 consults with Sanket, going back to typing feels medieval.",
  },
  {
    name: "B2B2C · Clinic & Hospital",
    pricing: "₹40,000 – ₹2,50,000 / facility / month",
    volume: "Site license, all doctors",
    detail:
      "White-labeled deployment inside a hospital's EMR. Includes custom prompts for their specialty (cardiology, oncology), on-prem GPU option for data-sovereignty-sensitive chains, and direct ABDM-HIE integration with their facility ID. Revenue share with the EMR vendor (10–15%).",
    moat: "Multi-year contracts with integration lock-in. The FHIR profile we build for one chain becomes a switching cost — competitors would have to rebuild it.",
  },
  {
    name: "API-as-a-Service · Platform",
    pricing: "₹0.80 – ₹3.50 per API call",
    volume: "Usage-based, pay-as-you-go",
    detail:
      "Other health-tech startups, telemedicine apps, and insurance companies use Sanket's API for: (a) IndicWhisper transcription at ₹0.80/min, (b) FHIR extraction at ₹2/call, (c) Empathy translation at ₹3.50/call. This turns our inference cost into a margin business at scale.",
    moat: "The code-switching ASR + medical NER combo is genuinely hard. We've already eaten the GPU cost; competitors would have to fund a year of fine-tuning.",
  },
  {
    name: "Pharma · Adherence Data",
    pricing: "₹50L – ₹2Cr / study / quarter",
    volume: "Cohort access, anonymized",
    detail:
      "We sit on the largest real-world adherence dataset in India — when patients take their meds, when they miss, what reminders actually work. Sun Pharma, Cipla, USV, and clinical research orgs pay for cohort-level insights. Strictly anonymized, consented, and DPDP-compliant. Never individual-level data.",
    moat: "Network effect. Every new doctor onboarded grows the dataset. Every new reminder fired improves the model. Competitors start from zero.",
  },
];

const defensibility = [
  { t: "Code-switching NLP moat", b: "IndicWhisper-v2 + medical NER for Hinglish is 18 months of fine-tuning on labeled consults. No western model (Whisper-large-v3, Canary) handles 'sugar thoda high hai doctor sahab' well. Practo and Eka Care would have to hire an entire AI4Bharat-scale team." },
  { t: "ABDM-native regulatory moat", b: "We are an ABDM-compliant HIP from day one. ABHA linking, HFR facility registration, consent-manager integration — these take 4–6 months of paperwork and audits per facility. A foreign entrant can't fast-track this. Government gives preferential integration to early-compliant players." },
  { t: "Doctor workflow lock-in", b: "Doctors don't change tools mid-career. Once Sanket's voice-capture becomes a habit, switching costs are real — they'd have to go back to typing. This is why we're free for the first 30 days: we're buying a habit, not a sale." },
  { t: "Patient data network effect", b: "Every reminder fired tells us what works: 'after breakfast' outperforms '8 AM' by 3.2×. 'Lal capsule' beats 'Ranitidine 150mg' by 5×. This data trains the next version of the Empathy prompt. Bigger Sanket gets → smarter Sanket gets → harder to catch." },
  { t: "Vernacular TTS pipeline", b: "Our Indic-TTS pipeline with pre-cached voice notes is a moat in itself. Building this from scratch means handling 22 languages, 4 accents each, and edge-caching 50MB of audio per patient. Most competitors would ship a 3rd-party TTS that lags on low-end phones." },
  { t: "Two-persona prompt architecture", b: "Our prompts are 6 months of red-teaming. We know which banned words break empathy, which FHIR edge cases break extraction, which soft-diagnosis phrasings work. This knowledge is in our prompt files — copyable in principle, but only after you've made all the mistakes we already made." },
];

export function MonetizationSection() {
  return (
    <section id="moat" className="relative py-24 sm:py-32 border-t border-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionLabel
          number="09"
          title="Monetization & moat — built for India, defensible against the giants."
          subtitle="Four revenue streams that compound on each other. The moat isn't one thing — it's the cumulative switching cost of ABDM compliance, code-switching NLP, doctor habit, and a vernacular adherence dataset that grows daily."
        />

        {/* Revenue streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden mb-12">
          {revenueStreams.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[#0A0A0A] p-6 lift-card relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="num-marker mb-1">STREAM 0{i + 1}</div>
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-semibold text-[#F5C518]">{s.pricing.split("–")[0]}</div>
                  {s.pricing.includes("–") && <div className="text-[0.65rem] text-[#5A5A5A]">to {s.pricing.split("–")[1]}</div>}
                </div>
              </div>
              <div className="text-[0.7rem] text-[#5A5A5A] mb-3 font-mono">{s.volume}</div>
              <p className="text-xs text-[#B8B8B8] leading-relaxed mb-4">{s.detail}</p>
              <div className="pt-3 border-t border-[#1C1C1C]">
                <div className="num-marker mb-1" style={{ color: "#5A5A5A" }}>MOAT</div>
                <p className="text-xs text-[#8A8A8A] leading-relaxed italic">{s.moat}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Defensibility matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="num-marker">SIX LAYERS OF DEFENSIBILITY</span>
            <div className="h-px flex-1 bg-[#1C1C1C]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden">
            {defensibility.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[#0A0A0A] p-5 lift-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[0.6rem] font-mono font-bold text-[#F5C518]">M{String(i + 1).padStart(2, "0")}</span>
                  <h4 className="text-sm font-semibold">{d.t}</h4>
                </div>
                <p className="text-[0.78rem] text-[#8A8A8A] leading-relaxed">{d.b}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Competitor comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 border border-[#1C1C1C] rounded-sm p-6 sm:p-8 bg-[#0D0D0D]"
        >
          <h3 className="display-md mb-1">Why Practo and Eka Care can&apos;t just copy us</h3>
          <p className="text-sm text-[#8A8A8A] mb-6">They are scheduling businesses. We are a documentation business. Different DNA.</p>

          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-[#1C1C1C]">
                  <th className="text-left py-3 px-2 font-mono text-[0.65rem] text-[#5A5A5A] uppercase tracking-[0.15em]">Capability</th>
                  <th className="text-center py-3 px-2 font-mono text-xs text-[#F5C518]">Sanket</th>
                  <th className="text-center py-3 px-2 font-mono text-xs text-[#5A5A5A]">Practo</th>
                  <th className="text-center py-3 px-2 font-mono text-xs text-[#5A5A5A]">Eka Care</th>
                  <th className="text-center py-3 px-2 font-mono text-xs text-[#5A5A5A]">Western EMRs</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  ["Code-switched ASR (Hinglish/Tanglish)", true, false, false, false],
                  ["FHIR R4 + ABDM-native bundle", true, false, true, false],
                  ["Doctor-side: voice → structured note", true, false, false, false],
                  ["Patient-side: vernacular voice summary", true, false, false, false],
                  ["Daily voice reminders in 22+ languages", true, false, false, false],
                  ["Works offline on 2G / cheap phones", true, false, false, false],
                  ["Self-hosted Llama (data localization)", true, false, false, false],
                  ["ABHA + PM-JAY entitlement aware", true, false, true, false],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#161616] hover:bg-[#111111]">
                    <td className="py-3 px-2 text-[#D4D4D4]">{row[0]}</td>
                    {row.slice(1).map((v, j) => (
                      <td key={j} className="text-center py-3 px-2">
                        {v ? (
                          <span className="inline-flex h-5 w-5 rounded-sm bg-[#F5C518]/15 items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-[#F5C518]"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 rounded-sm bg-[#0A0A0A] items-center justify-center">
                            <span className="h-0.5 w-2.5 bg-[#3A3A3A]" />
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
