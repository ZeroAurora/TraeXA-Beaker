import { useState } from "react";
import {
  Link2,
  FileText,
  Save,
  Loader2,
  ExternalLink,
  PanelRightOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

interface CrawlerProps {
  onOpenDrawer?: () => void;
}

export function Crawler({ onOpenDrawer }: CrawlerProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [crawledContent, setCrawledContent] = useState<{
    title: string;
    content: string;
    metadata: Record<string, string>;
  } | null>(null);

  const handleCrawl = async () => {
    if (!url) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setCrawledContent({
      title: "React 19 新特性详解",
      content: `React 19 带来了多项重大更新，旨在提升开发者体验和应用性能。

## 主要特性

### 1. Actions
Actions 是 React 19 引入的新特性，用于简化异步操作的处理。

### 2. use hook
新的 use hook 允许在组件外部获取数据。

### 3. Server Components
React 19 默认支持 Server Components。`,
      metadata: {
        url: url,
        source: "jina-reader",
        extractedAt: new Date().toISOString(),
        wordCount: "约 500 字",
      },
    });
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">内容抓取</h1>
          <p className="text-muted-foreground mt-1">
            使用 Jina Reader API 提取网页内容
          </p>
        </div>
        {onOpenDrawer && (
          <Button variant="ghost" size="icon" onClick={onOpenDrawer}>
            <PanelRightOpen className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl" />
        <div className="relative p-8 rounded-2xl border bg-background/50 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">输入网页地址</h2>
              <p className="text-sm text-muted-foreground">
                支持任意公开网页的智能内容提取
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="https://example.com/article..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 h-12 text-lg"
            />
            <Button
              onClick={handleCrawl}
              disabled={!url || isLoading}
              className="h-12 px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  抓取中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  提取内容
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {crawledContent && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">抓取结果</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {crawledContent.metadata.url}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <FileText className="w-3 h-3" />
                  {crawledContent.metadata.wordCount}
                </Badge>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden">
            <Tabs defaultValue="preview">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <TabsList className="h-9">
                  <TabsTrigger value="preview" className="text-sm">
                    内容预览
                  </TabsTrigger>
                  <TabsTrigger value="markdown" className="text-sm">
                    Markdown
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="自定义标题..."
                    className="h-8 w-48 text-sm"
                    defaultValue={crawledContent.title}
                  />
                  <Input
                    placeholder="标签..."
                    className="h-8 w-32 text-sm"
                  />
                  <Button size="sm" className="h-8 gap-1">
                    <Save className="w-3 h-3" />
                    保存
                  </Button>
                </div>
              </div>
              <TabsContent value="preview" className="m-0">
                <ScrollArea className="h-[400px] p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h1 className="text-2xl font-bold mb-4">
                      {crawledContent.title}
                    </h1>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {crawledContent.content}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="markdown" className="m-0">
                <ScrollArea className="h-[400px]">
                  <pre className="p-6 text-sm font-mono whitespace-pre-wrap">
                    {`# ${crawledContent.title}

---

**URL**: ${crawledContent.metadata.url}
**提取时间**: ${crawledContent.metadata.extractedAt}
**来源**: Jina Reader API

---

${crawledContent.content}`}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "智能提取",
            desc: "自动识别并提取网页正文",
            icon: FileText,
            color: "from-blue-500 to-cyan-500",
          },
          {
            title: "Markdown 格式",
            desc: "转换为标准 Markdown",
            icon: FileText,
            color: "from-green-500 to-emerald-500",
          },
          {
            title: "元数据",
            desc: "提取标题、描述、作者",
            icon: Sparkles,
            color: "from-teal-500 to-cyan-500",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-5 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3",
                item.color
              )}
            >
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-medium mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
