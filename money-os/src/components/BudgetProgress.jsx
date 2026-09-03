import { clsx } from 'clsx';

export default function BudgetProgress({ category, spent, limit }) {
  const percentUsed = Math.min((spent / limit) * 100, 100);
  const isOverBudget = spent > limit;
  const isNearLimit = percentUsed > 85 && !isOverBudget;
  
  const getStatusColor = () => {
    if (isOverBudget) return '#dc2626';
    if (isNearLimit) return '#f59e0b';
    return '#0d7c4f';
  };

  return (
    <div className="budget-progress">
      <div className="budget-header">
        <span className="budget-category">{category}</span>
        <span className={clsx('budget-status', isOverBudget ? 'over' : isNearLimit ? 'near' : 'ok')}>
          {isOverBudget ? 'Over budget' : isNearLimit ? 'Near limit' : 'On track'}
        </span>
      </div>
      <div className="budget-amounts">
        <span className="budget-spent">₹{spent.toLocaleString('en-IN')}</span>
        <span className="budget-limit">/ ₹{limit.toLocaleString('en-IN')}</span>
      </div>
      <div className="budget-bar">
        <div 
          className="budget-fill" 
          style={{ 
            width: `${percentUsed}%`,
            backgroundColor: getStatusColor()
          }} 
        />
      </div>
      <div className="budget-percent">{percentUsed.toFixed(0)}%</div>
    </div>
  );
}
