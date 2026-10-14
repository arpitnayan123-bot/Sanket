"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SectionLabel } from "./Shell";

type RedTeamCaseMeta = {
  id: string;
  label: string;
  lang_pair: string;
  desc: string;
  expected: {
    medications_min?: number;
    conditions_min?: number;
    must_contain?: string[];
  };
  transcript_preview: string;
};

type Validation = {
  medications_count: number;
  conditions_count: number;
  expected_meds_min?: number;
  expected_conds_min?: number;
  meds_pass: boolean;
  conds_pass: boolean;
  must_contain: string[];
  must_contain_pass: boolean[];
  overall_pass: boolean;
};

type CaseResult = {
  case_id: string;
  label: string;
  lang_pair: string;
  ok: boolean;
  ms: number;
  error?: string;
  validation: Validation;
};

type RedTeamResponse = {
  total: number;
  passed: number;
  failed: number;
  pass_rate: number;
  total_ms: number;
  results: CaseResult[];
};

export function RedTeamSection() {
  const [cases, setCases] = useState<RedTeamCaseMeta[]>([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RedTeamResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/api/sanket/redteam")
      .then((r) => r.json())
      .then((data) => { if (data.cases) setCases(data.cases); })
      .catch(() => {});
  }, []);

  const runRedTeam = async () => {
    setRunning(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/sanket/redteam", { method: "POST" });
      const data: RedTeamResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Red-team run failed");
    } finally {
      setRunning(false);
    }
  };

  const passRate = result ? Math.round(result.pass_rate * 100) : 0;
  const passColor = result == null ? "#5A5A5A" : result.pass_rate >= 0.66 ? "#F5C518" : result.pass_rate >= 0.33 ? "#8A8A8A" : "#EF4444";

  return (
    <section id="redteam" className="relative py-24 sm:py-32 border-t border-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionLabel
          number="07"
          title="Red-team — code-switching stress tests."
          subtitle="Three cases designed to break a naive scribe: Tamil+English, Bengali+English, and a brutal Hindi+Tamil+English mix. We assert the Scribe extracted at least the minimum medication/condition count and that specific brand names appear in the output. Run all three at once."
        />

        {/* Cases overview — minimal grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden mb-8">
          {(cases.length
            ? cases
            : [
                { id: "rt-tamil-htn", label: "Tamil + English · HTN", lang_pair: "ta + en", desc: "Chennai IT worker, Tanglish consult", expected: { medications_min: 2, conditions_min: 1, must_contain: ["Telmisartan", "Amlodipine", "150/96"] }, transcript_preview: "Doctor: Vaango Karthik, enna aachchu?..." },
                { id: "rt-bengali-dm", label: "Bengali + English · DM", lang_pair: "bn + en", desc: "Kolkata homemaker, Banglish, DM follow-up", expected: { medications_min: 2, conditions_min: 1, must_contain: ["Metformin", "Glimepiride", "142"] }, transcript_preview: "Doctor: Boshun Madhuri-di. Aaj ki kemon achen?..." },
                { id: "rt-mixed-3lang", label: "Hindi + Tamil + English", lang_pair: "hi + ta + en", desc: "Migrant worker — hardest case", expected: { medications_min: 2, conditions_min: 1, must_contain: ["Rantac", "Oflox"] }, transcript_preview: "Doctor: Bhai Velu, baitho. Yeh batao, kya hua?..." },
              ]
          ).map((c, i) => {
            const caseResult = result?.results.find((r) => r.case_id === c.id);
            const isDone = caseResult != null;
            const caseColor = isDone ? (caseResult!.validation.overall_pass ? "#F5C518" : "#EF4444") : "#1C1C1C";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-[#0A0A0A] p-6 lift-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 text-[0.55rem] font-mono font-bold uppercase text-[#5A5A5A] border border-[#2A2A2A] rounded-sm">{c.lang_pair}</span>
                      {isDone && (
                        <span className="px-1.5 py-0.5 text-[0.55rem] font-mono font-bold rounded-sm" style={{ background: `${caseColor}20`, color: caseColor }}>
                          {caseResult!.validation.overall_pass ? "PASS" : "FAIL"}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold leading-tight">{c.label}</h4>
                  </div>
                  {isDone && <span className="font-mono text-[0.65rem] text-[#5A5A5A]">{(caseResult!.ms / 1000).toFixed(1)}s</span>}
                </div>
                <p className="text-[0.7rem] text-[#5A5A5A] leading-relaxed mb-4">{c.desc}</p>

                {/* Assertions */}
                <div className="space-y-2">
                  <div className="num-marker">Asserts</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.expected.must_contain?.map((s, j) => {
                      const pass = caseResult?.validation.must_contain_pass[j];
                      return (
                        <span
                          key={j}
                          className={`px-1.5 py-0.5 text-[0.6rem] font-mono rounded-sm border ${
                            pass == null ? "text-[#5A5A5A] border-[#1C1C1C]"
                            : pass ? "text-[#F5C518] border-[#F5C518]/30 bg-[#F5C518]/5"
                            : "text-red-400 border-red-500/30 bg-red-500/5"
                          }`}
                        >
                          {pass === true && "✓ "}{pass === false && "✗ "}{s}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 text-[0.65rem] font-mono text-[#5A5A5A] pt-1">
                    <span>
                      meds ≥ {c.expected.medications_min}
                      {isDone && <span style={{ color: caseResult!.validation.meds_pass ? "#F5C518" : "#EF4444" }}> → {caseResult!.validation.medications_count}</span>}
                    </span>
                    <span>
                      conds ≥ {c.expected.conditions_min}
                      {isDone && <span style={{ color: caseResult!.validation.conds_pass ? "#F5C518" : "#EF4444" }}> → {caseResult!.validation.conditions_count}</span>}
                    </span>
                  </div>
                </div>

                {/* Transcript preview */}
                <div className="mt-4 border-l-2 border-[#1C1C1C] pl-3">
                  <p className="text-[0.65rem] font-mono text-[#3A3A3A] leading-snug line-clamp-2">{c.transcript_preview}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Run controls */}
        <div className="border-t border-b border-[#1C1C1C] py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="num-marker mb-1">Test suite</div>
            <h3 className="display-md">Run all 3 code-switching cases</h3>
            <p className="mt-2 text-sm text-[#8A8A8A] max-w-xl">
              Each case fires fresh Scribe inference. Validates that brand names, dosage values, and medication count survive the code-switch. Expect ~60–90s total.
            </p>
          </div>
          <button
            onClick={runRedTeam}
            disabled={running}
            className="btn-yellow shrink-0 disabled:bg-[#1A1A1A] disabled:text-[#5A5A5A] disabled:hover:translate-y-0"
          >
            {running ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" /><path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                Running suite...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M9 12l2 2 4-4M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Run Red-Team Suite
              </>
            )}
          </button>
        </div>

        {/* Results panel */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 border border-red-500/30 bg-red-500/5 rounded-sm p-4">
              <div className="text-[0.6rem] uppercase tracking-[0.2em] text-red-400 font-mono mb-1">Error</div>
              <div className="text-xs text-red-300/80 font-mono">{error}</div>
            </motion.div>
          )}
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8">
              {/* Summary bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden mb-6">
                <div className="bg-[#0A0A0A] p-5">
                  <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#5A5A5A] font-mono mb-1">Pass rate</div>
                  <div className="text-3xl font-serif-display font-semibold" style={{ color: passColor }}>{passRate}%</div>
                </div>
                <div className="bg-[#0A0A0A] p-5">
                  <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#5A5A5A] font-mono mb-1">Passed</div>
                  <div className="text-3xl font-serif-display font-semibold text-[#F5C518]">{result.passed}</div>
                </div>
                <div className="bg-[#0A0A0A] p-5">
                  <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#5A5A5A] font-mono mb-1">Failed</div>
                  <div className="text-3xl font-serif-display font-semibold text-red-400">{result.failed}</div>
                </div>
                <div className="bg-[#0A0A0A] p-5">
                  <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#5A5A5A] font-mono mb-1">Total time</div>
                  <div className="text-3xl font-serif-display font-semibold text-[#FAFAFA]">{(result.total_ms / 1000).toFixed(1)}s</div>
                </div>
              </div>

              {/* Pass-rate bar */}
              <div className="h-1 bg-[#1C1C1C] overflow-hidden mb-8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${passRate}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full"
                  style={{ background: passRate >= 66 ? "#F5C518" : passRate >= 33 ? "#8A8A8A" : "#EF4444" }}
                />
              </div>

              {/* Per-case breakdown */}
              <div className="space-y-3">
                <div className="num-marker mb-3">Per-case breakdown</div>
                {result.results.map((r, i) => (
                  <div key={i} className={`border rounded-sm p-4 ${r.validation.overall_pass ? "border-[#F5C518]/20 bg-[#F5C518]/[0.02]" : "border-red-500/20 bg-red-500/[0.02]"}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.validation.overall_pass ? "#F5C518" : "#EF4444" }} />
                        <span className="text-sm font-semibold">{r.label}</span>
                        <span className="px-1.5 py-0.5 text-[0.55rem] font-mono font-bold uppercase text-[#5A5A5A] border border-[#2A2A2A] rounded-sm">{r.lang_pair}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[0.65rem] font-mono text-[#5A5A5A]">
                        <span>{(r.ms / 1000).toFixed(1)}s</span>
                        <span className="px-2 py-0.5 rounded-sm font-bold" style={{ background: r.validation.overall_pass ? "rgba(245,197,24,0.15)" : "rgba(239,68,68,0.15)", color: r.validation.overall_pass ? "#F5C518" : "#EF4444" }}>
                          {r.validation.overall_pass ? "PASS" : "FAIL"}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[0.7rem] font-mono">
                      <div className="bg-[#0A0A0A] px-2.5 py-1.5 border border-[#1C1C1C]">
                        <span className="text-[#5A5A5A]">Meds: </span>
                        <span style={{ color: r.validation.meds_pass ? "#F5C518" : "#EF4444" }}>{r.validation.medications_count} / ≥{r.validation.expected_meds_min ?? "-"}</span>
                      </div>
                      <div className="bg-[#0A0A0A] px-2.5 py-1.5 border border-[#1C1C1C]">
                        <span className="text-[#5A5A5A]">Conds: </span>
                        <span style={{ color: r.validation.conds_pass ? "#F5C518" : "#EF4444" }}>{r.validation.conditions_count} / ≥{r.validation.expected_conds_min ?? "-"}</span>
                      </div>
                      <div className="bg-[#0A0A0A] px-2.5 py-1.5 border border-[#1C1C1C] col-span-2">
                        <span className="text-[#5A5A5A]">Asserts: </span>
                        {r.validation.must_contain.map((s, j) => (
                          <span key={j} className="mr-1.5" style={{ color: r.validation.must_contain_pass[j] ? "#F5C518" : "#EF4444" }}>
                            {r.validation.must_contain_pass[j] ? "✓" : "✗"}{s}{" "}
                          </span>
                        ))}
                      </div>
                    </div>
                    {r.error && <p className="mt-2 text-[0.65rem] text-red-400 font-mono">{r.error}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Methodology */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden">
          <div className="bg-[#0A0A0A] p-5">
            <div className="num-marker mb-2">Why this matters</div>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              A scribe trained on pure English or pure Hindi will hallucinate when a doctor says &quot;idam erukku&quot; mid-sentence. These three cases probe exactly the failure modes that break naive production systems — and they&apos;re the same cases we&apos;d use to red-team any competitor&apos;s model.
            </p>
          </div>
          <div className="bg-[#0A0A0A] p-5">
            <div className="num-marker mb-2">What &quot;passing&quot; means</div>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              Each case has three assertions: (1) extracted meds count ≥ minimum, (2) conditions count ≥ minimum, (3) every brand name in must_contain appears somewhere in the FHIR JSON (case-insensitive substring). A pass means the Scribe handled code-switching without dropping entities.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
