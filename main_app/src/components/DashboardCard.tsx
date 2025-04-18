
import React from 'react';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface DashboardCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

const DashboardCard = ({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  color = 'default'
}: DashboardCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'warning':
        return 'text-amber-400 bg-amber-400/10';
      case 'danger':
        return 'text-rose-400 bg-rose-400/10';
      default:
        return 'text-ocean bg-ocean/10';
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-foreground/50';
    return trend > 0 ? 'text-emerald-400' : 'text-rose-400';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 ? '↑' : '↓';
  };

  return (
    <div className="glass-container rounded-xl p-6 hover-card h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground/70 mb-1">{title}</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">
              <AnimatedCounter value={value} />
            </span>
            {unit && <span className="ml-1 text-foreground/70">{unit}</span>}
          </div>
        </div>
        <div className={`p-2 rounded-lg ${getColorClasses()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center mt-2">
          <span className={`text-sm ${getTrendColor()} font-medium`}>
            {getTrendIcon()} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-foreground/50 ml-1">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
