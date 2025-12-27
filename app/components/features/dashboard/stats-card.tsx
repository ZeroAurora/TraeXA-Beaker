import { FileText, Rss, MessageCircle, FlaskConical, TrendingUp } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  trend?: number;
  className?: string;
}

const iconMap: Record<string, typeof FileText> = {
  "file-text": FileText,
  rss: Rss,
  "message-circle": MessageCircle,
  "flask-conical": FlaskConical,
};

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  const Icon = iconMap[icon] || FileText;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {trend !== undefined && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    trend >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  <TrendingUp
                    className={cn("w-3 h-3", trend < 0 && "rotate-180")}
                  />
                  {Math.abs(trend)}%
                </div>
              )}
              <span className="text-xs text-muted-foreground">{description}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center">
            <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
    </Card>
  );
}
