import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Download,
  Library,
  Rss,
  MessageCircle,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { navItems } from "~/data/mock-data";
import { ScrollArea } from "~/components/ui/scroll-area";

const iconMap: Record<string, typeof LayoutDashboard> = {
  "layout-dashboard": LayoutDashboard,
  download: Download,
  library: Library,
  rss: Rss,
  "message-circle": MessageCircle,
  "flask-conical": FlaskConical,
};

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card h-[calc(100vh-4rem)] flex flex-col">
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
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
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">B</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Beaker Pro</p>
            <p className="text-xs text-muted-foreground">升级计划</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
