"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  PlusCircle,
  Trash2,
  RefreshCw,
  Search,
  HelpCircle,
} from "lucide-react";
import { useVoiceStore } from "@/store/useVoiceStore";
import { cn } from "@/lib/utils";
import type { VoiceCommandAction } from "@/types";

const ACTION_CONFIG: Record<
  VoiceCommandAction,
  { icon: React.ElementType; label: string; color: string }
> = {
  add:             { icon: PlusCircle,   label: "Adding",          color: "text-green-500" },
  remove:          { icon: Trash2,       label: "Removing",        color: "text-red-500" },
  update_quantity: { icon: RefreshCw,    label: "Updating",        color: "text-blue-500" },
  check:           { icon: CheckCircle2, label: "Checking off",    color: "text-green-500" },
  uncheck:         { icon: RefreshCw,    label: "Unchecking",      color: "text-amber-500" },
  search:          { icon: Search,       label: "Searching for",   color: "text-violet-500" },
  clear:           { icon: Trash2,       label: "Clearing",        color: "text-red-500" },
  unknown:         { icon: HelpCircle,   label: "Unknown command", color: "text-muted-foreground" },
};

interface CommandFeedbackProps {
  className?: string;
}

/**
 * CommandFeedback — shows a brief animated card after a voice command
 * is parsed, confirming what action was understood.
 */
export function CommandFeedback({ className }: CommandFeedbackProps) {
  const lastCommand = useVoiceStore((s) => s.lastCommand);

  if (!lastCommand || lastCommand.action === "unknown") return null;

  const config = ACTION_CONFIG[lastCommand.action];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${lastCommand.rawTranscript}-${Date.now()}`}
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "rounded-xl border bg-card p-3 shadow-md",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted",
              config.color
            )}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{config.label}</p>
            <p className="text-sm font-semibold truncate">
              {lastCommand.itemName ?? "—"}
              {lastCommand.quantity && lastCommand.quantity !== 1
                ? ` ×${lastCommand.quantity} ${lastCommand.unit ?? ""}`
                : ""}
            </p>
          </div>

          {/* Confidence pill */}
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              lastCommand.confidence >= 0.8
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            )}
          >
            {Math.round(lastCommand.confidence * 100)}%
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
