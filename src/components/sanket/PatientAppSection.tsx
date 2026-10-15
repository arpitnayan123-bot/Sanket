"use client";

import { motion } from "framer-motion";

const payload = `{
  "schema_version": "1.0.0",
  "consultation_id": "cns_8f3a9c2e1b7d4e6f",
  "patient": {
    "id": "pat_4e2b8c1a9f3d5e7a",
    "abha_id": "91-4234-5678-1234",
    "name": "Sunita Devi",
    "preferred_lang": "hi"
  },
  "doctor": {
    "name": "Dr. Rajesh Kumar",
    "specialty": "General Medicine",
    "facility": "AIIMS, New Delhi"
  },
  "consulted_at": "2026-10-16T11:42:18+05:30",

  "summary_voice_note": {
    "id": "svn_7d2a4c1b9e8f3a6d",
    "lang": "hi",
    "text": "Namaste Sunita ji. Doctor sahab ne bataya ki aapko sugar thoda high hai - iska matlab ye nahi ki bimari hai, bas dhyan rakhna hai. Teen dawa di hain - subah nashte ke baad safed goli, dopahar mein raat wali goli, aur raat sone se pehle lal capsule. 15 din baad wapas aana hai - sugar phir check karenge. Theek ho jaayenge, bas dawa time pe lena aur dhyan rakhna.",
    "tts_uri": "s3://sanket-tts-mumbai/svn_7d2a4c1b9e8f3a6d.opus",
    "duration_sec": 32,
    "fallback_sms": "Doctor ne 3 dawa di hain. Subah nashte baad safed goli, dopahar raat wali goli, raat sone pehle lal capsule. 15 din baad wapas aayein."
  },

  "reminders": [
    {
      "id": "rem_001",
      "kind": "medication",
      "medication_id": "med-1",
      "anchor": "breakfast",
      "anchor_offset_min": 0,
      "days": ["mon","tue","wed","thu","fri","sat","sun"],
      "duration_days": 30,
      "next_fire_at": "2026-10-17T08:00:00+05:30",
      "voice_line": "Subah nashta ke baad safed goli lo - sugar ke liye",
      "tts_uri": "s3://sanket-tts-mumbai/rem_001.opus",
      "pill": { "color": "white", "shape": "round", "count": 30 },
      "do_not_miss": true,
      "acknowledge_required": true
    },
    {
      "id": "rem_002",
      "kind": "medication",
      "medication_id": "med-2",
      "anchor": "lunch",
      "anchor_offset_min": 0,
      "days": ["mon","tue","wed","thu","fri","sat","sun"],
      "duration_days": 30,
      "next_fire_at": "2026-10-17T13:00:00+05:30",
      "voice_line": "Dopahar khane ke baad raat wali goli lo",
      "tts_uri": "s3://sanket-tts-mumbai/rem_002.opus",
      "pill": { "color": "white", "shape": "oval", "count": 30 }
    },
    {
      "id": "rem_003",
      "kind": "medication",
      "medication_id": "med-3",
      "anchor": "sleep",
      "anchor_offset_min": -15,
      "days": ["mon","tue","wed","thu","fri","sat","sun"],
      "duration_days": 30,
      "next_fire_at": "2026-10-17T21:45:00+05:30",
      "voice_line": "Raat sone se pehle lal capsule lo - pet ke liye",
      "tts_uri": "s3://sanket-tts-mumbai/rem_003.opus",
      "pill": { "color": "red", "shape": "capsule", "count": 30 }
    },
    {
      "id": "rem_004",
      "kind": "vitals",
      "anchor": "sunrise",
      "anchor_offset_min": 0,
      "days": ["mon","wed","fri"],
      "next_fire_at": "2026-10-17T06:30:00+05:30",
      "voice_line": "Aaj subah sugar check karna - machine se chip lagao",
      "tts_uri": "s3://sanket-tts-mumbai/rem_004.opus"
    },
    {
      "id": "rem_005",
      "kind": "followup",
      "anchor": null,
      "specific_time": "2026-10-31T10:00:00+05:30",
      "voice_line": "Aaj doctor sahab ke paas jaana hai - sugar report le jana",
      "tts_uri": "s3://sanket-tts-mumbai/rem_005.opus"
    }
  ],

  "red_flags": [
    { "voice": "Agar saans lena mushkil ho toh turant hospital jayein", "action": "emergency_call" },
    { "voice": "Agar chakkar bahut zyada aaye toh doctor ko phone karein", "action": "doctor_call" }
  ],

  "lifestyle_tips": [
    "Roz subah 30 minute walk karein",
    "Meetha cheez kam khayein - chini, mithai, cold drink"
  ],

  "needs_doctor_call": false,
  "self_closing_line": "Theek ho jaayenge, bas dawa time pe lena aur dhyan rakhna. Doctor sahab dua ke saath.",

  "app_meta": {
    "offline_cached": true,
    "tts_engine": "ai4bharat-indic-v2",
    "reminder_engine": "local-cron + fcm-fallback",
    "min_app_version": "1.4.0"
  }
}`;

