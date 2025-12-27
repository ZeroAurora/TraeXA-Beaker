import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Search,
  Bell,
  Settings,
  User,
  FlaskConical,
  Command,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { navItems } from "~/data/mock-data";
import { cn } from "~/lib/utils";

export function FloatingHeader() {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getCurrentTitle = () => {
    const currentItem = navItems.find((item) => item.path === location.pathname);
    return currentItem?.label || "Beaker";
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Beaker
            </span>
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-sm font-medium text-muted-foreground">
            {getCurrentTitle()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground"
          >
            <Search className="w-4 h-4" />
            <span>搜索...</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-teal-100 text-teal-600 text-sm">
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">用户名称</p>
                  <p className="text-xs text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                个人资料
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {showSearch && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="w-full max-w-xl bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="text"
                placeholder="搜索文档、对话、订阅源..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                autoFocus
              />
              <kbd className="h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium">
                ESC
              </kbd>
            </div>
            <div className="p-2">
              {searchQuery ? (
                <div className="py-2">
                  <p className="text-xs text-muted-foreground px-2 mb-2">
                    搜索结果
                  </p>
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left text-sm">
                      <FlaskConical className="w-4 h-4 text-muted-foreground" />
                      <span>搜索 "{searchQuery}"</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <p className="text-xs text-muted-foreground px-2 mb-2">
                    快捷操作
                  </p>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left text-sm">
                    <FlaskConical className="w-4 h-4 text-teal-500" />
                    <span>创建新的知识重组</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left text-sm">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span>搜索文档...</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
