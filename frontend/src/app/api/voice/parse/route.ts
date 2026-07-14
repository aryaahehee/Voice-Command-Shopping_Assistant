import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * POST /api/voice/parse
 * Next.js API route that proxies voice transcript → OpenAI NLP.
 * Used as a fallback when the Express backend is unavailable,
 * or for direct client-side AI calls without CORS issues.
 *
 * Body: { transcript: string, language?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      transcript?: string;
      language?: string;
    };

    const { transcript, language = "en-US" } = body;

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return NextResponse.json(
        { success: false, error: "transcript is required" },
        { status: 400 }
      );
    }

    if (transcript.length > 500) {
      return NextResponse.json(
        { success: false, error: "transcript too long (max 500 chars)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 503 }
      );
    }

    const client = new OpenAI({ apiKey });

    const systemPrompt = `You are a shopping assistant that extracts structured commands from voice transcripts.
Return ONLY a valid JSON object:
{
  "action": "add" | "remove" | "update_quantity" | "check" | "uncheck" | "search" | "clear" | "unknown",
  "itemName": string | null,
  "quantity": number | null,
  "unit": "pcs" | "kg" | "g" | "lb" | "oz" | "l" | "ml" | "dozen" | "pack" | "bottle" | "can" | "box" | "bag" | null,
  "maxPrice": number | null,
  "brand": string | null,
  "confidence": number
}
Rules: normalise item names to lowercase singular. Extract number words. Return ONLY the JSON.`;

    const userPrompt =
      language !== "en-US"
        ? `Transcript (${language}): "${transcript}"`
        : `Transcript: "${transcript}"`;

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from OpenAI");

    const parsed = JSON.parse(raw);

    return NextResponse.json({
      success: true,
      data: {
        ...parsed,
        rawTranscript: transcript,
        language,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/voice/parse]", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
