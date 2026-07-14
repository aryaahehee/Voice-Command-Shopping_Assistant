import type { Metadata } from "next";
import { ShoppingListView } from "@/components/shopping/ShoppingListView";
import { VoicePanel } from "@/components/voice/VoicePanel";
import { RecommendationsPanel } from "@/components/recommendations/RecommendationsPanel";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = { title: "My List | VoiceCart" };

export default function ListPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shopping list — 2/3 width on large screens */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <ShoppingListView />
          </div>

          {/* Right sidebar — sticky on large screens */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="sticky top-24 flex flex-col gap-4">
              <VoicePanel />
              <RecommendationsPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
