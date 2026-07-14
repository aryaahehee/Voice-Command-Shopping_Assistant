import { create } from "zustand";
import type { VoiceState, ParsedVoiceCommand } from "@/types";
import { DEFAULT_VOICE_LANGUAGE, type VoiceLanguageCode } from "@/lib/constants";

interface VoiceStoreState {
  voiceState: VoiceState;
  transcript: string;
  interimTranscript: string;
  lastCommand: ParsedVoiceCommand | null;
  language: VoiceLanguageCode;
  isSupported: boolean;
  error: string | null;
}

interface VoiceStoreActions {
  setVoiceState: (state: VoiceState) => void;
  setTranscript: (t: string) => void;
  setInterimTranscript: (t: string) => void;
  setLastCommand: (cmd: ParsedVoiceCommand | null) => void;
  setLanguage: (lang: VoiceLanguageCode) => void;
  setIsSupported: (v: boolean) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

type VoiceStore = VoiceStoreState & VoiceStoreActions;

export const useVoiceStore = create<VoiceStore>()((set) => ({
  // State
  voiceState: "idle",
  transcript: "",
  interimTranscript: "",
  lastCommand: null,
  language: DEFAULT_VOICE_LANGUAGE,
  isSupported: false,
  error: null,

  // Actions
  setVoiceState: (voiceState) => set({ voiceState }),
  setTranscript: (transcript) => set({ transcript }),
  setInterimTranscript: (interimTranscript) => set({ interimTranscript }),
  setLastCommand: (lastCommand) => set({ lastCommand }),
  setLanguage: (language) => set({ language }),
  setIsSupported: (isSupported) => set({ isSupported }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      voiceState: "idle",
      transcript: "",
      interimTranscript: "",
      lastCommand: null,
      error: null,
    }),
}));
