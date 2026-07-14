import type { Metadata } from "next";
import {
  ShoppingCart,
  CheckCircle2,
  Mic,
  DollarSign,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentItems } from "@/components/dashboard/RecentItems";
import { TopPurchased } from "@/components/dashboard/TopPurchased";
import { RecommendationsPanel } from "@/components/recommendations/RecommendationsPanel";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

export const metadata: Metadata = { title: "Dashboard | VoiceCart" };

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6 space-y-6">
        {/* Hero section */}
        <DashboardHero />

        {/* Stats row */}
        <DashboardStats />

        {/* Quick actions */}
        <QuickActions />

        {/* Charts + activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActivityChart />
          <CategoryChart />
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent + Top purchased */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <RecentItems />
            <TopPurchased />
          </div>

          {/* Recommendations sidebar */}
          <div className="lg:col-span-1">
            <RecommendationsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
