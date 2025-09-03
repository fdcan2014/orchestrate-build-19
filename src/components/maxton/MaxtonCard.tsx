import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MaxtonCardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  value?: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'outlined';
  gradientFrom?: string;
  gradientTo?: string;
}

export function MaxtonCard({ 
  title, 
  subtitle, 
  icon, 
  value, 
  change, 
  changeType = 'neutral',
  children, 
  className,
  variant = 'default',
  gradientFrom,
  gradientTo
}: MaxtonCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-emerald-400';
      case 'negative': return 'text-rose-400';
      default: return 'text-muted-foreground';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        if (gradientFrom && gradientTo) {
          return `bg-gradient-to-br ${gradientFrom} ${gradientTo} border-0 shadow-xl`;
        }
        return 'bg-gradient-to-br from-card via-card to-muted/20 border-0 shadow-xl';
      case 'outlined':
        return 'bg-card border-2 border-border hover:border-primary';
      default:
        return 'bg-card border border-border shadow-lg';
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl rounded-2xl overflow-hidden",
      getVariantStyles(),
      className
    )}>
      {(title || icon) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {title && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              {subtitle && (
                <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
              )}
            </div>
          )}
          {icon && (
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shadow-glow">
              {icon}
            </div>
          )}
        </CardHeader>
      )}
      
      <CardContent className="pt-0">
        {value && (
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">{value}</div>
            {change && (
              <div className={cn("flex items-center gap-1 text-xs font-medium", getChangeColor())}>
                {changeType === 'positive' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : changeType === 'negative' ? (
                  <TrendingDown className="w-3 h-3" />
                ) : null}
                <span>{change}</span>
              </div>
            )}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}