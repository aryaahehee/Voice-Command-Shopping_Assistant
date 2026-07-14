"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VoiceButton } from "./VoiceButton";
import { Transcript } from "./Transcript";
import { CommandFeedback } from "./CommandFeedback";
import { LanguageSelector } from "./LanguageSelector";
import { useVoice } from "@/hooks/useVoice";

/**
 * VoicePanel — the full voice control section.
 * Composes VoiceButton + Transcript + CommandFeedback + LanguageSelector
 * into a single cohesive panel used on the dashboard and list pages.
 */
export function VoicePanel() {
  const { isSupported } = useVoice();

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card/50 p-6 shadow-sm">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="font-semibold text-base">Voice Control</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isSupported
              ? "Tap the mic and speak your command"
              : "Speech recognition not supported in this browser"}
          </p>
        </div>
        <LanguageSelector className="w-40" />
      </div>

      {/* Mic button */}
      <VoiceButton size="lg" showLabel />

      {/* Example commands */}
      <ExampleCommands />

      {/* Live transcript */}
      <Transcript className="w-full" />

      {/* Command feedback */}
      <CommandFeedback className="w-full" />
    </div>
  );
}

const EXAMPLES = [
  "Add milk",
  "Buy 2 kg of apples",
  "Remove bread",
  "I need eggs",
  "Find toothpaste under $5",
  "Increase milk quantity",
];

function ExampleCommands() {
  return (
    <div className="w-full">
      <p className="text-xs text-muted-foreground mb-2 text-center">
        Try saying:
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {EXAMPLES.map((ex) => (
          <span
            key={ex}
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground bg-muted/50"
          >
            &ldquo;{ex}&rdquo;
          </span>
        ))}
      </div>
    </div>
  );
}
