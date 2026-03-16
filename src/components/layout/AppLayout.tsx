"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { KeyboardShortcuts } from "../keyboard/KeyboardShortcuts";
import { useIsMobile } from "@/hooks/useMediaQuery";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar
        isOpen={isMobile ? sidebarOpen : true}
        onClose={isMobile ? () => setSidebarOpen(false) : undefined}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-h-0 flex-1 overflow-auto pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
          <KeyboardShortcuts />
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
