"use client";

import { motion } from "framer-motion";
import { WeeklyDiary } from "@/components/diary/WeeklyDiary";

export default function DiaryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <WeeklyDiary />
    </div>
  );
}
