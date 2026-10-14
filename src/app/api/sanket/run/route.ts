import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import {
  PRESETS,
  buildScribePrompt,
  buildEmpathyPrompt,
  extractJson,
  type Preset,
} from "@/lib/sanket/prompts";

export const runtime = "nodejs";
export const maxDuration = 120;

type StageResult = {
  ok: boolean;
  ms: number;
  error?: string;
};

type RunResponse = {
  preset_id: string;
  stages: {
    scribe: StageResult;
    empathy: StageResult;
  };
  scribe?: unknown;
  empathy?: unknown;
  total_ms: number;
};

export async function POST(req: NextRequest): Promise<NextResponse<RunResponse>> {
  const body = (await req.json().catch(() => ({}))) as {
    preset_id?: string;
    transcript?: string;
  };

  // Resolve preset
  let preset: Preset | undefined = PRESETS.find((p) => p.id === body.preset_id);
  if (!preset) preset = PRESETS[0];

  // Allow custom transcript override (keeps preset's patient/doctor metadata)
  if (body.transcript && body.transcript.trim().length > 20) {
    preset = { ...preset, transcript: body.transcript.trim() };
  }

  const stages: RunResponse["stages"] = {
    scribe: { ok: false, ms: 0 },
    empathy: { ok: false, ms: 0 },
  };
  const t0 = Date.now();
  let scribeOutput: Record<string, unknown> | undefined;
  let empathyOutput: Record<string, unknown> | undefined;

  // ---- Stage 1: Scribe ----
  try {
    const zai = await ZAI.create();
    const tScribeStart = Date.now();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: "You are SANKET-SCRIBE." },
        { role: "user", content: buildScribePrompt(preset) },
      ],
      thinking: { type: "disabled" },
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    scribeOutput = extractJson(raw) as Record<string, unknown>;
    stages.scribe = { ok: true, ms: Date.now() - tScribeStart };
  } catch (err) {
    stages.scribe = {
      ok: false,
      ms: 0,
      error: err instanceof Error ? err.message : "Scribe stage failed",
    };
  }

  // ---- Stage 2: Empathy (only if scribe succeeded) ----
  if (scribeOutput) {
    try {
      const zai = await ZAI.create();
      const tEmpathyStart = Date.now();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: "You are SANKET-DAI." },
          { role: "user", content: buildEmpathyPrompt(preset, scribeOutput) },
        ],
        thinking: { type: "disabled" },
      });
      const raw = completion.choices[0]?.message?.content ?? "";
      empathyOutput = extractJson(raw) as Record<string, unknown>;
      stages.empathy = { ok: true, ms: Date.now() - tEmpathyStart };
    } catch (err) {
      stages.empathy = {
        ok: false,
        ms: 0,
        error: err instanceof Error ? err.message : "Empathy stage failed",
      };
    }
  }

  return NextResponse.json({
    preset_id: preset.id,
    stages,
    scribe: scribeOutput,
    empathy: empathyOutput,
    total_ms: Date.now() - t0,
  });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    presets: PRESETS.map((p) => ({
      id: p.id,
      label: p.label,
      desc: p.desc,
      transcript_preview: p.transcript.slice(0, 180) + "...",
    })),
  });
}
