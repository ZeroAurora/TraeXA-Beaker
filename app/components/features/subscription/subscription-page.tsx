import { useState } from "react";
import {
  Rss,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  MoreHorizontal,
  PanelRightOpen,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { mockFeeds } from "~/data/mock-data";
import { cn } from "~/lib/utils";

interface SubscriptionPageProps {
  onOpenDrawer?: () => void;
}

export function SubscriptionPage({ onOpenDrawer }: SubscriptionPageProps) {
  const [feeds, setFeeds] = useState(mockFeeds);
  const [isAdding, setIsAdding] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState("");

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    return new Intl.DateTimeFormat("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleAddFeed = async () => {
    if (!newFeedUrl) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newFeed = {
      id: String(feeds.length + 1),
      name: "新订阅源",
      url: newFeedUrl,
      description: "正在同步...",
      lastSync: new Date(),
      status: "active",
      articleCount: 0,
    };

    setFeeds([...feeds, newFeed]);
    setNewFeedUrl("");
    setIsAdding(false);
  };

  const handleSync = async (feedId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFeeds(
      feeds.map((feed) =>
        feed.id === feedId ? { ...feed, lastSync: new Date() } : feed
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RSS 订阅</h1>
          <p className="text-muted-foreground">
            管理您的 RSS 订阅源，自动将新内容导入知识库
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            全部同步
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                添加订阅
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加 RSS 订阅</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    RSS 订阅地址
                  </label>
                  <Input
                    placeholder="https://example.com/rss.xml"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                  />
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    💡 提示：大多数网站会在页面底部或设置中提供 RSS 订阅链接。
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {}}>
                    取消
                  </Button>
                  <Button
                    onClick={handleAddFeed}
                    disabled={!newFeedUrl || isAdding}
                  >
                    {isAdding ? "验证中..." : "添加订阅"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {onOpenDrawer && (
            <Button variant="ghost" size="icon" onClick={onOpenDrawer}>
              <PanelRightOpen className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Rss className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">活跃订阅</p>
                <p className="text-2xl font-bold">{feeds.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">本周新增文章</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已导入文章</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="w-5 h-5" />
            订阅源列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    feed.status === "active"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-yellow-100 dark:bg-yellow-900/30"
                  )}
                >
                  <Rss
                    className={cn(
                      "w-5 h-5",
                      feed.status === "active"
                        ? "text-green-600"
                        : "text-yellow-600"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{feed.name}</h4>
                    <Badge
                      variant={feed.status === "active" ? "secondary" : "outline"}
                    >
                      {feed.status === "active" ? "活跃" : "暂停"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {feed.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {feed.articleCount} 篇文章
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · 同步于 {formatLastSync(feed.lastSync)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleSync(feed.id)}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={feed.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        设置
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除订阅
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">自动导入设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 className="font-medium">新文章自动导入</h4>
                <p className="text-sm text-muted-foreground">
                  当订阅源有新文章时自动导入到知识库
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 className="font-medium">同步频率</h4>
                <p className="text-sm text-muted-foreground">
                  每 4 小时自动检查一次更新
                </p>
              </div>
              <Button variant="outline">每 4 小时</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 className="font-medium">关键词过滤</h4>
                <p className="text-sm text-muted-foreground">
                  仅导入包含指定关键词的文章
                </p>
              </div>
              <Button variant="outline">未设置</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
