import { Sparkles, Copy, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { mockVibeRecommendations } from "~/data/mock-data";
import { cn } from "~/lib/utils";

export function VibeSidebar() {
  const getDocumentTitle = (docId: string) => {
    const titles: Record<string, string> = {
      "1": "React 19 新特性详解",
      "2": "AI Agent 的设计模式",
      "4": "Tailwind CSS v4 更新内容",
    };
    return titles[docId] || "未知文档";
  };

  return (
    <aside className="w-80 border-l border-border bg-card h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Vibe Writing</h3>
            <p className="text-xs text-muted-foreground">相关内容推荐</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              基于当前内容推荐
            </span>
            <Badge variant="secondary" className="text-xs">
              {mockVibeRecommendations.length} 个片段
            </Badge>
          </div>

          {mockVibeRecommendations.map((rec, index) => (
            <div
              key={rec.id}
              className="group relative p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-start gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    rec.relevanceScore >= 0.9
                      ? "border-green-500 text-green-600"
                      : rec.relevanceScore >= 0.8
                        ? "border-yellow-500 text-yellow-600"
                        : "border-gray-500 text-gray-600"
                  )}
                >
                  {Math.round(rec.relevanceScore * 100)}% 相关
                </Badge>
                <span className="text-xs text-muted-foreground">
                  来自 {getDocumentTitle(rec.documentId)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rec.fragment}
              </p>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Copy className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button className="w-full" variant="outline">
          <Sparkles className="w-4 h-4 mr-2" />
          生成摘要
        </Button>
      </div>
    </aside>
  );
}
