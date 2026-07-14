import api from "@/lib/api";
import type { ApiResponse, ParsedVoiceCommand } from "@/types";

/**
 * Frontend voice API service.
 *
 * Strategy:
 *  1. Try the Express backend (/api/voice/parse) — full NLP pipeline
 *  2. On failure, fall back to the Next.js API route (/api/voice/parse)
 *     which calls OpenAI directly from the server-side
 */
export const voiceService = {
  async parseCommand(
    transcript: string,
    language = "en-US"
  ): Promise<ParsedVoiceCommand> {
    // 1. Try Express backend
    try {
      const { data } = await api.post<ApiResponse<ParsedVoiceCommand>>(
        "/voice/parse",
        { transcript, language }
      );
      if (data.data) return data.data;
    } catch {
      // Backend unreachable — fall through to Next.js route
    }

    // 2. Fallback: Next.js API route (server-side OpenAI call)
    const res = await fetch("/api/voice/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, language }),
    });

    if (!res.ok) {
      throw new Error(`Voice parse failed: ${res.status}`);
    }

    const json = (await res.json()) as ApiResponse<ParsedVoiceCommand>;
    if (!json.data) throw new Error(json.error ?? "Failed to parse command");
    return json.data;
  },
};
