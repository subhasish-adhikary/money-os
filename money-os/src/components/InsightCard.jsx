import { AlertTriangle, Info, TrendingUp, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

export default function InsightCard({ insight }) {
  const getIcon = () => {
    switch (insight.type) {
      case 'alert':
        return <AlertTriangle size={18} className="text-red" />;
      case 'warning':
        return <TrendingUp size={18} className="text-amber" />;
      case 'success':
        return <CheckCircle size={18} className="text-green" />;
      default:
        return <Info size={18} className="text-muted" />;
    }
  };

  return (
    <div className={clsx('insight-card', insight.type)}>
      <div className="insight-icon">{getIcon()}</div>
      <div className="insight-content">
        <h4 className="insight-title">{insight.title}</h4>
        <p className="insight-description">{insight.description}</p>
      </div>
    </div>
  );
}
