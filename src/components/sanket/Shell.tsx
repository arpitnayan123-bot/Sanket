"use client";

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-[#F5C518]"
    />
  );
}

// All sections, grouped for the hamburger menu
const MENU_GROUPS = [
  {
    label: "Story",
    items: [
      { id: "problem", label: "Problem", num: "01" },
      { id: "workflow", label: "Workflow", num: "02" },
    ],
  },
  {
    label: "Interactive",
    items: [
      { id: "demo", label: "Live Demo", num: "06" },
      { id: "redteam", label: "Red Team", num: "07" },
    ],
  },
  {
    label: "Technical",
    items: [
      { id: "architecture", label: "Architecture", num: "03" },
      { id: "schema", label: "Schema", num: "04" },
      { id: "prompts", label: "Prompts", num: "05" },
      { id: "patient-app", label: "Patient App", num: "08" },
    ],
  },
  {
    label: "Business",
    items: [
      { id: "moat", label: "Moat", num: "09" },
      { id: "roadmap", label: "Roadmap", num: "10" },
    ],
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const ids = [
        "hero",
        "problem",
        "workflow",
        "architecture",
        "schema",
        "prompts",
        "demo",
        "redteam",
        "patient-app",
        "moat",
        "roadmap",
      ];
      let current = "hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 140) current = id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Compact nav for desktop (just the story + interactive sections)
  const compactNav = [
    { id: "problem", label: "Problem" },
    { id: "workflow", label: "Flow" },
    { id: "demo", label: "Demo" },
    { id: "redteam", label: "Red Team" },
    { id: "moat", label: "Moat" },
    { id: "roadmap", label: "Plan" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className={`flex items-center justify-between rounded-sm px-4 py-2.5 transition-all duration-300 ${
              scrolled
                ? "bg-[#0A0A0A]/90 border border-[#1C1C1C] backdrop-blur-md"
                : "bg-transparent border border-transparent"
            }`}
          >
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-2.5 group">
              <div className="relative h-7 w-7 rounded-sm bg-[#F5C518] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#0A0A0A]">
                  <path
                    d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="leading-none">
                <div className="font-serif-display text-base font-semibold tracking-tight">
                  Sanket
                </div>
              </div>
            </a>

            {/* Compact nav — desktop only, story sections only */}
            <nav className="hidden lg:flex items-center gap-1">
              {compactNav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-2.5 py-1.5 rounded-sm text-[0.78rem] font-medium transition-all ${
                    active === item.id
                      ? "text-[#F5C518]"
                      : "text-[#8A8A8A] hover:text-[#FAFAFA]"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right side: Try Demo + Hamburger */}
            <div className="flex items-center gap-2">
              <a
                href="#demo"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#F5C518] text-[#0A0A0A] text-[0.78rem] font-semibold hover:bg-[#FFD52A] transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#0A0A0A] live-pulse" />
                Try Demo
              </a>

              {/* Hamburger button */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="relative h-9 w-9 rounded-sm border border-[#2A2A2A] bg-[#0A0A0A] flex items-center justify-center hover:border-[#F5C518] transition-colors"
              >
                <div className="flex flex-col gap-[3px]">
                  <motion.span
                    animate={menuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="block h-[1.5px] w-4 bg-[#FAFAFA]"
                  />
                  <motion.span
                    animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="block h-[1.5px] w-4 bg-[#FAFAFA]"
                  />
                  <motion.span
                    animate={menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="block h-[1.5px] w-4 bg-[#FAFAFA]"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Drop-down panel */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel — drops down from the navbar */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[60px] left-0 right-0 z-40 mx-auto max-w-7xl px-4 sm:px-6"
            >
              <div className="border border-[#1C1C1C] rounded-sm bg-[#0A0A0A] shadow-2xl overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1C1C1C]">
                  {MENU_GROUPS.map((group) => (
                    <div key={group.label} className="bg-[#0A0A0A] p-4">
                      <div className="num-marker mb-3">{group.label}</div>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              onClick={() => setMenuOpen(false)}
                              className={`flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm transition-colors ${
                                active === item.id
                                  ? "text-[#F5C518] bg-[#F5C518]/5"
                                  : "text-[#B8B8B8] hover:text-[#FAFAFA] hover:bg-white/[0.03]"
                              }`}
                            >
                              <span className="text-[0.6rem] font-mono text-[#3A3A3A]">
                                {item.num}
                              </span>
                              <span>{item.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {/* Footer strip */}
                <div className="px-4 py-2.5 border-t border-[#1C1C1C] flex items-center justify-between text-[0.65rem] font-mono text-[#3A3A3A]">
                  <span>ESC to close</span>
                  <span>10 sections · 4 groups</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function SectionLabel({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 sm:mb-16"
    >
      <div className="flex items-center gap-4 mb-6">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="num-marker"
        >
          {number}
        </motion.span>
        <div className="draw-line flex-1" />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="display-lg text-balance"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 lede"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/**
 * TechnicalAccordion — wraps a heavy technical section in a collapsible
 * "Technical details" block so the homepage reads as a clean story.
 * Expanded state is keyed by `id` so multiple accordions are independent.
 */
export function TechnicalAccordion({
  id,
  label,
  summary,
  children,
  defaultOpen = false,
}: {
  id: string;
  label: string;
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={id} className="border-t border-[#1C1C1C]">
      {/* Header bar — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full py-8 px-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-[#0D0D0D] transition-colors text-left"
      >
        <div className="flex items-center gap-5 min-w-0">
          <span className="num-marker shrink-0">{label}</span>
          <div className="min-w-0">
            <h3 className="display-md text-balance">{summary}</h3>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 h-8 w-8 rounded-sm border border-[#1C1C1C] flex items-center justify-center text-[#F5C518] text-lg"
        >
          +
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-24">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * Magnetic hover wrapper for premium button feel.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
    <span ref={ref} className={`magnetic inline-block ${className}`}>
      {children}
    </span>
  );
}
