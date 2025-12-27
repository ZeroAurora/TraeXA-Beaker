import type { Route } from "./+types/home";
import { useState } from "react";
import { FloatingHeader } from "../components/layout/floating-header";
import { FloatingNav } from "../components/layout/floating-nav";
import { DrawerPanel } from "../components/ui/drawer-panel";
import { Dashboard } from "../components/features/dashboard/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beaker - 工作台" },
    { name: "description", content: "Mix Knowledges for New Ideas" },
  ];
}

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-background">
      <FloatingHeader />
      <main className="h-full pt-16 pb-20 overflow-auto">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <Dashboard />
        </div>
      </main>
      <FloatingNav />
      <DrawerPanel isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
