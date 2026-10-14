import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import {
  REDTEAM_CASES,
  buildScribePrompt,
  extractJson,
  type RedTeamCase,
} from "@/lib/sanket/prompts";

export const runtime = "nodejs";
export const maxDuration = 300;

type CaseResult = {
  case_id: string;
  label: string;
  lang_pair: string;
  ok: boolean;
  ms: number;
  error?: string;
  validation: {
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
  scribe?: unknown;
};

/**
 * Validates a scribe output against the red-team case's expected_entities.
 * Performs case-insensitive substring checks on the raw JSON for must_contain,
 * which catches whether the entity name (e.g. "Telmisartan") appears anywhere
 * — as a generic name, brand field, FHIR display, etc.
 */
function validate(
  scribe: unknown,
  testCase: RedTeamCase
): CaseResult["validation"] {
  const scribeObj = (scribe ?? {}) as {
    entities?: { medications?: unknown[]; conditions?: unknown[] };
  };
  const meds = scribeObj.entities?.medications ?? [];
  const conds = scribeObj.entities?.conditions ?? [];
  const medicationsCount = Array.isArray(meds) ? meds.length : 0;
  const conditionsCount = Array.isArray(conds) ? conds.length : 0;

  const rawJson = JSON.stringify(scribe).toLowerCase();
  const mustContain = testCase.expected_entities.must_contain ?? [];
  const mustContainPass = mustContain.map((s) => rawJson.includes(s.toLowerCase()));

  const medsPass = testCase.expected_entities.medications_min == null
    ? true
    : medicationsCount >= testCase.expected_entities.medications_min;
  const condsPass = testCase.expected_entities.conditions_min == null
    ? true
    : conditionsCount >= testCase.expected_entities.conditions_min;
  const mustContainAll = mustContainPass.every(Boolean);

  return {
    medications_count: medicationsCount,
    conditions_count: conditionsCount,
    expected_meds_min: testCase.expected_entities.medications_min,
    expected_conds_min: testCase.expected_entities.conditions_min,
    meds_pass: medsPass,
    conds_pass: condsPass,
    must_contain: mustContain,
    must_contain_pass: mustContainPass,
    overall_pass: medsPass && condsPass && mustContainAll,
  };
}

export async function POST() {
  const results: CaseResult[] = [];
  const t0 = Date.now();

  // Run sequentially to avoid GPU contention on the shared LLM endpoint
  for (const testCase of REDTEAM_CASES) {
    const tCaseStart = Date.now();
    try {
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: "You are SANKET-SCRIBE." },
          { role: "user", content: buildScribePrompt(testCase as never) },
        ],
        thinking: { type: "disabled" },
      });
      const raw = completion.choices[0]?.message?.content ?? "";
      const scribe = extractJson(raw);
      const validation = validate(scribe, testCase);
      results.push({
        case_id: testCase.id,
        label: testCase.label,
        lang_pair: testCase.lang_pair,
        ok: true,
        ms: Date.now() - tCaseStart,
        validation,
        scribe,
      });
    } catch (err) {
      results.push({
        case_id: testCase.id,
        label: testCase.label,
        lang_pair: testCase.lang_pair,
        ok: false,
        ms: Date.now() - tCaseStart,
        error: err instanceof Error ? err.message : "Scribe stage failed",
        validation: {
          medications_count: 0,
          conditions_count: 0,
          meds_pass: false,
          conds_pass: false,
          must_contain: testCase.expected_entities.must_contain ?? [],
          must_contain_pass: (testCase.expected_entities.must_contain ?? []).map(
            () => false
          ),
          overall_pass: false,
        },
      });
    }
  }

  const passCount = results.filter((r) => r.validation.overall_pass).length;
  return NextResponse.json({
    total: results.length,
    passed: passCount,
    failed: results.length - passCount,
    pass_rate: results.length === 0 ? 0 : passCount / results.length,
    total_ms: Date.now() - t0,
    results,
  });
}

export async function GET() {
  return NextResponse.json({
    cases: REDTEAM_CASES.map((c) => ({
      id: c.id,
      label: c.label,
      lang_pair: c.lang_pair,
      desc: c.desc,
      expected: c.expected_entities,
      transcript_preview: c.transcript.slice(0, 200) + "...",
    })),
  });
}
