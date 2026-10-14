"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SectionLabel } from "./Shell";

type Preset = {
  id: string;
  label: string;
  desc: string;
  transcript_preview: string;
};

type MedReminders = {
  medication_id?: string;
  voice_line?: string;
  anchor?: string;
  duration_days?: number;
  do_not_miss?: boolean;
  warning?: string | null;
  reassurance?: string;
};

type EmpathyOut = {
  summary_audio_text?: string;
  summary_written_text?: string;
  medications?: MedReminders[];
  red_flags_return?: string[];
  follow_up_voice?: string;
  lifestyle_tips?: string[];
  needs_doctor_call?: boolean;
  self_closing_line?: string;
};

type StageInfo = { ok: boolean; ms: number; error?: string };
type RunResult = {
  preset_id: string;
  stages: { scribe: StageInfo; empathy: StageInfo };
  scribe?: unknown;
  empathy?: EmpathyOut;
  total_ms: number;
};

const anchorColor: Record<string, string> = {
  breakfast: "#F5C518",
  lunch: "#FAFAFA",
  dinner: "#8A8A8A",
  sleep: "#5A5A5A",
  sunrise: "#F5C518",
  sunrise_doodh: "#F5C518",
};

function MiniWaveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-3">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-[#F5C518]"
          animate={active ? { height: [`${30 + i * 3}%`, `${90 - i * 2}%`, `${40 + i * 4}%`] } : { height: "20%" }}
          transition={{ duration: 0.5 + (i % 4) * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }}
          style={{ height: "30%" }}
        />
      ))}
    </div>
  );
}

