"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useVoice } from "@/hooks/useVoice";
import { cn } from "@/lib/utils";

interface TranscriptProps {
  className?: string;
}

/**
 * Transcript — live display of what the microphone is hearing.
 *
 * - Shows interim (grey) text while the user is still speaking
 * - Shows final (white) text briefly after recognition ends
 * - Hidden when idle with no recent transcript
 */
export function Transcript({ className }: TranscriptProps) {
  const { voiceState, transcript, interimTranscript, isListening } = useVoice();

  const displayText = isListening ? interimTranscript : transcript;
  const isVisible = !!displayText || voiceState === "processing";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "rounded-xl border bg-card/80 backdrop-blur px-4 py-3 shadow-md",
            className
          )}
          role="status"
          aria-live="polite"
          aria-label="Voice transcript"
        >
          <div className="flex items-start gap-2.5">
            {/* Pulsing mic indicator */}
            <div className="mt-0.5 shrink-0">
              <div className="relative flex h-5 w-5 items-center justify-center">
                {isListening && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
                )}
                <Mic
                  className={cn(
                    "relative h-3.5 w-3.5",
                    isListening
                      ? "text-green-500"
                      : "text-amber-500"
                  )}
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              {voiceState === "processing" && !displayText ? (
                <p className="text-sm text-amber-500 animate-pulse">
                  Understanding your command…
                </p>
              ) : (
                <p
                  className={cn(
                    "text-sm leading-relaxed break-words",
                    isListening
                      ? "text-muted-foreground italic"
                      : "text-foreground font-medium"
                  )}
                >
                  {displayText || "…"}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
