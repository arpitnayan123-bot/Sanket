"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "./Shell";

const stats = [
  {
    value: "70%",
    label: "lack basic health literacy",
    detail:
      "Most patients leave the clinic unable to recall the diagnosis, dosage, or follow-up date. Adherence collapses within 72 hours.",
  },
  {
    value: "1:1700",
    label: "doctor-to-patient ratio in rural India",
    detail:
      "A single MBBS doctor sees 60–80 patients a day. There is no time to write a structured note, let alone counsel each patient.",
  },
  {
    value: "₹0",
    label: "currently paid per clinical note by most EMRs",
    detail:
      "Existing Indian EMRs (Practo, Eka Care) are scheduling tools. Nobody has solved the actual documentation burden.",
  },
  {
    value: "0.5",
    label: "minutes a doctor spends per patient on notes today",
    detail:
      "Most notes are illegible scrawls on paper Rx pads — invisible to ABDM, unusable for continuity of care.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionLabel
          number="01"
          title="India doesn't have a doctor shortage. It has a documentation crisis."
          subtitle="The Ayushman Bharat Digital Mission built the rails — ABHA IDs, FHIR APIs, HIE-CM. What's missing is the engine that turns a 2-minute noisy conversation into structured, actionable, vernacular care."
        />

        {/* 2x2 grid of stats — minimal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[#0A0A0A] p-8 lift-card"
            >
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-5xl sm:text-6xl font-serif-display font-semibold tracking-tightest">
                  {s.value}
                </div>
                <span className="text-[0.65rem] font-mono text-[#3A3A3A]">
                  0{i + 1} / 04
                </span>
              </div>
              <div className="text-sm font-medium text-[#FAFAFA] mb-3">
                {s.label}
              </div>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                {s.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Insight strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-10 border-t border-b border-[#1C1C1C] py-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 items-start">
            <div>
              <div className="num-marker mb-3">The wedge</div>
              <p className="display-md text-balance">
                Doctors won&apos;t adopt software that adds clicks. Patients
                won&apos;t adhere to instructions they can&apos;t{" "}
                <span className="underline-yellow">hear</span> or{" "}
                <span className="underline-yellow">understand</span>.
              </p>
              <p className="mt-5 lede">
                Sanket sits in the one place nobody has claimed — the audio
                bridge between the doctor&apos;s mouth and the patient&apos;s
                ear. We don&apos;t replace the EMR. We make it unnecessary to
                type into one.
              </p>
            </div>

            <div className="border border-[#1C1C1C] rounded-sm p-5 bg-[#0D0D0D]">
              <div className="num-marker mb-3">Tailwinds</div>
              <ul className="space-y-2.5 text-sm">
                {[
                  "ABDM goes nationwide — 2025 mandate",
                  "DPDP Act 2023 — data localization",
                  "PM-JAY 500M beneficiaries need FHIR",
                  "Telemedicine 2020 — audio-first legal",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[#B8B8B8]">
                    <span className="text-[#F5C518] mt-0.5 font-mono">→</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
