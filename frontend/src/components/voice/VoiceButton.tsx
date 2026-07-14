"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "@/hooks/useVoice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceButtonProps {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Show label text next to the button */
  showLabel?: boolean;
}

const SIZE_MAP = {
  sm: { button: "h-10 w-10", icon: "h-4 w-4", ripple: "h-10 w-10" },
  md: { button: "h-14 w-14", icon: "h-6 w-6", ripple: "h-14 w-14" },
  lg: { button: "h-20 w-20", icon: "h-9 w-9", ripple: "h-20 w-20" },
};

/**
 * VoiceButton — animated microphone button.
 *
 * States:
 *  idle       → static mic icon, violet background
 *  listening  → pulsing animation, green background + ripple rings
 *  processing → spinning loader, amber background
 *  error      → red background
 */
export function VoiceButton({
  size = "md",
  className,
  showLabel = false,
}: VoiceButtonProps) {
  const { voiceState, isSupported, toggleListening } = useVoice();
  const s = SIZE_MAP[size];

  const isListening = voiceState === "listening";
  const isProcessing = voiceState === "processing";
  const isError = voiceState === "error";

  const bgClass = isListening
    ? "bg-green-500 hover:bg-green-600 shadow-voice-active"
    : isProcessing
    ? "bg-amber-500 hover:bg-amber-600"
    : isError
    ? "bg-destructive hover:bg-destructive/90"
    : "bg-primary hover:bg-primary/90 shadow-glow";

  const label = isListening
    ? "Stop listening"
    : isProcessing
    ? "Processing…"
    : "Start listening";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative flex items-center gap-3", className)}>
            {/* Ripple rings — only when listening */}
            <AnimatePresence>
              {isListening && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className={cn(
                        "absolute rounded-full bg-green-400/30",
                        s.ripple
                      )}
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 2.8, opacity: 0 }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Main button */}
            <motion.button
              onClick={toggleListening}
              disabled={!isSupported || isProcessing}
              aria-label={label}
              aria-pressed={isListening}
              className={cn(
                "relative z-10 flex items-center justify-center rounded-full text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                s.button,
                bgClass
              )}
              whileTap={{ scale: 0.92 }}
              animate={
                isListening
                  ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.4 } }
                  : { scale: 1 }
              }
            >
              {isProcessing ? (
                <Loader2 className={cn(s.icon, "animate-spin")} />
              ) : isListening ? (
                <MicOff className={s.icon} />
              ) : (
                <Mic className={s.icon} />
              )}
            </motion.button>

            {/* Optional label */}
            {showLabel && (
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          {!isSupported
            ? "Speech not supported in this browser"
            : label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
