"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            router.push("/app/planner");
            break;
          case "d":
            e.preventDefault();
            router.push("/app");
            break;
          case "c":
            e.preventDefault();
            router.push("/app/calendar");
            break;
          case "f":
            e.preventDefault();
            router.push("/app/focus");
            break;
          case "s":
            e.preventDefault();
            router.push("/app/stats");
            break;
          default:
            break;
        }
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        router.push("/app/settings#shortcuts");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
