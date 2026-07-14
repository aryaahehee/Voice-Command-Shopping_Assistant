"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { VoiceButton } from "@/components/voice/VoiceButton";
import { Transcript } from "@/components/voice/Transcript";
import { CommandFeedback } from "@/components/voice/CommandFeedback";
import { Button } from "@/components/ui/button";

/**
 * DashboardHero — animated welcome section with large voice button.
 */
export function DashboardHero() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white shadow-glow-lg"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-xl" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-8">
        {/* Left: text + CTA */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-violet-200 text-sm font-medium mb-1">
            Welcome back
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Hey, {firstName}! 👋
          </h1>
          <p className="mt-2 text-violet-100/80 text-sm max-w-sm">
            Tap the mic and say what you need — VoiceCart handles the rest.
          </p>

          <div className="mt-5 flex items-center gap-3 justify-center md:justify-start">
            <Button
              asChild
              className="bg-white text-violet-700 hover:bg-violet-50 font-semibold gap-1.5"
            >
              <Link href="/list">
                <ShoppingCart className="h-4 w-4" />
                Open my list
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right: voice button */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <VoiceButton size="lg" />
          <div className="w-72 space-y-2">
            <Transcript />
            <CommandFeedback />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
