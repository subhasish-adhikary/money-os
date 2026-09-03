import Card from '../components/Card';
import GoalCard from '../components/GoalCard';
import { formatCurrency } from '../utils/helpers';

export default function Goals({ data }) {
  const { goals } = data;
  
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

  return (
    <div className="goals-page">
      <header className="page-header">
        <h1>Goals</h1>
      </header>
      
      <Card className="goals-summary" padding="p-6">
        <div className="summary-metric">
          <span className="summary-label">Total Saved Towards Goals</span>
          <span className="summary-value">{formatCurrency(totalSaved)}</span>
          <span className="summary-subtitle">of {formatCurrency(totalTarget)} target</span>
        </div>
        <div className="summary-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="progress-percent">{overallProgress.toFixed(0)}% overall progress</span>
        </div>
      </Card>
      
      <div className="goals-grid">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
