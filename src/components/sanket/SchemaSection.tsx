"use client";

import { motion } from "framer-motion";

type Field = {
  name: string;
  type: string;
  key?: "pk" | "fk" | "idx";
  note?: string;
};

type Table = {
  name: string;
  group: string;
  fields: Field[];
};

const tables: Table[] = [
  {
    name: "doctors",
    group: "Identity",
    fields: [
      { name: "id", type: "uuid", key: "pk" },
      { name: "abha_hpr_id", type: "text", key: "idx", note: "HPR registry" },
      { name: "name", type: "text" },
      { name: "specialty", type: "text" },
      { name: "facility_hfr_id", type: "text", note: "HFR registry" },
      { name: "languages", type: "text[]" },
      { name: "created_at", type: "timestamptz" },
    ],
  },
  {
    name: "patients",
    group: "Identity",
    fields: [
      { name: "id", type: "uuid", key: "pk" },
      { name: "abha_id", type: "text", key: "idx", note: "14-digit ABHA" },
      { name: "name", type: "text" },
      { name: "phone", type: "text", key: "idx" },
      { name: "preferred_lang", type: "text" },
      { name: "literacy_tier", type: "text" },
      { name: "consent_artifacts", type: "jsonb" },
    ],
  },
  {
    name: "consultations",
    group: "Encounter",
    fields: [
      { name: "id", type: "uuid", key: "pk" },
      { name: "doctor_id", type: "uuid", key: "fk" },
      { name: "patient_id", type: "uuid", key: "fk" },
      { name: "audio_uri", type: "text" },
      { name: "duration_sec", type: "int" },
      { name: "detected_langs", type: "text[]" },
      { name: "status", type: "text" },
      { name: "started_at", type: "timestamptz" },
    ],
  },
  {
    name: "transcripts",
    group: "Encounter",
    fields: [
      { name: "id", type: "uuid", key: "pk" },
      { name: "consultation_id", type: "uuid", key: "fk" },
      { name: "raw_text", type: "text" },
      { name: "segments", type: "jsonb" },
      { name: "asr_model", type: "text" },
      { name: "wer_estimate", type: "numeric" },
    ],
  },
  {
    name: "clinical_notes",
    group: "FHIR",
    fields: [
      { name: "id", type: "uuid", key: "pk" },
      { name: "consultation_id", type: "uuid", key: "fk" },
      { name: "fhir_bundle", type: "jsonb" },
      { name: "icd10_codes", type: "text[]", key: "idx" },
      { name: "snomed_codes", type: "text[]", key: "idx" },
      { name: "doctor_approved_at", type: "timestamptz" },
      { name: "abdm_push_status", type: "text" },
    ],
  },
  {
    name: "entities",
    group: "FHIR",
    fields: [
      { name: "id", type: "uuid", key: "pk" },
      { name: "note_id", type: "uuid", key: "fk" },
      { name: "kind", type: "text" },
      { name: "text", type: "text" },
      { name: "snomed_id", type: "text", key: "idx" },
      { name: "negated", type: "bool" },
      { name: "confidence", type: "numeric" },
    ],
  },
  {
    name: "patient_summaries",
    group: "Patient",
    fields: [
      { name: "id", type: "uuid", key: "pk" },
      { name: "consultation_id", type: "uuid", key: "fk" },
      { name: "lang", type: "text" },
      { name: "summary_text", type: "text" },
      { name: "tts_uri", type: "text" },
      { name: "readability_score", type: "numeric" },
      { name: "empathy_pass", type: "bool" },
    ],
  },
  {
    name: "reminders",
    group: "Patient",
    fields: [
      { name: "id", type: "uuid", key: "pk" },
      { name: "patient_id", type: "uuid", key: "fk" },
      { name: "consultation_id", type: "uuid", key: "fk" },
      { name: "kind", type: "text" },
      { name: "cron_expr", type: "text" },
      { name: "next_fire_at", type: "timestamptz", key: "idx" },
      { name: "voice_text", type: "text" },
      { name: "tts_uri", type: "text" },
      { name: "active", type: "bool" },
    ],
  },
  {
    name: "reminder_logs",
    group: "Patient",
    fields: [
      { name: "id", type: "uuid", key: "pk" },
      { name: "reminder_id", type: "uuid", key: "fk" },
      { name: "fired_at", type: "timestamptz" },
      { name: "delivery", type: "text" },
      { name: "played", type: "bool" },
      { name: "acknowledged", type: "bool" },
    ],
  },
];

const keyBadge = (k?: string) => {
  if (k === "pk")
    return <span className="text-[0.55rem] font-mono text-[#F5C518]">PK</span>;
  if (k === "fk")
    return <span className="text-[0.55rem] font-mono text-[#8A8A8A]">FK</span>;
  if (k === "idx")
    return <span className="text-[0.55rem] font-mono text-[#5A5A5A]">IDX</span>;
  return null;
};

export function SchemaSection() {
  const groups = Array.from(new Set(tables.map((t) => t.group)));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="space-y-12">
          {groups.map((group, gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="num-marker">{group.toUpperCase()}</span>
                <div className="h-px flex-1 bg-[#1C1C1C]" />
                <span className="text-[0.65rem] font-mono text-[#5A5A5A]">
                  {tables.filter((t) => t.group === group).length} tables
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables
                  .filter((t) => t.group === group)
                  .map((table, ti) => (
                    <motion.div
                      key={ti}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: ti * 0.05 }}
                      className="border border-[#1C1C1C] rounded-sm overflow-hidden bg-[#0D0D0D] lift-card"
                    >
                      {/* Table header */}
                      <div className="px-4 py-2.5 border-b border-[#1C1C1C] flex items-center justify-between bg-[#111111]">
                        <span className="font-mono text-sm font-semibold text-[#F5C518]">
                          {table.name}
                        </span>
                        <span className="text-[0.55rem] font-mono uppercase tracking-[0.2em] text-[#3A3A3A]">
                          table
                        </span>
                      </div>
                      {/* Fields */}
                      <div className="divide-y divide-[#161616]">
                        {table.fields.map((f, fi) => (
                          <div
                            key={fi}
                            className="px-4 py-2 flex items-center justify-between gap-2 hover:bg-[#161616] transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 text-right">
                                {keyBadge(f.key)}
                              </span>
                              <span className="font-mono text-xs text-[#D4D4D4] truncate">
                                {f.name}
                              </span>
                            </div>
                            <span className="font-mono text-[0.65rem] text-[#5A5A5A] shrink-0">
                              {f.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Indexing & partitioning notes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden"
        >
          {[
            {
              t: "Partitioning",
              b: "reminder_logs is partitioned monthly on fired_at — at scale this table grows 10M+ rows/month. Old partitions get archived to cold storage after 90 days for DPDP retention limits.",
            },
            {
              t: "Hot indexes",
              b: "reminders.next_fire_at is the hottest index in the system — the scheduler polls it every 30s. We use a BRIN index, not B-tree, because the column is naturally time-ordered and the table is huge.",
            },
            {
              t: "PII isolation",
              b: "patients and clinical_notes.fhir_bundle are encrypted with per-patient envelope keys (AWS KMS in-region). The audio_uri field is just a pointer; raw audio lives in a separate KMS-encrypted S3 bucket with 30-day TTL.",
            },
          ].map((p, i) => (
            <div key={i} className="bg-[#0A0A0A] p-6">
              <div className="num-marker mb-2">{p.t}</div>
              <p className="text-[0.8rem] text-[#8A8A8A] leading-relaxed">
                {p.b}
              </p>
            </div>
          ))}
        </motion.div>
    </div>
  );
}
