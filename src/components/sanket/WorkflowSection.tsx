"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "./Shell";

const steps = [
  {
    n: "01",
    title: "Audio Capture",
    role: "Doctor side",
    body: "Doctor opens the Sanket tile inside their existing EMR. MediaRecorder captures consult audio at 16kHz mono Opus. Streaming WebSocket pushes 250ms chunks server-side — no file wait.",
    tech: ["MediaRecorder", "WSS 250ms", "Opus 16kHz"],
  },
  {
    n: "02",
    title: "Transcribe & Extract",
    role: "Doctor · LLM",
    body: "IndicWhisper-v2 transcribes code-switched Hindi/Tamil/Bengali+English. Llama 3.3 70B (vLLM, 4-bit) runs structured extraction → emits FHIR R4 Bundle with ICD-10 + SNOMED CT bindings.",
    tech: ["IndicWhisper-v2", "Llama 3.3 70B · vLLM", "FHIR R4", "ICD-10 / SNOMED"],
  },
  {
    n: "03",
    title: "Empathy Translate",
    role: "Patient · LLM",
    body: "The same FHIR note is fed to a second LLM persona — the Empathy Translator. It rewrites the diagnosis, the medication plan and the follow-up into a 5th-grade reading level in the patient's ABHA-preferred language.",
    tech: ["Persona-2 Llama 3.3", "5th-grade level", "ABHA lang"],
  },
  {
    n: "04",
    title: "Voice & Reminders",
    role: "Patient · App",
    body: "Patient App receives a JSON payload. AI4Bharat Indic-TTS renders the summary as a voice note. The scheduler spawns per-medication cron jobs that fire voice reminders — 'Subah nashta ke baad safed goli lo' — at the right IST time, even offline.",
    tech: ["Indic-TTS", "APNS / FCM + local cron", "Offline-first"],
  },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="relative py-24 sm:py-32 border-t border-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionLabel
          number="02"
          title="One pipeline. Four stages. Zero forms."
          subtitle="Audio in, voice out. Each stage is independently scalable, observable, and replayable — so a doctor can correct a transcript without re-running the whole chain."
        />

        {/* 4 columns with vertical hairlines between */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#0A0A0A] p-7 flex flex-col h-full lift-card relative group"
            >
              {/* Big number */}
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-4xl font-serif-display font-semibold text-[#F5C518]">
                  {s.n}
                </span>
                <span className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-[#5A5A5A]">
                  {s.role}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-3 tracking-tight">{s.title}</h3>

              <p className="text-sm text-[#8A8A8A] leading-relaxed flex-1">
                {s.body}
              </p>

              <div className="mt-5 pt-5 border-t border-[#1C1C1C] flex flex-wrap gap-1.5">
                {s.tech.map((t, j) => (
                  <span
                    key={j}
                    className="px-1.5 py-0.5 text-[0.65rem] font-mono text-[#5A5A5A] border border-[#1C1C1C] rounded-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timing strip — minimal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 justify-center border-t border-[#1C1C1C] pt-6"
        >
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-[#5A5A5A] font-mono">
            End-to-end target
          </div>
          {[
            { t: "0.3s", l: "ASR stream" },
            { t: "1.8s", l: "LLM extract" },
            { t: "0.6s", l: "Empathy" },
            { t: "0.4s", l: "TTS render" },
            { t: "≈ 3.1s", l: "Approve → patient" },
          ].map((x, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#2A2A2A]">/</span>}
              <div>
                <div className="font-mono text-sm font-semibold text-[#FAFAFA]">
                  {x.t}
                </div>
                <div className="text-[0.6rem] text-[#5A5A5A] uppercase tracking-[0.15em]">
                  {x.l}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
