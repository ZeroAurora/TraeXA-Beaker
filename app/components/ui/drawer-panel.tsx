import { X, Search, FileText, Settings, Database, Globe, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { mockDocuments } from "~/data/mock-data";
import { cn } from "~/lib/utils";

interface DrawerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DrawerPanel({ isOpen, onClose }: DrawerPanelProps) {
  const searchScopes = [
    { id: "documents", label: "我的文档", icon: FileText, checked: true },
    { id: "rss", label: "RSS 订阅", icon: Globe, checked: true },
    { id: "ai", label: "AI 生成内容", icon: Sparkles, checked: true },
    { id: "database", label: "向量数据库", icon: Database, checked: false },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-50 transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-teal-500" />
            <span className="font-medium">搜索设置</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-4rem)] p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">搜索范围</h3>
              <div className="space-y-2">
                {searchScopes.map((scope) => (
                  <label
                    key={scope.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center",
                        scope.checked
                          ? "bg-teal-500 border-teal-500"
                          : "border-border"
                      )}
                    >
                      {scope.checked && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="w-3 h-3 text-white"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <scope.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{scope.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">相关文档</h3>
              <div className="space-y-2">
                {mockDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium line-clamp-1">
                          {doc.title}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {doc.isAIGenerated ? "AI" : doc.source}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-medium">Pro 提示</span>
              </div>
              <p className="text-xs text-muted-foreground">
                启用更多搜索源可以获得更准确的回答。专业版用户可以访问 RSS
                订阅和向量数据库。
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
