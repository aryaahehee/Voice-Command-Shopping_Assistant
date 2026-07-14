import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoiceCart — AI Voice Shopping Assistant",
};

/**
 * Home page — placeholder until the full Dashboard component is wired up
 * in Milestone 10. This page confirms Next.js routing is working.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          {/* Microphone SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
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
        </div>

        <h1 className="text-4xl font-bold tracking-tight gradient-text">
          VoiceCart
        </h1>

        <p className="text-muted-foreground text-lg max-w-md">
          AI-powered voice shopping assistant. Project scaffold is ready —
          dashboard and features will be added milestone by milestone.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {[
            "Next.js 15",
            "TypeScript",
            "TailwindCSS",
            "shadcn/ui",
            "Framer Motion",
          ].map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
