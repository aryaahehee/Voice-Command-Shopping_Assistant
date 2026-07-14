/**
 * Next.js root-level loading UI (React Suspense boundary).
 * Shown while a page segment is being loaded.
 */
export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated microphone spinner */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary/20 voice-ripple" />
          <span className="relative inline-flex h-10 w-10 rounded-full bg-primary/30 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
              aria-hidden="true"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </span>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading VoiceCart…
        </p>
      </div>
    </div>
  );
}
