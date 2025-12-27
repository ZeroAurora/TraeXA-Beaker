import { useState } from "react";
import type { Route } from "./+types/knowledge";
import { FloatingHeader } from "../components/layout/floating-header";
import { FloatingNav } from "../components/layout/floating-nav";
import { DrawerPanel } from "../components/ui/drawer-panel";
import { KnowledgeBase } from "../components/features/knowledge/knowledge-base";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beaker - 知识库" },
    { name: "description", content: "管理您的知识文档" },
  ];
}

export default function KnowledgePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-background">
      <FloatingHeader />
      <main className="h-full pt-16 pb-20 overflow-auto">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <KnowledgeBase onOpenDrawer={() => setDrawerOpen(true)} />
        </div>
      </main>
      <FloatingNav />
      <DrawerPanel isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
