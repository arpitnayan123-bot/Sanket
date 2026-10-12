"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Fixed full-screen film grain overlay — adds premium texture. */
export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden />;
}

/** Self-drawing yellow hairline strip. */
export function DrawLine({ className = "" }: { className?: string }) {
  return <div className={`draw-line ${className}`} aria-hidden />;
}

/**
 * Marquee ticker strip — for use between sections.
 * Duplicates children to create a seamless loop.
 */
export function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  // Duplicate items so the loop is seamless
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-strip ${className}`} aria-hidden>
      <div className="marquee-strip-inner">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="text-[0.7rem] font-mono uppercase tracking-[0.25em] text-[#5A5A5A]">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#F5C518]" />
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Magnetic hover wrapper — pulls child slightly toward cursor on hover.
 * Use on buttons and key CTAs.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0, 0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`magnetic inline-block ${className}`}>
      {children}
    </div>
  );
}

/**
 * Scroll-reveal wrapper — fades + slides child up when it enters viewport.
 * Uses IntersectionObserver, runs once.
 */
export function RevealUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add("is-visible"), delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-up ${className}`}>
      {children}
    </div>
  );
}
