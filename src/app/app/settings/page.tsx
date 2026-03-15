"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Bell, Clock } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useStore } from "@/store/useStore";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl font-semibold text-text-primary sm:text-2xl">Settings</h1>
        <p className="mt-1 text-text-secondary">
          Customize your experience
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-6"
      >
        <div className="rounded-2xl border border-border bg-surface-elevated p-6">
          <h2 className="mb-4 flex items-center gap-2 font-medium text-text-primary">
            <Sun className="h-4 w-4 text-text-tertiary" />
            Appearance
          </h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 transition-colors ${
                theme === "light"
                  ? "border-accent bg-accent-subtle text-accent"
                  : "border-border bg-surface-muted text-text-secondary hover:border-border"
              }`}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 transition-colors ${
                theme === "dark"
                  ? "border-accent bg-accent-subtle text-accent"
                  : "border-border bg-surface-muted text-text-secondary hover:border-border"
              }`}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-elevated p-6">
          <h2 className="mb-4 flex items-center gap-2 font-medium text-text-primary">
            <Clock className="h-4 w-4 text-text-tertiary" />
            Focus (Pomodoro)
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Focus (min)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={settings.pomodoroMinutes}
                onChange={(e) =>
                  updateSettings({
                    pomodoroMinutes: Math.max(1, parseInt(e.target.value, 10) || 25),
                  })
                }
                className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Short break (min)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={settings.shortBreakMinutes}
                onChange={(e) =>
                  updateSettings({
                    shortBreakMinutes: Math.max(1, parseInt(e.target.value, 10) || 5),
                  })
                }
                className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Long break (min)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={settings.longBreakMinutes}
                onChange={(e) =>
                  updateSettings({
                    longBreakMinutes: Math.max(1, parseInt(e.target.value, 10) || 15),
                  })
                }
                className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-elevated p-6">
          <h2 className="mb-4 flex items-center gap-2 font-medium text-text-primary">
            <Bell className="h-4 w-4 text-text-tertiary" />
            Notifications
          </h2>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-text-secondary">Enable notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) =>
                updateSettings({ notifications: e.target.checked })
              }
              className="h-5 w-5 rounded border-border text-accent focus:ring-accent"
            />
          </label>
        </div>

        <div id="shortcuts" className="rounded-2xl border border-border bg-surface-elevated p-6">
          <h2 className="mb-4 font-medium text-text-primary">Keyboard shortcuts</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex justify-between gap-4">
              <span>Dashboard</span>
              <kbd className="rounded bg-surface-muted px-2 py-0.5 font-mono text-xs">
                ⌘ D
              </kbd>
            </li>
            <li className="flex justify-between gap-4">
              <span>Planner</span>
              <kbd className="rounded bg-surface-muted px-2 py-0.5 font-mono text-xs">
                ⌘ K
              </kbd>
            </li>
            <li className="flex justify-between gap-4">
              <span>Calendar</span>
              <kbd className="rounded bg-surface-muted px-2 py-0.5 font-mono text-xs">
                ⌘ C
              </kbd>
            </li>
            <li className="flex justify-between gap-4">
              <span>Focus</span>
              <kbd className="rounded bg-surface-muted px-2 py-0.5 font-mono text-xs">
                ⌘ F
              </kbd>
            </li>
            <li className="flex justify-between gap-4">
              <span>Statistics</span>
              <kbd className="rounded bg-surface-muted px-2 py-0.5 font-mono text-xs">
                ⌘ S
              </kbd>
            </li>
            <li className="flex justify-between gap-4">
              <span>Show shortcuts</span>
              <kbd className="rounded bg-surface-muted px-2 py-0.5 font-mono text-xs">
                ?
              </kbd>
            </li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
