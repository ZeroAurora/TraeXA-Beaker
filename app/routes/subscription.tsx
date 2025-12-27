import { useState } from "react";
import type { Route } from "./+types/subscription";
import { FloatingHeader } from "../components/layout/floating-header";
import { FloatingNav } from "../components/layout/floating-nav";
import { DrawerPanel } from "../components/ui/drawer-panel";
import { SubscriptionPage } from "../components/features/subscription/subscription-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beaker - RSS订阅" },
    { name: "description", content: "管理您的 RSS 订阅源" },
  ];
}

export default function Subscription() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-background">
      <FloatingHeader />
      <main className="h-full pt-16 pb-20 overflow-auto">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <SubscriptionPage onOpenDrawer={() => setDrawerOpen(true)} />
        </div>
      </main>
      <FloatingNav />
      <DrawerPanel isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
