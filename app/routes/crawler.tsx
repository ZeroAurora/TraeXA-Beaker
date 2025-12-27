import { useState } from "react";
import type { Route } from "./+types/crawler";
import { FloatingHeader } from "../components/layout/floating-header";
import { FloatingNav } from "../components/layout/floating-nav";
import { DrawerPanel } from "../components/ui/drawer-panel";
import { Crawler } from "../components/features/crawler/crawler";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beaker - 内容抓取" },
    { name: "description", content: "使用 Jina Reader 抓取网页内容" },
  ];
}

export default function CrawlerPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-background">
      <FloatingHeader />
      <main className="h-full pt-16 pb-20 overflow-auto">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <Crawler onOpenDrawer={() => setDrawerOpen(true)} />
        </div>
      </main>
      <FloatingNav />
      <DrawerPanel isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
