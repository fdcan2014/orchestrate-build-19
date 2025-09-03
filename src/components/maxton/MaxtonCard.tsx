import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  variant = 'default'
}: MaxtonCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-md hover:shadow-lg';
      case 'outlined':
        return 'bg-white border-2 border-gray-200 hover:border-blue-300';
      default:
        return 'bg-white border border-gray-200 shadow-sm hover:shadow-md';
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:scale-[1.02]",
      getVariantStyles(),
      className
    )}>
      {(title || icon) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {title && (
            <div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          )}
          {icon && (
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
              {icon}
            </div>
          )}
        </CardHeader>
      )}
      
      <CardContent className="pt-0">
        {value && (
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {change && (
              <p className={cn("text-xs font-medium", getChangeColor())}>
                {change}
              </p>
            )}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}