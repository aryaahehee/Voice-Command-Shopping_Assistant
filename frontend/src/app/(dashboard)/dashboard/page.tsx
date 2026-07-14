import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | VoiceCart" };

/**
 * Dashboard page — full UI built in Milestone 10.
 * This placeholder confirms routing and auth guard are working.
 */
export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Full dashboard UI coming in Milestone 10.
      </p>
    </main>
  );
}
