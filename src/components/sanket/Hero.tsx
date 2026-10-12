"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Self-drawing title — each letter slides up with a stagger. */
function KineticTitle({ text }: { text: string }) {
  return (
    <span className="inline-block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="kinetic-letter"
          style={{ animationDelay: `${(0.4 + i * 0.07).toFixed(3)}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/** Waveform whose bar heights respond to mouse X position over the hero. */
function MouseWaveform({ bars = 28 }: { bars?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Track mouse X as 0..1 across the hero
  const mouseX = useMotionValue(0.5);
  // Smooth it
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Use viewport X for full-hero responsiveness
      const x = (e.clientX - rect.left) / rect.width;
      mouseX.set(Math.max(0, Math.min(1, x)));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX]);

  return (
    <div ref={containerRef} className="flex items-center gap-[3px] h-12">
      {Array.from({ length: bars }).map((_, i) => {
        // Each bar has a base sine pattern + an influence from mouse X
        const center = i / bars;
        const baseHeight = 15 + Math.sin(i / 2.5) * 25;
        // Distance from mouse position modulates the amplitude
        return (
          <WaveBar
            key={i}
            baseHeight={baseHeight}
            center={center}
            mouseX={smoothX}
          />
        );
      })}
    </div>
  );
}

function WaveBar({
  baseHeight,
  center,
  mouseX,
}: {
  baseHeight: number;
  center: number;
  mouseX: ReturnType<typeof useSpring>;
}) {
  // Closer bars to mouse get taller
  const influence = useTransform(mouseX, (x) => {
    const dist = Math.abs(x - center);
    const boost = Math.max(0, 1 - dist * 3) * 40;
    return baseHeight + boost;
  });
  // Map influence (0-100ish) to a percentage string for height
  const heightPct = useTransform(influence, (v) => `${Math.min(100, v)}%`);

  return (
    <motion.span
      className="w-[2px] rounded-full bg-[#F5C518]"
      animate={{
        height: [
          `${baseHeight * 0.4}%`,
          `${baseHeight * 1.2}%`,
          `${baseHeight * 0.5}%`,
        ],
        opacity: [0.4, 1, 0.6],
      }}
      transition={{
        duration: 1.2 + (center * 1.5),
        repeat: Infinity,
        ease: "easeInOut",
        delay: center * 0.4,
      }}
      style={{ height: heightPct }}
    />
  );
}

export function Hero() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16"
      suppressHydrationWarning
    >
      {/* Subtle drifting accent dots */}
      <div className="absolute top-1/4 left-10 h-1 w-1 rounded-full bg-[#F5C518] float-dot opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 right-20 h-1 w-1 rounded-full bg-[#F5C518] float-dot opacity-40 pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-1/4 left-1/4 h-1 w-1 rounded-full bg-[#F5C518] float-dot opacity-50 pointer-events-none" style={{ animationDelay: "3s" }} />

      {/* Top label bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-24 left-0 right-0 px-6"
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between text-[0.65rem] font-mono uppercase tracking-[0.2em] text-[#5A5A5A]">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] live-pulse" />
            Technical Blueprint
          </span>
          <span>v1.0 · IST {time ?? "--:--:--"}</span>
        </div>
        <div className="mx-auto max-w-7xl mt-3 draw-line" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 text-center">
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] live-pulse" />
          <span className="text-[0.7rem] font-mono uppercase tracking-[0.3em] text-[#8A8A8A]">
            AI Clinical Companion · Bharat
          </span>
        </motion.div>

        {/* Display title — self-drawing kinetic letters */}
        <h1 className="display-xl">
          <KineticTitle text="Sanket." />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl font-light text-[#B8B8B8] tracking-tight max-w-2xl mx-auto"
        >
          From a doctor&apos;s <span className="text-[#F5C518]">voice</span> on a
          clinic phone, to a <span className="text-[#F5C518]">FHIR note</span> in
          ABDM, to a <span className="text-[#F5C518]">voice reminder</span> in the
          patient&apos;s mother tongue.
        </motion.p>

        {/* Waveform — mouse responsive */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-5 border border-[#1C1C1C] rounded-sm px-6 py-4 bg-[#0D0D0D] relative overflow-hidden">
            {/* Inner scanline for premium liveness */}
            <div className="scanline" />
            <div className="flex items-center gap-2 text-[0.65rem] font-mono uppercase tracking-[0.2em] text-[#8A8A8A] relative z-10">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] live-pulse" />
              REC
            </div>
            <div className="relative z-10">
              <MouseWaveform bars={28} />
            </div>
            <div className="text-[0.65rem] font-mono text-[#5A5A5A] relative z-10">
              00:42 · hi+en
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#demo" className="btn-yellow magnetic">
            Try the Live Demo
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
              <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
            </svg>
          </a>
          <a href="#architecture" className="btn-outline magnetic">
            See the architecture
          </a>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1C1C1C] border border-[#1C1C1C] rounded-sm overflow-hidden"
        >
          {[
            { v: "22+", l: "Scheduled languages" },
            { v: "FHIR R4", l: "ABDM-native" },
            { v: "<3s", l: "Doctor-side latency" },
            { v: "0", l: "Forms filled" },
          ].map((s, i) => (
            <div key={i} className="bg-[#0A0A0A] p-5 text-left">
              <div className="text-2xl sm:text-3xl font-serif-display font-semibold tracking-tight num-fade-in" style={{ animationDelay: `${2.2 + i * 0.1}s` }}>
                {s.v}
              </div>
              <div className="mt-1 text-[0.7rem] text-[#5A5A5A] uppercase tracking-[0.15em]">
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#5A5A5A]"
      >
        <span className="text-[0.55rem] uppercase tracking-[0.3em] font-mono">
          Scroll
        </span>
        <div className="h-8 w-px bg-[#2A2A2A] relative overflow-hidden">
          <motion.span
            animate={{ y: [-32, 32] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-3 bg-[#F5C518]"
          />
        </div>
      </motion.div>
    </section>
  );
}
