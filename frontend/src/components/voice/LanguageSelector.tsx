"use client";

import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVoice } from "@/hooks/useVoice";
import { VOICE_LANGUAGES, type VoiceLanguageCode } from "@/lib/constants";

interface LanguageSelectorProps {
  className?: string;
}

/**
 * LanguageSelector — lets the user choose the speech recognition language.
 * Automatically restarts recognition in the new language if currently active.
 */
export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { language, setLanguage, isListening } = useVoice();

  return (
    <Select
      value={language}
      onValueChange={(v) => setLanguage(v as VoiceLanguageCode)}
    >
      <SelectTrigger
        className={className}
        aria-label="Select voice recognition language"
      >
        <Globe className="h-4 w-4 mr-1.5 text-muted-foreground shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {VOICE_LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
