import { Download, MessageCircle, FlaskConical, Rss, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { mockRecentActivity } from "~/data/mock-data";

const iconMap: Record<string, typeof Download> = {
  crawl: Download,
  chat: MessageCircle,
  remix: FlaskConical,
  subscription: Rss,
};

export function RecentActivity() {
  const getIcon = (type: string) => {
    return iconMap[type] || Clock;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    return `${diffDays} 天前`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          最近活动
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecentActivity.map((activity) => {
            const Icon = getIcon(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    activity.type === "crawl" &&
                      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                    activity.type === "chat" &&
                      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                    activity.type === "remix" &&
                      "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
                    activity.type === "subscription" &&
                      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
