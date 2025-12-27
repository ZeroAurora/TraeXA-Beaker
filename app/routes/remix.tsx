import { useState } from "react";
import type { Route } from "./+types/remix";
import { FloatingHeader } from "../components/layout/floating-header";
import { FloatingNav } from "../components/layout/floating-nav";
import { DrawerPanel } from "../components/ui/drawer-panel";
import { RemixPage } from "../components/features/remix/remix-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beaker - 知识重组" },
    { name: "description", content: "Mix 多个文档生成新知识" },
  ];
}

export default function Remix() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-background">
      <FloatingHeader />
      <main className="h-full pt-16 pb-20 overflow-auto">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <RemixPage onOpenDrawer={() => setDrawerOpen(true)} />
        </div>
      </main>
      <FloatingNav />
      <DrawerPanel isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
