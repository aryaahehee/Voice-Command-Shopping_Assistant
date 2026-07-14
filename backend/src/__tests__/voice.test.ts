/**
 * VoiceService unit tests — covers regex fallback parser + edge cases.
 * OpenAI is mocked so tests are fully offline.
 */

jest.mock("openai", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: null } }],
        }),
      },
    },
  })),
}));

jest.mock("../config/env", () => ({
  env: {
    OPENAI_API_KEY: "",
    OPENAI_MODEL: "gpt-4o-mini",
    isDev: () => true,
    isProd: () => false,
    isTest: () => true,
  },
}));

jest.mock("../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import { VoiceService } from "../services/voice.service";

const svc = new VoiceService();

describe("VoiceService — regex fallback parser", () => {
  describe("action detection", () => {
    it.each([
      ["add milk",            "add"],
      ["buy 2 apples",        "add"],
      ["I need bananas",      "add"],
      ["I want bread",        "add"],
      ["please add eggs",     "add"],
      ["can you add butter",  "add"],
      ["remove eggs",         "remove"],
      ["delete bread",        "remove"],
      ["take off butter",     "remove"],
      ["get rid of cheese",   "remove"],
      ["find toothpaste",     "search"],
      ["search for shampoo",  "search"],
      ["look for oat milk",   "search"],
    ])("'%s' → action '%s'", async (input, expected) => {
      const r = await svc.parseCommand(input);
      expect(r?.action).toBe(expected);
    });
  });

  describe("quantity extraction", () => {
    it("extracts numeric quantity and unit", async () => {
      const r = await svc.parseCommand("buy 2 kg of apples");
      expect(r?.quantity).toBe(2);
      expect(r?.unit).toBe("kg");
    });

    it("converts word 'three'", async () => {
      const r = await svc.parseCommand("add three bottles of water");
      expect(r?.quantity).toBe(3);
      expect(r?.unit).toBe("bottle");
    });

    it("converts 'a dozen'", async () => {
      const r = await svc.parseCommand("buy a dozen eggs");
      expect(r?.quantity).toBe(12);
    });

    it("converts 'half'", async () => {
      const r = await svc.parseCommand("buy half kg of rice");
      expect(r?.quantity).toBe(0.5);
    });

    it("defaults to quantity 1 when not specified", async () => {
      const r = await svc.parseCommand("add milk");
      expect(r?.quantity).toBe(1);
    });
  });

  describe("price extraction", () => {
    it("extracts '$5' price constraint", async () => {
      const r = await svc.parseCommand("find toothpaste under $5");
      expect(r?.maxPrice).toBe(5);
    });

    it("extracts decimal price", async () => {
      const r = await svc.parseCommand("find juice under $2.99");
      expect(r?.maxPrice).toBe(2.99);
    });

    it("extracts 'less than' price", async () => {
      const r = await svc.parseCommand("search for shampoo less than 3");
      expect(r?.maxPrice).toBe(3);
    });
  });

  describe("confidence", () => {
    it("returns high confidence for clear add command", async () => {
      const r = await svc.parseCommand("add 2 kg of apples");
      expect(r?.confidence).toBeGreaterThan(0.6);
    });

    it("returns low confidence for unknown commands", async () => {
      const r = await svc.parseCommand("xyzzy blorp fnord");
      expect(r?.confidence).toBeLessThan(0.5);
    });
  });

  describe("edge cases", () => {
    it("returns null for empty string", async () => {
      const r = await svc.parseCommand("");
      expect(r).toBeNull();
    });

    it("returns null for whitespace-only string", async () => {
      const r = await svc.parseCommand("   ");
      expect(r).toBeNull();
    });

    it("returns unknown action for gibberish", async () => {
      const r = await svc.parseCommand("asdfghjkl qwerty");
      expect(r?.action).toBe("unknown");
    });

    it("includes rawTranscript in result", async () => {
      const r = await svc.parseCommand("add milk");
      expect(r?.rawTranscript).toBe("add milk");
    });

    it("includes language in result", async () => {
      const r = await svc.parseCommand("add milk", "es-ES");
      expect(r?.language).toBe("es-ES");
    });
  });
});
