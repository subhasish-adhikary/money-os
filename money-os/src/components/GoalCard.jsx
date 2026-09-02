import { formatCurrency } from '../utils/helpers';
import { clsx } from 'clsx';

export default function GoalCard({ goal }) {
  const percentComplete = (goal.currentAmount / goal.targetAmount) * 100;
  
  return (
    <div className="goal-card" style={{ borderLeftColor: goal.color }}>
      <div className="goal-header">
        <h4 className="goal-name">{goal.name}</h4>
        <span className={clsx('goal-priority', goal.priority)}>
          {goal.priority}
        </span>
      </div>
      <div className="goal-amounts">
        <span className="goal-current">{formatCurrency(goal.currentAmount)}</span>
        <span className="goal-target">of {formatCurrency(goal.targetAmount)}</span>
      </div>
      <div className="goal-bar">
        <div 
          className="goal-fill" 
          style={{ 
            width: `${percentComplete}%`,
            backgroundColor: goal.color
          }} 
        />
      </div>
      <div className="goal-footer">
        <span className="goal-percent">{percentComplete.toFixed(0)}% complete</span>
        <span className="goal-monthly">₹{goal.monthlyContribution.toLocaleString('en-IN')}/month</span>
      </div>
    </div>
  );
}
