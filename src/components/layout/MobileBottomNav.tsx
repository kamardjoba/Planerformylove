"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  Target,
  BarChart3,
  BookOpen,
} from "lucide-react";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/planner", label: "Planner", icon: ListTodo },
  { href: "/app/calendar", label: "Calendar", icon: Calendar },
  { href: "/app/diary", label: "Diary", icon: BookOpen },
  { href: "/app/focus", label: "Focus", icon: Target },
  { href: "/app/stats", label: "Stats", icon: BarChart3 },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border bg-surface-elevated/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md md:hidden"
      aria-label="Bottom navigation"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href || (href !== "/app" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex min-w-0 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "text-accent"
                : "text-text-tertiary active:bg-surface-muted"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
