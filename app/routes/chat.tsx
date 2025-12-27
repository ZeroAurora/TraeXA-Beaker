import { useState } from "react";
import type { Route } from "./+types/chat";
import { DrawerPanel } from "../components/ui/drawer-panel";
import { ChatPage } from "../components/features/chat/chat-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beaker - 智能聊天" },
    { name: "description", content: "基于知识库的智能对话" },
  ];
}

export default function Chat() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-background">
      <div className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 text-white"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="font-medium">Beaker AI</span>
          </a>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      </div>
      <main className="h-full pt-12">
        <ChatPage onOpenDrawer={() => setDrawerOpen(true)} />
      </main>
      <DrawerPanel isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
