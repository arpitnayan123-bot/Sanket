import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Splits long text into chunks ≤ maxLength chars, on sentence boundaries
 * where possible. Used to bypass the 1024-char TTS API limit.
 */
function chunkText(text: string, maxLength = 900): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return [clean];

  const chunks: string[] = [];
  // Try splitting on sentence-ending punctuation (works for most langs incl. Hindi danda |)
  const sentences = clean.match(/[^.!?।]+[.!?।]+/g) || [clean];

  let current = "";
  for (const s of sentences) {
    if ((current + s).length <= maxLength) {
      current += s;
    } else {
      if (current) chunks.push(current.trim());
      // If a single sentence > maxLength, hard-split it
      if (s.length > maxLength) {
        for (let i = 0; i < s.length; i += maxLength) {
          chunks.push(s.slice(i, i + maxLength).trim());
        }
        current = "";
      } else {
        current = s;
      }
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

/**
 * Concatenates WAV files. We use a simple approach: only the first chunk's
 * header is preserved, and subsequent chunks' audio data (skipping their
 * 44-byte header) is appended. This works for the homogeneous 24kHz mono
 * 16-bit PCM WAVs the TTS API returns.
 */
function concatWavs(wavBuffers: Buffer[]): Buffer {
  if (wavBuffers.length === 0) return Buffer.alloc(0);
  if (wavBuffers.length === 1) return wavBuffers[0];

  const header = wavBuffers[0].slice(0, 44);
  const dataParts: Buffer[] = [wavBuffers[0].slice(44)];
  for (let i = 1; i < wavBuffers.length; i++) {
    dataParts.push(wavBuffers[i].slice(44));
  }
  const audioData = Buffer.concat(dataParts);

  // Patch the data size fields (offsets 4 and 40 in WAV header)
  const totalSize = 36 + audioData.length;
  header.writeUInt32LE(totalSize, 4);
  header.writeUInt32LE(audioData.length, 40);

  return Buffer.concat([header, audioData]);
}

export async function POST(req: NextRequest) {
  try {
    const { text, voice = "tongtong", speed = 0.95 } = (await req.json()) as {
      text?: string;
      voice?: string;
      speed?: number;
    };

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const zai = await ZAI.create();
    const chunks = chunkText(text);

    const wavBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      const response = await zai.audio.tts.create({
        input: chunk,
        voice,
        speed: Math.min(2, Math.max(0.5, speed)),
        response_format: "wav",
        stream: false,
      });
      const arrayBuffer = await response.arrayBuffer();
      wavBuffers.push(Buffer.from(new Uint8Array(arrayBuffer)));
    }

    const finalWav = concatWavs(wavBuffers);

    return new NextResponse(finalWav as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": finalWav.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "TTS synthesis failed";
    console.error("Sanket TTS error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
