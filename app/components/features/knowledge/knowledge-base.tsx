import { useState } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  FileText,
  Tag,
  Sparkles,
  PanelRightOpen,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { mockDocuments } from "~/data/mock-data";
import { cn } from "~/lib/utils";

interface KnowledgeBaseProps {
  onOpenDrawer?: () => void;
}

export function KnowledgeBase({ onOpenDrawer }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const filteredDocs = mockDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const selectedDocument = mockDocuments.find((doc) => doc.id === selectedDoc);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">知识库</h1>
          <p className="text-muted-foreground">
            管理您的文档收藏，AI 生成的内容会有特殊标识
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <FileText className="w-3 h-3" />
            {filteredDocs.length} 篇文档
          </Badge>
          {filteredDocs.some((d) => d.isAIGenerated) && (
            <Badge
              variant="outline"
              className="gap-1 border-teal-300 text-teal-600"
            >
              <Sparkles className="w-3 h-3" />
              {filteredDocs.filter((d) => d.isAIGenerated).length} 篇 AI 生成
            </Badge>
          )}
          {onOpenDrawer && (
            <Button variant="ghost" size="icon" onClick={onOpenDrawer}>
              <PanelRightOpen className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索文档或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="来源" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            <SelectItem value="jina">Jina 抓取</SelectItem>
            <SelectItem value="rss">RSS 订阅</SelectItem>
            <SelectItem value="remix">AI 重组</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="newest">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">最新添加</SelectItem>
            <SelectItem value="oldest">最早添加</SelectItem>
            <SelectItem value="title">标题排序</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-r-none"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-l-none"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDocs.map((doc) => (
                <Card
                  key={doc.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedDoc === doc.id && "ring-2 ring-teal-500"
                  )}
                  onClick={() => setSelectedDoc(doc.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant={
                          doc.source === "remix"
                            ? "default"
                            : doc.source === "rss"
                              ? "secondary"
                              : "outline"
                        }
                        className={cn(doc.source === "remix" && "bg-teal-500")}
                      >
                        {doc.source === "jina" && "抓取"}
                        {doc.source === "rss" && "RSS"}
                        {doc.source === "remix" && "AI 重组"}
                      </Badge>
                      {doc.isAIGenerated && (
                        <Badge
                          variant="outline"
                          className="gap-1 text-teal-600 border-teal-300"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {doc.summary}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      {formatDate(doc.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <Card
                  key={doc.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedDoc === doc.id && "ring-2 ring-teal-500"
                  )}
                  onClick={() => setSelectedDoc(doc.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            doc.source === "remix"
                              ? "default"
                              : doc.source === "rss"
                                ? "secondary"
                                : "outline"
                          }
                          className={cn(doc.source === "remix" && "bg-teal-500")}
                        >
                          {doc.source === "jina" && "抓取"}
                          {doc.source === "rss" && "RSS"}
                          {doc.source === "remix" && "AI 重组"}
                        </Badge>
                        {doc.isAIGenerated && (
                          <Badge
                            variant="outline"
                            className="gap-1 text-teal-600 border-teal-300"
                          >
                            <Sparkles className="w-3 h-3" />
                            AI
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(doc.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-semibold">{doc.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {selectedDocument && (
          <Card className="h-fit sticky top-24">
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge
                      variant={
                        selectedDocument.source === "remix"
                          ? "default"
                          : selectedDocument.source === "rss"
                            ? "secondary"
                            : "outline"
                      }
                      className={cn(
                        selectedDocument.source === "remix" && "bg-teal-500"
                      )}
                    >
                      {selectedDocument.source === "jina" && "抓取"}
                      {selectedDocument.source === "rss" && "RSS"}
                      {selectedDocument.source === "remix" && "AI 重组"}
                    </Badge>
                    {selectedDocument.isAIGenerated && (
                      <Badge
                        variant="outline"
                        className="gap-1 text-teal-600 border-teal-300"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI 生成
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    {selectedDocument.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedDocument.summary}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        标签
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedDocument.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">来源</h4>
                      <a
                        href={selectedDocument.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        {selectedDocument.url}
                      </a>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full" variant="outline">
                        在聊天中使用
                      </Button>
                      <Button className="w-full mt-2" variant="outline">
                        复制内容
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
