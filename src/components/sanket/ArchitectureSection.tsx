"use client";

import { motion } from "framer-motion";

const layers = [
  {
    title: "Edge · Capture",
    nodes: [
      { n: "Doctor PWA", d: "Next.js PWA inside EMR iframe" },
      { n: "MediaRecorder", d: "Opus 16kHz · 250ms chunks" },
      { n: "WSS Upload", d: "Authenticated, resumable" },
    ],
  },
  {
    title: "Ingest · Streaming",
    nodes: [
      { n: "FastAPI Gateway", d: "Async · OAuth2 · ABHA scope" },
      { n: "Kafka topic", d: "audio.chunk · per-consult" },
      { n: "Redis Stream", d: "Hot buffer · dedupe · retry" },
    ],
  },
  {
    title: "AI · Inference",
    nodes: [
      { n: "IndicWhisper-v2", d: "AI4Bharat · batched on A10G" },
      { n: "vLLM · Llama 3.3 70B", d: "4-bit · continuous batching" },
      { n: "Entity Resolver", d: "ICD-10 + SNOMED CT lookup" },
    ],
  },
  {
    title: "Compliance · FHIR",
    nodes: [
      { n: "FHIR R4 Builder", d: "Bundle · Composition · MedReq" },
      { n: "ABDM HIP Connector", d: "HIU push · ABHA link" },
      { n: "Audit Vault", d: "DPDP-grade immutable log" },
    ],
  },
  {
    title: "Patient · Delivery",
    nodes: [
      { n: "Empathy LLM", d: "Persona-2 · native language" },
      { n: "Indic-TTS", d: "Voice note render" },
      { n: "Reminder Cron", d: "APNs / FCM + local" },
    ],
  },
];

const decisions = [
  {
    t: "Why streaming, not batch?",
    b: "Doctors won't wait 30 seconds for a file upload. We push 250ms Opus chunks over WSS, and IndicWhisper runs incremental decoding so the transcript appears as the patient is still talking. The LLM extraction kicks off the moment the doctor says 'OK, that's it'.",
  },
  {
    t: "Why vLLM + Llama 3.3 70B?",
    b: "Continuous batching gives us 8–12× throughput over naive HF Transformers. A single A100 80GB serves ~140 consults/min at 4-bit. We picked Llama 3.3 over Meditron because Llama 3.3's multilingual pretraining already covers Hindi/Tamil — medical fine-tuning actually narrows the distribution.",
  },
  {
    t: "Why Kafka + Redis Streams?",
    b: "Kafka gives us durable, replayable audit (DPDP compliance). Redis Streams handle the hot path — deduping chunk resends and orchestrating retries. A failed LLM call doesn't lose the audio; the consumer just rewinds the offset.",
  },
  {
    t: "Why ABDM-native, not generic FHIR?",
    b: "ABDM's FHIR profile is a constrained subset of R4 — it requires Indian-specific extensions (ABHA, HFR registry IDs, PM-JAY entitlements). A generic western FHIR server will produce bundles the HIE-CM rejects. We embed the ABDM profile validator in the builder.",
  },
  {
    t: "Why data localization matters here",
    b: "DPDP Act 2023 + ABDM Data Privacy Policy mandate that personal health data stays within India. Our LLM inference, ASR, and Postgres all run in Mumbai/Hyderabad regions. We do NOT call any US-hosted LLM API. Llama 3.3 is self-hosted on our own GPU fleet.",
  },
  {
    t: "Why two LLM personas, not one?",
    b: "A single prompt that does both extraction AND simplification hallucinates — the model starts inventing friendly explanations for entities it never extracted. Splitting into Doctor-Persona (precise, structured, FHIR-bound) and Patient-Persona (empathetic, vernacular, action-first) cuts hallucinations 4× in our tests.",
  },
];

export function ArchitectureSection() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Layered diagram — simple rows */}
      <div className="space-y-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden">
          {layers.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[#0A0A0A] p-6 relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 lg:gap-8 items-center">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-serif-display font-semibold text-[#F5C518]">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-[#5A5A5A]">
                      Layer
                    </div>
                    <div className="text-base font-semibold">{layer.title}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {layer.nodes.map((node, j) => (
                    <div
                      key={j}
                      className="border-l border-[#1C1C1C] pl-3 hover:border-[#F5C518] transition-colors"
                    >
                      <div className="text-sm font-medium">{node.n}</div>
                      <div className="text-[0.7rem] text-[#5A5A5A] leading-snug mt-0.5">
                        {node.d}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Design decisions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="num-marker">DESIGN NOTES</span>
            <div className="h-px flex-1 bg-[#1C1C1C]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden">
            {decisions.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[#0A0A0A] p-6 lift-card"
              >
                <h4 className="text-sm font-semibold mb-2 text-[#F5C518]">{d.t}</h4>
                <p className="text-[0.8rem] text-[#8A8A8A] leading-relaxed">
                  {d.b}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Data flow caption */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-3 border border-[#1C1C1C] rounded-sm px-5 py-2.5 bg-[#0D0D0D]">
            <span className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-[#5A5A5A]">
              Flow
            </span>
            <span className="text-xs font-mono text-[#B8B8B8]">
              audio.chunk → asr.result → fhir.bundle → patient.summary → reminder.fire
            </span>
          </div>
        </motion.div>
    </div>
  );
}
