import type { Metadata } from "next";
import { ShoppingListView } from "@/components/shopping/ShoppingListView";
import { VoicePanel } from "@/components/voice/VoicePanel";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = { title: "My List | VoiceCart" };

export default function ListPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Shopping list — takes 2/3 width on large screens */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <ShoppingListView />
          </div>

          {/* Voice panel — sidebar on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <VoicePanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
