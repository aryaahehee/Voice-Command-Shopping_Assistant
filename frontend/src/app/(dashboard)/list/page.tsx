import type { Metadata } from "next";
import { ShoppingListView } from "@/components/shopping/ShoppingListView";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = { title: "My List | VoiceCart" };

export default function ListPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <ShoppingListView />
      </main>
    </div>
  );
}
