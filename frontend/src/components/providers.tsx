"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root providers wrapper.
 * - ThemeProvider (next-themes) for dark/light/system
 * - react-hot-toast global outlet
 *
 * Note: react-speech-recognition does NOT need a provider —
 * it hooks into the browser's Web Speech API directly.
 * SpeechRecognition polyfill is loaded in useVoice on the client.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: { primary: "hsl(142.1 76.2% 36.3%)", secondary: "white" },
          },
          error: {
            iconTheme: { primary: "hsl(0 84.2% 60.2%)", secondary: "white" },
          },
        }}
      />
    </ThemeProvider>
  );
}
