import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, change, changeType = 'neutral', subtitle }) {
  const getChangeIcon = () => {
    if (changeType === 'positive') return <TrendingUp size={16} className="text-green" />;
    if (changeType === 'negative') return <TrendingDown size={16} className="text-red" />;
    return <Minus size={16} className="text-muted" />;
  };

  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {change !== undefined && (
          <div className={clsx('stat-change', changeType)}>
            {getChangeIcon()}
            <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );
}
