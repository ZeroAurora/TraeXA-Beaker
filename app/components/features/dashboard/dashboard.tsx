import { Link } from "react-router";
import { ArrowRight, Download, MessageCircle, FlaskConical, Rss } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { mockStats, mockRecentActivity } from "~/data/mock-data";
import { cn } from "~/lib/utils";

function StatItem({
  value,
  label,
  icon: Icon,
  trend,
}: {
  value: number | string;
  label: string;
  icon: React.ElementType;
  trend?: number;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      {trend !== undefined && (
        <div
          className={cn(
            "text-sm font-medium",
            trend >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {trend >= 0 ? "+" : ""}
          {trend}%
        </div>
      )}
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  description,
  to,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center group-hover:from-teal-200 group-hover:to-cyan-200 transition-colors">
        <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Link>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">工作台</h1>
        <p className="text-muted-foreground">欢迎回来！这里是您的知识管理概览。</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem
          value={mockStats.totalDocuments}
          label="文档总数"
          icon={Download}
          trend={12}
        />
        <StatItem
          value={mockStats.activeSubscriptions}
          label="活跃订阅"
          icon={Rss}
          trend={0}
        />
        <StatItem
          value={mockStats.totalChats}
          label="对话次数"
          icon={MessageCircle}
          trend={8}
        />
        <StatItem
          value={mockStats.remixCount}
          label="重组文档"
          icon={FlaskConical}
          trend={15}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold">快捷操作</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickAction
                icon={Download}
                label="抓取内容"
                description="使用 Jina Reader"
                to="/crawler"
              />
              <QuickAction
                icon={MessageCircle}
                label="开始聊天"
                description="基于知识库对话"
                to="/chat"
              />
              <QuickAction
                icon={FlaskConical}
                label="知识重组"
                description="Mix 多个文档"
                to="/remix"
              />
              <QuickAction
                icon={Rss}
                label="添加订阅"
                description="RSS 自动导入"
                to="/subscription"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold">最近活动</h2>
            <div className="space-y-3">
              {mockRecentActivity.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5",
                      activity.type === "crawl" && "bg-teal-500",
                      activity.type === "chat" && "bg-blue-500",
                      activity.type === "remix" && "bg-purple-500",
                      activity.type === "subscription" && "bg-amber-500"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/knowledge">
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                查看全部活动
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">AI 助手建议</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
              <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                💡 您最近添加了关于 React 19 的文章
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                建议：可以与之前添加的 AI Agent 文章进行知识重组，探索 React 19
                Actions 与 Agent 设计的结合点。
              </p>
              <Link to="/remix">
                <Button variant="link" className="p-0 h-auto mt-2 text-teal-600">
                  立即重组 <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                📊 有 3 篇新文章待处理
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                您订阅的 RSS 源有新内容更新，建议同步到知识库。
              </p>
              <Link to="/subscription">
                <Button variant="link" className="p-0 h-auto mt-2 text-amber-600">
                  查看更新 <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">知识库概览</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">本周新增文档</span>
              <span className="text-3xl font-bold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">AI 生成内容</span>
              <span className="text-3xl font-bold text-teal-600">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">最常用标签</span>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-muted rounded-full text-sm">
                  React
                </span>
                <span className="px-3 py-1 bg-muted rounded-full text-sm">AI</span>
              </div>
            </div>
            <Link to="/knowledge">
              <Button variant="outline" className="w-full">
                查看全部文档
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
