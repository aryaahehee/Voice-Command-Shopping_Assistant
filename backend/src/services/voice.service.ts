import OpenAI from "openai";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { ParsedVoiceCommand, ItemUnit, VoiceCommandAction } from "../types";

// Lazy-init OpenAI client so the app still starts without a key
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI | null {
  if (!env.OPENAI_API_KEY) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return openaiClient;
}

// ── System prompt ──────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a shopping assistant that extracts structured commands from voice transcripts.

Given a voice transcript, return ONLY a valid JSON object with these fields:
{
  "action": one of: "add" | "remove" | "update_quantity" | "check" | "uncheck" | "search" | "clear" | "unknown",
  "itemName": string or null,
  "quantity": number or null,
  "unit": one of: "pcs" | "kg" | "g" | "lb" | "oz" | "l" | "ml" | "dozen" | "pack" | "bottle" | "can" | "box" | "bag" | null,
  "maxPrice": number or null,
  "brand": string or null,
  "confidence": number between 0 and 1
}

Rules:
- "add" covers: add, buy, purchase, get, need, want, I need, I want, please add/buy/get
- "remove" covers: remove, delete, take off, get rid of
- "update_quantity" covers: increase, decrease, update, change, set X quantity
- "search" covers: find, search, look for, show me
- Normalise item names to lowercase singular (e.g. "apples" → "apple", "eggs" → "egg")
- Extract numbers from words: "two" → 2, "a dozen" → 12, "half a kilo" → 0.5
- Extract price constraints: "under $5", "less than three dollars" → maxPrice
- If action is unclear, use "unknown" with confidence < 0.4
- Return ONLY the JSON object, no explanation, no markdown fences`;

/**
 * VoiceService — parses raw speech transcripts into structured commands.
 *
 * Strategy:
 *  1. Try OpenAI GPT-4o-mini (structured JSON output)
 *  2. On API failure or missing key → fall back to fast regex parser
 */
export class VoiceService {
  async parseCommand(
    transcript: string,
    language = "en-US"
  ): Promise<ParsedVoiceCommand | null> {
    if (!transcript.trim()) return null;

    try {
      const aiResult = await this.parseWithAI(transcript, language);
      if (aiResult) return aiResult;
    } catch (error) {
      logger.warn("OpenAI parsing failed, using regex fallback:", error);
    }

    return this.parseWithRegex(transcript, language);
  }

  // ── OpenAI parser ──────────────────────────────────────────────────────

  private async parseWithAI(
    transcript: string,
    language: string
  ): Promise<ParsedVoiceCommand | null> {
    const client = getOpenAI();
    if (!client) return null;

    const userPrompt =
      language !== "en-US"
        ? `Transcript (language: ${language}): "${transcript}"\n\nTranslate to English first if needed, then extract the command.`
        : `Transcript: "${transcript}"`;

    const response = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0,          // deterministic
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return null;

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      logger.warn("OpenAI returned non-JSON:", raw);
      return null;
    }

    return this.normaliseAIResponse(parsed, transcript, language);
  }

  private normaliseAIResponse(
    obj: Record<string, unknown>,
    rawTranscript: string,
    language: string
  ): ParsedVoiceCommand {
    const VALID_ACTIONS: VoiceCommandAction[] = [
      "add", "remove", "update_quantity", "check",
      "uncheck", "search", "clear", "unknown",
    ];
    const VALID_UNITS: ItemUnit[] = [
      "pcs", "kg", "g", "lb", "oz", "l", "ml",
      "dozen", "pack", "bottle", "can", "box", "bag",
    ];

    const action = VALID_ACTIONS.includes(obj.action as VoiceCommandAction)
      ? (obj.action as VoiceCommandAction)
      : "unknown";

    const unit = VALID_UNITS.includes(obj.unit as ItemUnit)
      ? (obj.unit as ItemUnit)
      : undefined;

    return {
      action,
      itemName: typeof obj.itemName === "string" ? obj.itemName.trim() : undefined,
      quantity: typeof obj.quantity === "number" ? obj.quantity : undefined,
      unit,
      maxPrice: typeof obj.maxPrice === "number" ? obj.maxPrice : undefined,
      brand: typeof obj.brand === "string" ? obj.brand.trim() : undefined,
      rawTranscript,
      confidence: typeof obj.confidence === "number"
        ? Math.min(1, Math.max(0, obj.confidence))
        : 0.7,
      language,
    };
  }

  // ── Regex fallback parser ──────────────────────────────────────────────

  private parseWithRegex(
    transcript: string,
    language: string
  ): ParsedVoiceCommand {
    const lower = transcript.toLowerCase().trim();

    // ── Detect action ────────────────────────────────────────────────────
    let action: VoiceCommandAction = "unknown";

    if (/^(add|buy|purchase|get|need|want|i need|i want|please\s+(add|buy|get|purchase)|can you add)/.test(lower)) {
      action = "add";
    } else if (/^(remove|delete|take\s+off|get\s+rid\s+of|cross\s+off)/.test(lower)) {
      action = "remove";
    } else if (/(increase|decrease|update|change|set)\s+(the\s+)?\w+(\s+quantity)?/.test(lower)) {
      action = "update_quantity";
    } else if (/^(check|mark)\s+(off\s+)?/.test(lower)) {
      action = "check";
    } else if (/^(find|search|look\s+for|show\s+me|where\s+is)/.test(lower)) {
      action = "search";
    } else if (/^clear\s+(the\s+)?(list|all|everything)/.test(lower)) {
      action = "clear";
    }

    // ── Word-to-number map ───────────────────────────────────────────────
    const W2N: Record<string, number> = {
      "a": 1, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
      "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
      "eleven": 11, "twelve": 12, "a dozen": 12, "dozen": 12,
      "half": 0.5, "quarter": 0.25,
    };

    // ── Extract quantity + unit + item ────────────────────────────────────
    // Matches: "2 kg of apples", "three bottles of water", "a dozen eggs"
    const qtyUnitRx = lower.match(
      /(?:^|\s)((?:a\s+dozen|dozen|half|quarter|\d+\.?\d*|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve))\s*(kg|g|lb|oz|l|ml|pcs|pcs\.|pieces?|pack|bottle|bottles?|can|cans?|box|boxes?|bag|bags?|dozen|litre?s?|liter?s?)?\s*(?:of\s+)?([a-z][a-z\s]{1,40}?)(?:\s+(?:under|less\s+than|below)|$)/
    );

    let quantity: number | undefined;
    let unit: ItemUnit | undefined;
    let itemName: string | undefined;

    if (qtyUnitRx) {
      const rawQty = qtyUnitRx[1].trim();
      quantity = W2N[rawQty] ?? parseFloat(rawQty) || 1;
      unit = this.normaliseUnit(qtyUnitRx[2]) ?? "pcs";
      itemName = qtyUnitRx[3].trim();
    } else {
      // Fallback: extract item after action verb
      const itemRx = lower.match(
        /(?:add|buy|purchase|get|need|want|remove|delete|find|search\s+for|look\s+for|i\s+need|i\s+want|please\s+(?:add|buy|get))\s+(?:some\s+|a\s+|an\s+)?(.{2,60}?)(?:\s+under|\s+less\s+than|$)/
      );
      if (itemRx) {
        itemName = itemRx[1].trim().replace(/\.$/, "");
        quantity = 1;
        unit = "pcs";
      }
    }

    // ── Extract max price ─────────────────────────────────────────────────
    let maxPrice: number | undefined;
    const priceRx = lower.match(/(?:under|less\s+than|below|cheaper\s+than)\s+\$?(\d+\.?\d*)/);
    if (priceRx) maxPrice = parseFloat(priceRx[1]);

    // ── Normalise item name ───────────────────────────────────────────────
    if (itemName) {
      itemName = itemName.replace(/\s+/g, " ").replace(/[^a-z0-9\s]/g, "").trim();
    }

    const confidence =
      itemName && action !== "unknown" ? 0.72 : itemName ? 0.5 : 0.3;

    return {
      action,
      itemName: itemName || undefined,
      quantity,
      unit,
      maxPrice,
      rawTranscript: transcript,
      confidence,
      language,
    };
  }

  private normaliseUnit(raw: string | undefined): ItemUnit | undefined {
    if (!raw) return undefined;
    const map: Record<string, ItemUnit> = {
      kg: "kg", kilogram: "kg", kilograms: "kg",
      g: "g", gram: "g", grams: "g",
      lb: "lb", lbs: "lb", pound: "lb", pounds: "lb",
      oz: "oz", ounce: "oz", ounces: "oz",
      l: "l", litre: "l", litres: "l", liter: "l", liters: "l",
      ml: "ml", millilitre: "ml", milliliter: "ml",
      pcs: "pcs", piece: "pcs", pieces: "pcs", item: "pcs", items: "pcs",
      pack: "pack", packs: "pack", packet: "pack", packets: "pack",
      bottle: "bottle", bottles: "bottle",
      can: "can", cans: "can",
      box: "box", boxes: "box",
      bag: "bag", bags: "bag",
      dozen: "dozen",
    };
    return map[raw.replace(/\.$/, "").toLowerCase()];
  }
}
