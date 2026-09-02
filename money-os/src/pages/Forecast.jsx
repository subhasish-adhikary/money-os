import { useMemo } from 'react';
import { format, addDays } from 'date-fns';
import Card from '../components/Card';
import { formatCurrency, calculateNetWorth } from '../utils/helpers';

export default function Forecast({ data }) {
  const { accounts, transactions, recurring } = data;
  
  const netWorth = useMemo(() => calculateNetWorth(accounts), [accounts]);
  const availableCash = useMemo(() => 
    accounts.filter(a => a.type === 'bank' || a.type === 'cash').reduce((sum, a) => sum + a.balance, 0),
    [accounts]
  );
  
  // Calculate upcoming expenses and income
  const upcomingExpenses = useMemo(() => {
    const now = new Date();
    return recurring
      .filter(r => r.type === 'expense')
      .filter(r => new Date(r.nextDate) <= addDays(now, 30))
      .reduce((sum, r) => sum + r.amount, 0);
  }, [recurring]);
  
  const upcomingIncome = useMemo(() => {
    const now = new Date();
    return recurring
      .filter(r => r.type === 'income')
      .filter(r => new Date(r.nextDate) <= addDays(now, 30))
      .reduce((sum, r) => sum + r.amount, 0);
  }, [recurring]);
  
  // Average monthly spending (last 3 months)
  const avgMonthlySpending = useMemo(() => {
    const threeMonthsAgo = addDays(new Date(), -90);
    const recentExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= threeMonthsAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    return recentExpenses / 3;
  }, [transactions]);
  
  // Projections
  const conservativeProjection = availableCash + upcomingIncome - upcomingExpenses - (avgMonthlySpending * 1.1);
  const expectedProjection = availableCash + upcomingIncome - upcomingExpenses - avgMonthlySpending;
  const comfortableProjection = availableCash + upcomingIncome - upcomingExpenses - (avgMonthlySpending * 0.85);
  
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dayOfMonth = new Date().getDate();
  const dailyAvgSpending = avgMonthlySpending / 30;
  const remainingDays = daysInMonth - dayOfMonth;

  return (
    <div className="forecast-page">
      <header className="page-header">
        <h1>Forecast</h1>
      </header>
      
      <Card className="forecast-main" padding="p-6">
        <div className="forecast-header">
          <h2 className="forecast-title">End-of-month forecast</h2>
          <p className="forecast-subtitle">Based on your current spending patterns</p>
        </div>
        
        <div className="forecast-scenarios">
          <div className="scenario-card conservative">
            <span className="scenario-label">Conservative</span>
            <span className="scenario-value">{formatCurrency(Math.max(0, conservativeProjection))}</span>
            <span className="scenario-desc">Higher spending (+10%)</span>
          </div>
          
          <div className="scenario-card expected active">
            <span className="scenario-label">Expected</span>
            <span className="scenario-value">{formatCurrency(Math.max(0, expectedProjection))}</span>
            <span className="scenario-desc">Normal patterns</span>
          </div>
          
          <div className="scenario-card comfortable">
            <span className="scenario-label">Comfortable</span>
            <span className="scenario-value">{formatCurrency(Math.max(0, comfortableProjection))}</span>
            <span className="scenario-desc">Lower spending (-15%)</span>
          </div>
        </div>
      </Card>
      
      <div className="forecast-details-grid">
        <Card className="forecast-detail" padding="p-6">
          <h3 className="detail-title">Current Balance</h3>
          <div className="detail-value">{formatCurrency(availableCash)}</div>
          <p className="detail-subtitle">Across bank accounts</p>
        </Card>
        
        <Card className="forecast-detail" padding="p-6">
          <h3 className="detail-title">Upcoming Income (30 days)</h3>
          <div className="detail-value positive">{formatCurrency(upcomingIncome)}</div>
          <p className="detail-subtitle">Salary & other income</p>
        </Card>
        
        <Card className="forecast-detail" padding="p-6">
          <h3 className="detail-title">Upcoming Expenses (30 days)</h3>
          <div className="detail-value negative">{formatCurrency(upcomingExpenses)}</div>
          <p className="detail-subtitle">Recurring bills & subscriptions</p>
        </Card>
        
        <Card className="forecast-detail" padding="p-6">
          <h3 className="detail-title">Daily Avg Spending</h3>
          <div className="detail-value">{formatCurrency(dailyAvgSpending)}</div>
          <p className="detail-subtitle">Based on last 3 months</p>
        </Card>
      </div>
      
      <Card className="forecast-breakdown" padding="p-6">
        <h3 className="section-title">This Month's Timeline</h3>
        <div className="timeline">
          <div className="timeline-item completed">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <span className="timeline-date">Start of month</span>
              <span className="timeline-desc">Month began</span>
            </div>
          </div>
          
          {recurring.slice(0, 5).map((item, index) => (
            <div key={item.id} className={`timeline-item ${new Date(item.nextDate) < new Date() ? 'completed' : 'upcoming'}`}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <span className="timeline-date">{format(new Date(item.nextDate), 'MMM d')}</span>
                <span className="timeline-desc">{item.name} - {formatCurrency(item.amount)}</span>
              </div>
            </div>
          ))}
          
          <div className="timeline-item future">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <span className="timeline-date">End of month</span>
              <span className="timeline-desc">Projected: {formatCurrency(expectedProjection)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