export function LiveDemoSection() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [activePreset, setActivePreset] = useState<string>("diabetes");
  const [transcript, setTranscript] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"idle" | "scribe" | "empathy" | "done" | "error">("idle");
  const [result, setResult] = useState<RunResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch("/api/sanket/run")
      .then((r) => r.json())
      .then((data) => {
        if (data.presets) {
          setPresets(data.presets);
          loadDefaultTranscript("diabetes");
        }
      })
      .catch(() => {});
  }, []);

  const loadDefaultTranscript = (id: string) => {
    const defaults: Record<string, string> = {
      diabetes: `Doctor: Namaste Sunita ji, baithiye. Aaj kya hua?
Patient: Doctor sahab, pichle kuch din se bahut pyas lag rahi hai, aur baar baar peshab jana pad raha hai. Raat ko 3-4 baar uthna padta hai.
Doctor: Kitne din se ye problem?
Patient: Lagbhag 10-12 din se.
Doctor: Koi aur problem? Chakkar aana, thakaan, weight kam hona?
Patient: Haan doctor, thakaan bahut rehti hai. Aur pichle mahine lagbhag 3 kilo weight kam hua.
Doctor: Family mein kisi ko diabetes hai?
Patient: Haan, mere papa ko sugar thi.
Doctor: Theek hai. BP check karte hain... 140/90. Thoda high hai. Ab blood test karna hoga - fasting sugar, HbA1c, aur lipid profile.
Doctor: Abhi main aapko teen dawa de raha hoon. Metformin 500mg - subah nashte ke baad ek goli. Glimepiride 2mg - subah khane se pehle. Amlodipine 5mg - raat ko sone se pehle. Teeno 30 din tak lena.
Doctor: Sugar bhag hi jayega thoda, ghabrane ki baat nahi. Meetha bilkul band, roz subah 30 minute walk karein. 15 din baad wapas aaiye report le kar.`,
      hypertension: `Doctor: Hello Amit, please sit down. What's troubling you?
Patient: Doctor sahab, pichle 2 hafte se sar mein bahut dard rehta hai, especially subah uthte hi.
Doctor: Work stress kaisa hai? Sleep kitna mil raha?
Patient: IT job hai, 10-12 ghante kaam karna padta hai. Sleep 5-6 ghante milti hai.
Doctor: Smoking ya alcohol?
Patient: Occasionally drink, smoking nahi karta.
Doctor: Father ko koi heart issue tha?
Patient: Haan, father ko bypass surgery hua tha 5 saal pehle.
Doctor: Okay. BP check karte hain - 160/100. Bahut high hai. ECG bhi karna hoga.
Doctor: Dawa - Telmisartan 40mg ek goli subah, aur Amlodipine 5mg raat ko. Dono 30 din. Roz lena, miss mat karna. Salt kam khayein.
Doctor: 2 hafte baad wapas aaiye BP check karne ke liye. Agar bahut tezz sar dard ho, vomiting ho, ya aankhon ke aage andhera aaye toh turant emergency jana.`,
      "pediatric-fever": `Doctor: Pooja ji, bete ko kya hua?
Mother: Doctor, Aarav ko pichle 3 din se bukhar hai. Raat ko 102-103 rehta hai. Crocin de rahi hoon thodi der ke liye theek hota hai phir wapas aata hai.
Doctor: Koi aur lakshan? Khansi, sardi, pet kharab?
Mother: Khansi hai thodi, balgam wali. Khana kam kha raha hai.
Doctor: Breathing mein koi problem?
Mother: Nahi doctor, saans toh theek hai.
Doctor: Theek hai. Bachche ko dekhte hain. Throat thoda red hai, chest clear hai. Viral fever lag raha hai. Abhi blood test ya antibiotic ki zaroorat nahi.
Doctor: Crocin 5ml - har 6 ghante ek baag, sirf bukhar 100 se upar ho toh. Antibiotic nahi chahiye abhi. Bahut jaldi theek ho jayega. Khana normal khilayein, paani zyada pilayein.
Doctor: Agar bukhar 5 din tak na jaye, ya pet mein dard ho, ya rashes aa jayein, ya bachka sosakta hai - tab turant wapas aana.`,
    };
    setTranscript(defaults[id] || "");
  };

  const onPresetChange = (id: string) => {
    setActivePreset(id);
    loadDefaultTranscript(id);
    setResult(null);
    setStage("idle");
    setErrorMsg("");
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioError("");
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const playVoice = async () => {
    if (!result?.empathy?.summary_audio_text) return;
    if (audioUrl) {
      const el = document.getElementById("sanket-audio-player") as HTMLAudioElement | null;
      if (el) {
        if (isPlaying) { el.pause(); setIsPlaying(false); }
        else { await el.play(); setIsPlaying(true); }
      }
      return;
    }
    setAudioLoading(true);
    setAudioError("");
    try {
      const res = await fetch("/api/sanket/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: result.empathy.summary_audio_text + (result.empathy.self_closing_line ? " " + result.empathy.self_closing_line : ""),
          voice: "tongtong",
          speed: 0.95,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `TTS failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setTimeout(async () => {
        const el = document.getElementById("sanket-audio-player") as HTMLAudioElement | null;
        if (el) {
          try { await el.play(); setIsPlaying(true); } catch { /* */ }
        }
      }, 100);
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : "TTS failed");
    } finally {
      setAudioLoading(false);
    }
  };

  const downloadFhir = () => {
    if (!result?.scribe) return;
    const blob = new Blob([JSON.stringify(result.scribe, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sanket-fhir-${result.preset_id}-${Date.now()}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadEmpathy = () => {
    if (!result?.empathy) return;
    const blob = new Blob([JSON.stringify(result.empathy, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sanket-empathy-${result.preset_id}-${Date.now()}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const runSanket = async () => {
    setLoading(true);
    setResult(null);
    setErrorMsg("");
    setStage("scribe");
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioError("");
    setIsPlaying(false);
    try {
      const res = await fetch("/api/sanket/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset_id: activePreset, transcript }),
      });
      const data: RunResult = await res.json();
      if (!data.stages.scribe.ok) {
        setStage("error");
        setErrorMsg(data.stages.scribe.error || "Scribe stage failed");
        setResult(data);
      } else if (!data.stages.empathy.ok) {
        setStage("error");
        setErrorMsg(data.stages.empathy.error || "Empathy stage failed");
        setResult(data);
      } else {
        setStage("done");
        setResult(data);
      }
    } catch (err) {
      setStage("error");
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const scribeJson = result?.scribe ? JSON.stringify(result.scribe, null, 2) : "";
  const empathy = result?.empathy;

  return (
    <section id="demo" className="relative py-24 sm:py-32 border-t border-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionLabel
          number="06"
          title="Live demo — run Sanket on a real Hinglish consult."
          subtitle="Pick a preset (or paste your own transcript) and hit Run Sanket. Both LLM personas fire — Scribe extracts FHIR, Dai writes the voice script. Watch the actual JSON come back in real time."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* LEFT: Input panel */}
          <div className="space-y-4">
            {/* Preset selector */}
            <div className="border border-[#1C1C1C] rounded-sm p-5 bg-[#0D0D0D]">
              <div className="num-marker mb-3">01 · Choose a consult</div>
              <div className="space-y-1.5">
                {(presets.length
                  ? presets
                  : [
                      { id: "diabetes", label: "Diabetes · Hinglish", desc: "Middle-aged woman, sugar complaint" },
                      { id: "hypertension", label: "Hypertension · Hinglish", desc: "40yo male, headache, IT worker" },
                      { id: "pediatric-fever", label: "Pediatric fever · Hinglish", desc: "3yo child, mother narrating" },
                    ]
                ).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onPresetChange(p.id)}
                    className={`w-full text-left p-3 rounded-sm border transition-all ${
                      activePreset === p.id
                        ? "border-[#F5C518] bg-[#F5C518]/5"
                        : "border-[#1C1C1C] hover:border-[#2A2A2A]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${activePreset === p.id ? "bg-[#F5C518]" : "bg-[#3A3A3A]"}`} />
                      <span className="text-sm font-medium">{p.label}</span>
                    </div>
                    <div className="text-[0.7rem] text-[#5A5A5A] pl-3.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transcript editor */}
            <div className="border border-[#1C1C1C] rounded-sm p-5 bg-[#0D0D0D]">
              <div className="flex items-center justify-between mb-3">
                <div className="num-marker">02 · Consult transcript</div>
                <button
                  onClick={() => onPresetChange(activePreset)}
                  className="text-[0.65rem] font-mono text-[#5A5A5A] hover:text-[#F5C518] transition-colors"
                >
                  ↺ RESET
                </button>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={9}
                className="w-full bg-[#0A0A0A] border border-[#1C1C1C] rounded-sm p-3 text-xs font-mono text-[#D4D4D4] leading-relaxed resize-y focus:outline-none focus:border-[#F5C518] transition-colors custom-scroll"
                placeholder="Paste a code-switched consultation transcript here..."
              />
              <div className="mt-2 flex items-center justify-between text-[0.65rem] font-mono text-[#5A5A5A]">
                <span>{transcript.length} chars · ~{Math.ceil(transcript.length / 4)} tok</span>
                <span>hi + en</span>
              </div>
            </div>

            {/* Run button */}
            <button
              onClick={runSanket}
              disabled={loading || transcript.trim().length < 20}
              className="w-full btn-yellow disabled:bg-[#1A1A1A] disabled:text-[#5A5A5A] disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <MiniWaveform active />
                  <span>{stage === "scribe" ? "Scribe extracting FHIR..." : "Dai writing voice script..."}</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5"><path d="M5 3l14 9-14 9V3z" fill="currentColor" /></svg>
                  Run Sanket
                </>
              )}
            </button>

            {/* Stage indicators */}
            <AnimatePresence>
              {(loading || stage !== "idle") && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border border-[#1C1C1C] rounded-sm p-4 bg-[#0D0D0D] space-y-2"
                >
                  <StageRow
                    label="Stage 1 · Scribe (FHIR extract)"
                    state={stage === "scribe" ? "running" : result?.stages.scribe.ok ? "done" : stage === "error" ? "error" : "idle"}
                    ms={result?.stages.scribe.ms}
                  />
                  <StageRow
                    label="Stage 2 · Dai (empathy translate)"
                    state={stage === "empathy" ? "running" : result?.stages.empathy.ok ? "done" : stage === "error" && !result?.stages.empathy.ok ? (result.stages.scribe.ok ? "error" : "idle") : "idle"}
                    ms={result?.stages.empathy.ms}
                  />
                  {result && stage === "done" && (
                    <div className="pt-2 mt-2 border-t border-[#1C1C1C] flex items-center justify-between">
                      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#5A5A5A] font-mono">Total roundtrip</span>
                      <span className="font-mono text-sm font-semibold text-[#F5C518]">
                        {(result.total_ms / 1000).toFixed(2)}s
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-red-500/30 bg-red-500/5 rounded-sm p-3"
              >
                <div className="text-[0.6rem] uppercase tracking-[0.2em] text-red-400 font-mono mb-1">Error</div>
                <div className="text-xs text-red-300/80 font-mono">{errorMsg}</div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Output panels */}
          <div className="space-y-4">
            {/* Doctor side: FHIR */}
            <div className="border border-[#1C1C1C] rounded-sm overflow-hidden bg-[#0D0D0D]">
              <div className="px-5 py-3 border-b border-[#1C1C1C] flex items-center justify-between bg-[#111111]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-serif-display font-semibold text-[#F5C518]">01</span>
                  <div>
                    <div className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-[#5A5A5A]">Doctor · Persona 1</div>
                    <div className="text-sm font-semibold">Scribe → FHIR R4 Bundle</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result?.stages.scribe.ok && (
                    <>
                      <button onClick={downloadFhir} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border border-[#F5C518]/30 text-[#F5C518] text-[0.65rem] font-mono font-semibold hover:bg-[#F5C518]/10 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        FHIR.json
                      </button>
                      <span className="text-[0.6rem] font-mono text-[#F5C518]">✓ {result.stages.scribe.ms}ms</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-[#0A0A0A] max-h-[320px] overflow-y-auto custom-scroll">
                {scribeJson ? (
                  <pre className="text-[11px] leading-[1.65] font-mono p-4 text-[#C8C8C8]">{scribeJson}</pre>
                ) : (
                  <div className="p-8 text-center text-xs text-[#5A5A5A]">
                    {loading && stage === "scribe" ? (
                      <div className="flex flex-col items-center gap-3"><MiniWaveform active /><span>Scribe is reading the transcript...</span></div>
                    ) : (<span>The structured FHIR bundle will appear here.</span>)}
                  </div>
                )}
              </div>
            </div>

            {/* Patient side: Voice + Reminders */}
            <div className="border border-[#1C1C1C] rounded-sm overflow-hidden bg-[#0D0D0D]">
              <div className="px-5 py-3 border-b border-[#1C1C1C] flex items-center justify-between bg-[#111111]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-serif-display font-semibold text-[#F5C518]">02</span>
                  <div>
                    <div className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-[#5A5A5A]">Patient · Persona 2</div>
                    <div className="text-sm font-semibold">Dai → Voice summary + reminders</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result?.stages.empathy.ok && (
                    <>
                      <button onClick={downloadEmpathy} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border border-[#1C1C1C] text-[#8A8A8A] text-[0.65rem] font-mono font-semibold hover:border-[#F5C518] hover:text-[#F5C518] transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Dai.json
                      </button>
                      <span className="text-[0.6rem] font-mono text-[#F5C518]">✓ {result.stages.empathy.ms}ms</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4">
                {!empathy ? (
                  <div className="py-8 text-center text-xs text-[#5A5A5A]">
                    {loading && stage === "empathy" ? (
                      <div className="flex flex-col items-center gap-3"><MiniWaveform active /><span>Dai is rewriting in your language...</span></div>
                    ) : (<span>The patient-facing voice script will appear here.</span>)}
                  </div>
                ) : (
                  <>
                    {/* Audio summary card */}
                    <div className="border border-[#1C1C1C] rounded-sm p-4 bg-[#0A0A0A]">
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          onClick={playVoice}
                          disabled={audioLoading}
                          className="h-9 w-9 rounded-full bg-[#F5C518] flex items-center justify-center text-[#0A0A0A] shrink-0 hover:bg-[#FFD52A] active:scale-95 transition-all disabled:opacity-50"
                          title={audioUrl ? "Play / Pause" : "Generate & play voice"}
                        >
                          {audioLoading ? (
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" /><path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                          ) : isPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#5A5A5A] font-mono">Voice note · TTS-ready</div>
                            {audioLoading && <span className="text-[0.6rem] font-mono text-[#F5C518]">synthesizing…</span>}
                            {audioUrl && !audioLoading && <span className="text-[0.6rem] font-mono text-[#F5C518]">{isPlaying ? "playing" : "ready"}</span>}
                          </div>
                          <div className="flex items-end gap-[2px] h-5">
                            {Array.from({ length: 32 }).map((_, i) => (
                              <motion.span
                                key={i}
                                className="w-[2px] rounded-full bg-[#F5C518]"
                                animate={isPlaying ? { height: [`${20 + i * 2}%`, `${80 - i * 1.5}%`, `${30 + i * 1.8}%`] } : {}}
                                transition={{ duration: 0.5 + (i % 4) * 0.08, repeat: Infinity, ease: "easeInOut", delay: i * 0.02 }}
                                style={{ height: `${20 + Math.abs(Math.sin(i / 1.5)) * 80}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#D4D4D4] leading-relaxed">{empathy.summary_audio_text}</p>
                      {empathy.self_closing_line && (
                        <p className="mt-3 pt-3 border-t border-[#1C1C1C] text-sm italic text-[#8A8A8A]">{empathy.self_closing_line}</p>
                      )}
                      {audioError && <p className="mt-2 text-[0.7rem] text-red-400 font-mono">TTS error: {audioError}</p>}
                      {audioUrl && (
                        <audio
                          id="sanket-audio-player"
                          src={audioUrl}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                          controls
                          className="mt-3 w-full h-8"
                        />
                      )}
                    </div>

                    {/* Medications */}
                    {empathy.medications && empathy.medications.length > 0 && (
                      <div>
                        <div className="num-marker mb-2">Daily reminders · auto-scheduled</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {empathy.medications.map((m, i) => (
                            <div key={i} className="border border-[#1C1C1C] rounded-sm p-3 bg-[#0A0A0A]">
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <span className="px-1.5 py-0.5 rounded-sm text-[0.55rem] font-mono font-bold uppercase" style={{ background: `${anchorColor[m.anchor || "breakfast"]}20`, color: anchorColor[m.anchor || "breakfast"] }}>
                                  {m.anchor || "—"}
                                </span>
                                {m.do_not_miss && (
                                  <span className="px-1.5 py-0.5 rounded-sm text-[0.55rem] font-mono font-bold bg-red-500/15 text-red-400">DON&apos;T MISS</span>
                                )}
                              </div>
                              <p className="text-xs text-[#D4D4D4] leading-snug mb-1">{m.voice_line}</p>
                              <div className="flex items-center gap-2 text-[0.65rem] font-mono text-[#5A5A5A]">
                                <span>{m.duration_days} days</span>
                                {m.reassurance && <span>· {m.reassurance}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Red flags */}
                    {empathy.red_flags_return && empathy.red_flags_return.length > 0 && (
                      <div>
                        <div className="num-marker mb-2" style={{ color: "#EF4444" }}>⚠ Return immediately if</div>
                        <ul className="space-y-1.5">
                          {empathy.red_flags_return.map((r, i) => (
                            <li key={i} className="text-xs text-[#B8B8B8] flex items-start gap-2 p-2 border border-red-500/20 bg-red-500/5 rounded-sm">
                              <span className="text-red-400 mt-0.5">▸</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Follow up + lifestyle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {empathy.follow_up_voice && (
                        <div className="border border-[#1C1C1C] rounded-sm p-3 bg-[#0A0A0A]">
                          <div className="num-marker mb-1">Follow-up</div>
                          <p className="text-xs text-[#B8B8B8]">{empathy.follow_up_voice}</p>
                        </div>
                      )}
                      {empathy.lifestyle_tips && empathy.lifestyle_tips.length > 0 && (
                        <div className="border border-[#1C1C1C] rounded-sm p-3 bg-[#0A0A0A]">
                          <div className="num-marker mb-1">Lifestyle</div>
                          <ul className="space-y-1">
                            {empathy.lifestyle_tips.map((t, i) => (
                              <li key={i} className="text-xs text-[#B8B8B8] flex items-start gap-1.5">
                                <span className="text-[#F5C518]">·</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-center text-[0.7rem] text-[#5A5A5A] max-w-2xl mx-auto"
        >
          Both stages run on a real LLM via z-ai-web-dev-sdk. Outputs are not
          pre-cached — every Run click fires fresh inference.
        </motion.p>
      </div>
    </section>
  );
}

function StageRow({ label, state, ms }: { label: string; state: "idle" | "running" | "done" | "error"; ms?: number }) {
  const color = state === "done" ? "#F5C518" : state === "error" ? "#EF4444" : state === "running" ? "#F5C518" : "#3A3A3A";
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <motion.span
          className="h-2 w-2 rounded-full"
          style={{ background: color }}
          animate={state === "running" ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[#B8B8B8]">{label}</span>
      </div>
      <span className="font-mono text-[#5A5A5A] text-[0.7rem]">
        {state === "running" && "running..."}
        {state === "done" && `✓ ${ms}ms`}
        {state === "error" && "failed"}
        {state === "idle" && "—"}
      </span>
    </div>
  );
}
