import { useState } from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Download,
  Library,
  Rss,
  MessageCircle,
  FlaskConical,
  Sparkles,
  Plus,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { navItems } from "~/data/mock-data";
import { cn } from "~/lib/utils";

const iconMap: Record<string, typeof LayoutDashboard> = {
  "layout-dashboard": LayoutDashboard,
  download: Download,
  library: Library,
  rss: Rss,
  "message-circle": MessageCircle,
  "flask-conical": FlaskConical,
};

const quickActions = [
  { icon: Download, label: "抓取内容", path: "/crawler" },
  { icon: MessageCircle, label: "开始聊天", path: "/chat" },
  { icon: FlaskConical, label: "知识重组", path: "/remix" },
  { icon: Rss, label: "添加订阅", path: "/subscription" },
];

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-16 right-0 mb-4 w-64 bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold">导航</h3>
            </div>
            <nav className="p-2 space-y-1">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-3">快捷操作</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <NavLink
                    key={action.path}
                    to={action.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                  >
                    <action.icon className="w-4 h-4 text-teal-600" />
                    <span>{action.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full shadow-lg transition-all duration-300",
            isOpen
              ? "bg-muted hover:bg-muted text-foreground"
              : "bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
          )}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
