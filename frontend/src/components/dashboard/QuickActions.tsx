"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Mic,
  BarChart3,
  History,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useShopping } from "@/hooks/useShopping";
import { AddItemForm } from "@/components/shopping/AddItemForm";

const ACTIONS = [
  {
    href: "/list",
    icon: ShoppingCart,
    label: "My List",
    description: "View & manage items",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  {
    href: "/list",
    icon: Mic,
    label: "Voice Mode",
    description: "Add with your voice",
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  {
    href: "/history",
    icon: History,
    label: "History",
    description: "Past purchases",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    href: "/dashboard",
    icon: BarChart3,
    label: "Stats",
    description: "Shopping insights",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
];

export function QuickActions() {
  const [addOpen, setAddOpen] = useState(false);
  const { addItem } = useShopping();

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base">Quick Actions</h2>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4"
          >
            <Plus className="h-3.5 w-3.5" />
            Add item
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACTIONS.map(({ href, icon: Icon, label, description, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
            >
              <Link
                href={href}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:shadow-md hover:-translate-y-0.5 ${color}`}
              >
                <div className="rounded-lg p-2.5 bg-current/10">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <AddItemForm
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={async (item) => { await addItem(item); }}
      />
    </>
  );
}
