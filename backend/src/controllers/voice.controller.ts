import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../types";
import { sendSuccess, sendServerError } from "../utils/apiResponse";
import { VoiceService } from "../services/voice.service";

const voiceService = new VoiceService();

/**
 * POST /api/voice/parse
 * Accepts a raw voice transcript, runs it through the AI NLP pipeline,
 * and returns a structured shopping command.
 */
export const parseVoiceCommand = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { transcript, language = "en-US" } = req.body as {
      transcript: string;
      language?: string;
    };

    const parsed = await voiceService.parseCommand(transcript, language);

    if (!parsed) {
      sendServerError(res, "Failed to parse voice command");
      return;
    }

    sendSuccess(res, parsed, "Voice command parsed");
  }
);
