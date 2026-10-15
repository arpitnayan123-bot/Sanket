"use client";

import { Navbar, ScrollProgress, TechnicalAccordion } from "@/components/sanket/Shell";
import { Hero } from "@/components/sanket/Hero";
import { ProblemSection } from "@/components/sanket/ProblemSection";
import { WorkflowSection } from "@/components/sanket/WorkflowSection";
import { ArchitectureSection } from "@/components/sanket/ArchitectureSection";
import { SchemaSection } from "@/components/sanket/SchemaSection";
import { PromptsSection } from "@/components/sanket/PromptsSection";
import { LiveDemoSection } from "@/components/sanket/LiveDemoSection";
import { RedTeamSection } from "@/components/sanket/RedTeamSection";
import { PatientAppSection } from "@/components/sanket/PatientAppSection";
import { MonetizationSection } from "@/components/sanket/MonetizationSection";
import { RoadmapSection, Footer } from "@/components/sanket/RoadmapSection";
import { GrainOverlay, Marquee } from "@/components/sanket/Motion";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0A0A0A] text-[#FAFAFA] overflow-x-hidden">
      <GrainOverlay />
      <ScrollProgress />
      <Navbar />

      <Hero />

      <Marquee
        items={[
          "ABDM-compliant",
          "FHIR R4",
          "ICD-10 / SNOMED CT",
          "DPDP 2023",
          "Llama 3.3 · 70B",
          "IndicWhisper-v2",
          "AI4Bharat TTS",
          "22+ languages",
          "Self-hosted in India",
        ]}
      />

      {/* Story sections — always fully visible */}
      <ProblemSection />
      <WorkflowSection />

      {/* Marquee divider */}
      <Marquee
        items={[
          "Doctor voice in",
          "FHIR note out",
          "Patient voice out",
          "Zero forms",
          "<3s latency",
          "Code-switching NLP",
          "Vernacular TTS",
          "Offline-first",
        ]}
      />

      {/* Interactive sections — always fully visible */}
      <LiveDemoSection />
      <RedTeamSection />

      {/* Technical sections — collapsed by default, expandable */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32">
        <div className="flex items-center gap-4 mb-2">
          <span className="num-marker">TECHNICAL DETAILS</span>
          <div className="draw-line flex-1" />
        </div>
        <p className="text-sm text-[#5A5A5A] max-w-2xl">
          The deep stuff — architecture, schema, prompts, and the patient app
          JSON. Click any block to expand. Or use the hamburger menu to jump.
        </p>
      </div>

      <TechnicalAccordion
        id="architecture"
        label="03 · ARCHITECTURE"
        summary="System architecture — audio in, voice out."
      >
        <ArchitectureSection />
      </TechnicalAccordion>

      <TechnicalAccordion
        id="schema"
        label="04 · SCHEMA"
        summary="Postgres schema — three worlds, one source of truth."
      >
        <SchemaSection />
      </TechnicalAccordion>

      <TechnicalAccordion
        id="prompts"
        label="05 · PROMPTS"
        summary="The two prompts that do all the magic."
      >
        <PromptsSection />
      </TechnicalAccordion>

      <TechnicalAccordion
        id="patient-app"
        label="08 · PATIENT APP"
        summary="The JSON the Patient App actually consumes."
      >
        <PatientAppSection />
      </TechnicalAccordion>

      {/* Marquee divider */}
      <Marquee
        items={[
          "B2B SaaS",
          "B2B2C Hospital",
          "API-as-a-Service",
          "Pharma adherence data",
          "ABDM-native",
          "Code-switching moat",
          "Vernacular flywheel",
          "Built for Bharat",
        ]}
      />

      {/* Business sections — always fully visible */}
      <MonetizationSection />
      <RoadmapSection />

      <Footer />
    </main>
  );
}