export function PatientAppSection() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Phone mockup — minimal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24 self-start"
          >
            <div className="mx-auto w-full max-w-[300px] aspect-[9/19] rounded-[2.5rem] bg-[#0A0A0A] border border-[#2A2A2A] p-3 relative overflow-hidden">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-24 rounded-full bg-[#0A0A0A] z-20 border border-[#1C1C1C]" />
              <div className="h-full rounded-[2rem] bg-[#0D0D0D] overflow-hidden flex flex-col">
                {/* Status bar */}
                <div className="pt-9 px-5 pb-2 flex justify-between text-[0.6rem] text-[#5A5A5A] font-mono">
                  <span>9:42</span><span>4G · 78%</span>
                </div>
                {/* Header */}
                <div className="px-5 py-3 border-b border-[#1C1C1C]">
                  <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#F5C518] font-mono">Sanket · Voice</div>
                  <div className="text-sm font-semibold mt-0.5">Dr. Rajesh ki message</div>
                </div>
                {/* Voice note card */}
                <div className="m-3 p-4 rounded-sm bg-[#0A0A0A] border border-[#1C1C1C]">
                  <div className="flex items-center gap-3 mb-3">
                    <button className="h-9 w-9 rounded-full bg-[#F5C518] flex items-center justify-center text-[#0A0A0A]">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                    <div className="flex-1">
                      <div className="flex items-end gap-[2px] h-6">
                        {Array.from({ length: 28 }).map((_, i) => (
                          <span key={i} className="w-[2px] rounded-full bg-[#F5C518]" style={{ height: `${20 + Math.abs(Math.sin(i / 2)) * 80}%` }} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[0.6rem] text-[#5A5A5A] font-mono">0:32</span>
                  </div>
                  <div className="text-[0.7rem] text-[#8A8A8A] leading-snug">
                    &quot;Namaste Sunita ji. Doctor sahab ne bataya ki aapko sugar thoda high hai...&quot;
                  </div>
                </div>
                {/* Reminders */}
                <div className="px-3 pb-3 flex-1 overflow-hidden">
                  <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#5A5A5A] font-mono px-2 mb-2">Aaj ke reminders</div>
                  <div className="space-y-2">
                    {[
                      { t: "08:00", l: "Safed goli · subah", done: true },
                      { t: "13:00", l: "Raat wali goli · dopahar", done: true },
                      { t: "21:45", l: "Lal capsule · sone se pehle", done: false },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-sm bg-[#0A0A0A] border border-[#1C1C1C]">
                        <div className="h-8 w-8 rounded-sm bg-[#F5C518]/10 border border-[#F5C518]/30 flex items-center justify-center text-[0.6rem] font-bold font-mono text-[#F5C518]">{r.t}</div>
                        <div className="flex-1 text-[0.7rem] text-[#B8B8B8] truncate">{r.l}</div>
                        {r.done ? (
                          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#F5C518]"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" /><path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-[#3A3A3A]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Bottom bar */}
                <div className="px-3 py-2 border-t border-[#1C1C1C] flex justify-around text-[0.55rem] text-[#5A5A5A]">
                  <div className="flex flex-col items-center gap-0.5 text-[#F5C518]">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M3 12l9-9 9 9M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Home
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><rect x="3" y="4" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="2" /><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    Schedule
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" /></svg>
                    Help
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* JSON payload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="border border-[#1C1C1C] rounded-sm overflow-hidden bg-[#0D0D0D]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1C1C1C] bg-[#111111]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#8A8A8A]">patient_app_payload.json</span>
                  <span className="px-1.5 py-0.5 text-[0.55rem] font-mono uppercase tracking-[0.15em] text-[#F5C518] border border-[#F5C518]/30 rounded-sm">POST</span>
                </div>
                <span className="text-[0.6rem] font-mono text-[#5A5A5A]">/v1/consultation/deliver</span>
              </div>
              <div className="overflow-x-auto max-h-[640px] overflow-y-auto custom-scroll">
                <pre className="text-[11.5px] leading-[1.65] font-mono p-4 min-w-max text-[#C8C8C8]">{payload}</pre>
              </div>
            </div>

            {/* Field glossary */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { f: "anchor", d: "breakfast|lunch|dinner|sleep|sunrise — the app resolves the patient's local anchor time. Not a clock time. Survives DST, timezone changes, and patients who don't wear watches." },
                { f: "voice_line", d: "Pre-rendered by Indic-TTS, cached as tts_uri. App plays it offline even on 2G. No synthesis round-trip per reminder fire." },
                { f: "do_not_miss", d: "For critical meds (e.g. antibiotics). App keeps nagging every 15 min until the patient taps 'Le liya'. After 3 misses, escalates to a phone call to a family caregiver." },
                { f: "red_flags[].action", d: "Triggers the app's one-tap action: emergency_call → dials 108 (Indian ambulance). doctor_call → calls the originating doctor's HFR-registered number directly." },
                { f: "fallback_sms", d: "If FCM/APNs delivery fails twice (no data, app uninstalled), we fall back to a 160-char SMS with the essential reminder. 95% of Indian phones still receive SMS reliably." },
                { f: "app_meta.offline_cached", d: "The whole payload + all TTS URIs are pre-downloaded on consult-end. The patient can play voice notes and reminders for 7 days without any connectivity." },
              ].map((g, i) => (
                <div key={i} className="border border-[#1C1C1C] rounded-sm p-3.5 bg-[#0D0D0D]">
                  <div className="font-mono text-xs font-semibold text-[#F5C518] mb-1.5">{g.f}</div>
                  <p className="text-[0.7rem] text-[#8A8A8A] leading-relaxed">{g.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
    </div>
  );
}
