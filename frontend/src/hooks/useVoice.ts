"use client";

import { useCallback, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast from "react-hot-toast";
import { useVoiceStore } from "@/store/useVoiceStore";
import { useShopping } from "@/hooks/useShopping";
import { voiceService } from "@/lib/services/voice.service";
import { getErrorMessage } from "@/lib/api";
import type { VoiceLanguageCode } from "@/lib/constants";
import type { ParsedVoiceCommand } from "@/types";

/**
 * useVoice — complete voice recognition hook.
 *
 * Lifecycle:
 *   idle → listening (user presses mic)
 *         → processing (transcript sent to backend NLP)
 *         → idle (action dispatched to shopping list)
 *
 * Supports:
 *  - Start / stop / toggle listening
 *  - Live interim transcript
 *  - Multi-language (passed to Web Speech API)
 *  - Browser support detection
 *  - Auto-dispatches shopping actions from parsed commands
 */
export function useVoice() {
  const store = useVoiceStore();
  const { addItem, deleteItem, updateItem, filteredItems } = useShopping();
  const processingRef = useRef(false);

  const {
    transcript,
    interimTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // ── Detect browser support ───────────────────────────────
  useEffect(() => {
    store.setIsSupported(browserSupportsSpeechRecognition);
  }, [browserSupportsSpeechRecognition, store]);

  // ── Sync live transcript into store ─────────────────────
  useEffect(() => {
    store.setInterimTranscript(interimTranscript);
  }, [interimTranscript, store]);

  // ── When recognition stops, process the final transcript ─
  useEffect(() => {
    if (!listening && transcript && !processingRef.current) {
      store.setTranscript(transcript);
      processTranscript(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript]);

  // ── Sync listening state → voiceState ───────────────────
  useEffect(() => {
    if (listening) {
      store.setVoiceState("listening");
    } else if (store.voiceState === "listening") {
      // Don't override "processing" state set by processTranscript
      store.setVoiceState("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  // ── Process final transcript via backend NLP ─────────────
  const processTranscript = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      processingRef.current = true;
      store.setVoiceState("processing");

      try {
        const command = await voiceService.parseCommand(text, store.language);
        store.setLastCommand(command);
        await dispatchCommand(command);
      } catch (err) {
        store.setError(getErrorMessage(err));
        store.setVoiceState("error");
        toast.error("Could not understand that command. Try again.");
      } finally {
        processingRef.current = false;
        store.setVoiceState("idle");
        resetTranscript();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, resetTranscript]
  );

  // ── Dispatch parsed command to shopping store ────────────
  const dispatchCommand = useCallback(
    async (cmd: ParsedVoiceCommand) => {
      switch (cmd.action) {
        case "add":
          if (cmd.itemName) {
            await addItem({
              name: cmd.itemName,
              quantity: cmd.quantity ?? 1,
              unit: cmd.unit ?? "pcs",
              addedVoice: true,
            });
            toast.success(`Added: ${cmd.itemName} ×${cmd.quantity ?? 1}`);
          } else {
            toast.error("Couldn't detect an item name. Try again.");
          }
          break;

        case "remove": {
          if (!cmd.itemName) { toast.error("Which item should I remove?"); break; }
          const target = filteredItems.find((i) =>
            i.name.toLowerCase().includes(cmd.itemName!.toLowerCase())
          );
          if (target) {
            await deleteItem(target._id, target.name);
          } else {
            toast.error(`"${cmd.itemName}" not found in your list`);
          }
          break;
        }

        case "update_quantity": {
          if (!cmd.itemName || cmd.quantity === undefined) {
            toast.error("Please say the item name and new quantity.");
            break;
          }
          const target = filteredItems.find((i) =>
            i.name.toLowerCase().includes(cmd.itemName!.toLowerCase())
          );
          if (target) {
            await updateItem(target._id, {
              quantity: cmd.quantity,
              unit: cmd.unit ?? target.unit,
            });
            toast.success(`Updated ${target.name} to ${cmd.quantity} ${cmd.unit ?? target.unit}`);
          } else {
            toast.error(`"${cmd.itemName}" not found in your list`);
          }
          break;
        }

        case "unknown":
        default:
          toast.error("Command not recognised. Try: 'Add milk' or 'Remove eggs'");
          break;
      }
    },
    [addItem, deleteItem, updateItem, filteredItems]
  );

  // ── Controls ─────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!store.isSupported) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    store.setError(null);
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: false,
      language: store.language,
      interimResults: true,
    });
  }, [store, resetTranscript]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  const toggleListening = useCallback(() => {
    if (store.voiceState === "listening") {
      stopListening();
    } else {
      startListening();
    }
  }, [store.voiceState, startListening, stopListening]);

  const setLanguage = useCallback(
    (lang: VoiceLanguageCode) => {
      store.setLanguage(lang);
      if (store.voiceState === "listening") {
        stopListening();
      }
    },
    [store, stopListening]
  );

  return {
    // State
    voiceState: store.voiceState,
    transcript: store.transcript,
    interimTranscript: store.interimTranscript,
    lastCommand: store.lastCommand,
    language: store.language,
    isSupported: store.isSupported,
    isListening: store.voiceState === "listening",
    isProcessing: store.voiceState === "processing",
    error: store.error,

    // Controls
    startListening,
    stopListening,
    toggleListening,
    setLanguage,
    reset: store.reset,
  };
}
