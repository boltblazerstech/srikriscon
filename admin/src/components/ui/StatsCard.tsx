import { cn } from "@/src/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border p-5 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className="h-9 w-9 rounded-lg bg-primary-light text-primary flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 mt-1 text-xs font-medium",
              isPositive ? "text-success" : "text-destructive"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {change}%{changeLabel ? ` ${changeLabel}` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
