import { ParsedVoiceCommand } from "../types";
import { logger } from "../utils/logger";

/**
 * VoiceService — parses raw speech transcripts into structured commands.
 * OpenAI integration is wired in Milestone 8.
 * This stub performs basic regex-based parsing so the route is callable.
 */
export class VoiceService {
  /**
   * Parse a voice transcript into a structured shopping command.
   * Full NLP/AI implementation added in Milestone 8.
   */
  async parseCommand(
    transcript: string,
    language = "en-US"
  ): Promise<ParsedVoiceCommand | null> {
    try {
      return this.basicParse(transcript, language);
    } catch (error) {
      logger.error("Voice parse error:", error);
      return null;
    }
  }

  /**
   * Basic regex parser — handles the most common English patterns.
   * Replaced/augmented by GPT in M8.
   */
  private basicParse(
    transcript: string,
    language: string
  ): ParsedVoiceCommand {
    const lower = transcript.toLowerCase().trim();

    // Detect action
    let action: ParsedVoiceCommand["action"] = "unknown";

    if (/^(add|buy|purchase|get|need|want|i need|i want|please (add|buy|get|purchase))/.test(lower)) {
      action = "add";
    } else if (/^(remove|delete|take off|get rid of)/.test(lower)) {
      action = "remove";
    } else if (/^(increase|decrease|update|change|set)\s+(the\s+)?\w+\s+quantity/.test(lower)) {
      action = "update_quantity";
    } else if (/^(check|mark)\s+(off\s+)?/.test(lower)) {
      action = "check";
    } else if (/^(find|search|look for|show me)/.test(lower)) {
      action = "search";
    }

    // Extract quantity + item
    // e.g. "add 2 kg of apples", "buy three bananas", "need a dozen eggs"
    const qtyMatch = lower.match(
      /(\d+\.?\d*|one|two|three|four|five|six|seven|eight|nine|ten|a\s+dozen|dozen)\s*(kg|g|lb|oz|l|ml|pcs|pack|bottle|can|box|bag)?\s*(of\s+)?([a-z\s]+)/
    );

    const wordToNum: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      "a dozen": 12, dozen: 12,
    };

    let quantity: number | undefined;
    let unit: ParsedVoiceCommand["unit"] | undefined;
    let itemName: string | undefined;

    if (qtyMatch) {
      const rawQty = qtyMatch[1].trim();
      quantity = wordToNum[rawQty] ?? parseFloat(rawQty);
      unit = (qtyMatch[2] as ParsedVoiceCommand["unit"]) || "pcs";
      itemName = qtyMatch[4]?.trim();
    } else {
      // Try to extract item without quantity
      // "add milk" / "remove bread" / "buy almond milk"
      const itemMatch = lower.match(
        /(?:add|buy|purchase|get|need|want|remove|delete|find|search for|look for|i need|i want|please (?:add|buy|get))\s+(?:some\s+)?(.+)/
      );
      if (itemMatch) {
        itemName = itemMatch[1].trim();
        quantity = 1;
        unit = "pcs";
      }
    }

    // Extract max price: "under $5", "less than 3 dollars"
    let maxPrice: number | undefined;
    const priceMatch = lower.match(/(?:under|less than|below)\s+\$?(\d+\.?\d*)/);
    if (priceMatch) {
      maxPrice = parseFloat(priceMatch[1]);
    }

    return {
      action,
      itemName: itemName || undefined,
      quantity,
      unit,
      maxPrice,
      rawTranscript: transcript,
      confidence: itemName ? 0.8 : 0.4,
      language,
    };
  }
}
