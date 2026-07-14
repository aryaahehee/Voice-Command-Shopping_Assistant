import api from "@/lib/api";
import type { ApiResponse, ParsedVoiceCommand } from "@/types";

/**
 * Frontend voice API service.
 * Sends a raw transcript to the backend for AI/NLP parsing.
 */
export const voiceService = {
  async parseCommand(
    transcript: string,
    language = "en-US"
  ): Promise<ParsedVoiceCommand> {
    const { data } = await api.post<ApiResponse<ParsedVoiceCommand>>(
      "/voice/parse",
      { transcript, language }
    );
    if (!data.data) throw new Error(data.error ?? "Failed to parse command");
    return data.data;
  },
};
