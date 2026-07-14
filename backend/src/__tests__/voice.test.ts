/**
 * VoiceService regex parser unit tests.
 * OpenAI is mocked so no API key is needed in CI.
 */

// Mock OpenAI so tests are fully offline
jest.mock("openai", () => {
  return {
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
  };
});

jest.mock("../config/env", () => ({
  env: {
    OPENAI_API_KEY: "",   // empty → forces regex fallback
    OPENAI_MODEL: "gpt-4o-mini",
    isDev: () => true,
    isProd: () => false,
    isTest: () => true,
  },
}));

jest.mock("../utils/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

import { VoiceService } from "../services/voice.service";

const svc = new VoiceService();

describe("VoiceService — regex fallback parser", () => {
  describe("action detection", () => {
    it("detects 'add' from 'add milk'", async () => {
      const r = await svc.parseCommand("add milk");
      expect(r?.action).toBe("add");
    });

    it("detects 'add' from 'I need bananas'", async () => {
      const r = await svc.parseCommand("I need bananas");
      expect(r?.action).toBe("add");
    });

    it("detects 'add' from 'buy 2 apples'", async () => {
      const r = await svc.parseCommand("buy 2 apples");
      expect(r?.action).toBe("add");
    });

    it("detects 'add' from 'please add bread'", async () => {
      const r = await svc.parseCommand("please add bread");
      expect(r?.action).toBe("add");
    });

    it("detects 'remove' from 'remove eggs'", async () => {
      const r = await svc.parseCommand("remove eggs");
      expect(r?.action).toBe("remove");
    });

    it("detects 'remove' from 'delete bread'", async () => {
      const r = await svc.parseCommand("delete bread");
      expect(r?.action).toBe("remove");
    });

    it("detects 'search' from 'find toothpaste'", async () => {
      const r = await svc.parseCommand("find toothpaste");
      expect(r?.action).toBe("search");
    });
  });

  describe("quantity + unit extraction", () => {
    it("extracts numeric quantity", async () => {
      const r = await svc.parseCommand("buy 2 kg of apples");
      expect(r?.quantity).toBe(2);
      expect(r?.unit).toBe("kg");
      expect(r?.itemName).toContain("apple");
    });

    it("converts word numbers", async () => {
      const r = await svc.parseCommand("add three bottles of water");
      expect(r?.quantity).toBe(3);
      expect(r?.unit).toBe("bottle");
    });

    it("converts 'a dozen'", async () => {
      const r = await svc.parseCommand("buy a dozen eggs");
      expect(r?.quantity).toBe(12);
    });
  });

  describe("price extraction", () => {
    it("extracts maxPrice from 'under $5'", async () => {
      const r = await svc.parseCommand("find toothpaste under $5");
      expect(r?.maxPrice).toBe(5);
    });

    it("extracts maxPrice from 'less than 3 dollars'", async () => {
      const r = await svc.parseCommand("find shampoo less than 3 dollars");
      expect(r?.maxPrice).toBe(3);
    });
  });

  describe("edge cases", () => {
    it("returns null for empty transcript", async () => {
      const r = await svc.parseCommand("");
      expect(r).toBeNull();
    });

    it("returns unknown action for gibberish", async () => {
      const r = await svc.parseCommand("xyzzy blorp fnord");
      expect(r?.action).toBe("unknown");
    });

    it("returns confidence < 0.4 for unknown commands", async () => {
      const r = await svc.parseCommand("xyzzy blorp fnord");
      expect(r?.confidence).toBeLessThan(0.5);
    });
  });
});
