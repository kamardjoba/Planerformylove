"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  Target,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Flame,
  X,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/planner", label: "Planner", icon: ListTodo },
  { href: "/app/calendar", label: "Calendar", icon: Calendar },
  { href: "/app/focus", label: "Focus", icon: Target },
  { href: "/app/stats", label: "Statistics", icon: BarChart3 },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isMobile = onClose !== undefined;

  const sidebarContent = (
    <aside
      className={`flex h-full w-56 flex-col border-r border-border bg-surface-elevated/95 md:bg-surface-elevated/80 ${
        isMobile ? "w-64" : ""
      }`}
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <Link href="/app" className="flex items-center gap-2" onClick={onClose}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-white">
            <Flame className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold text-text-primary">
            DailyFlow
          </span>
        </Link>
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-muted hover:text-text-primary"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/app" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={onClose}>
              <motion.span
                whileHover={isMobile ? undefined : { x: 2 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent-subtle text-accent"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </motion.span>
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          icon={
            theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )
          }
          onClick={toggleTheme}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={onClose}
              aria-hidden
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return <div className="hidden shrink-0 md:block">{sidebarContent}</div>;
}
