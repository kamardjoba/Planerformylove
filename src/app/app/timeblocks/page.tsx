"use client";

import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { TimeBlockPlanner } from "@/components/timeblocks/TimeBlockPlanner";

export default function TimeBlocksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="flex items-center gap-2 text-xl font-semibold text-text-primary sm:text-2xl">
          <LayoutGrid className="h-6 w-6 text-accent" />
          Time blocks
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Plan your week. Tap a day to see the timeline, drag to move, resize from the bottom.
        </p>
      </motion.div>
      <TimeBlockPlanner />
    </div>
  );
}
