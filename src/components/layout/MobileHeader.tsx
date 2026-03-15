"use client";

import Link from "next/link";
import { Flame, Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface-elevated/95 px-4 backdrop-blur-md md:hidden">
      <Link href="/app" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-white">
          <Flame className="h-4 w-4" />
        </span>
        <span className="font-display text-lg font-semibold text-text-primary">
          DailyFlow
        </span>
      </Link>
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary hover:bg-surface-muted hover:text-text-primary active:bg-surface-muted"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
}
