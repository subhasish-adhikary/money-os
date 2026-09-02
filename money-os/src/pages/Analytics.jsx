import { useMemo } from 'react';
import { format, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Card from '../components/Card';
import { formatCurrency } from '../utils/helpers';

export default function Analytics({ data }) {
  const { transactions, categories } = data;
  
  // Monthly spending trend (last 12 months)
  const spendingTrend = useMemo(() => {
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStr = format(monthDate, 'yyyy-MM');
      
      const monthSpending = transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return t.type === 'expense' && format(tDate, 'yyyy-MM') === monthStr;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      result.push({
        month: format(monthDate, 'MMM yy'),
        spending: monthSpending,
      });
    }
    return result;
  }, [transactions]);
  
  // Category breakdown over time
  const categoryData = useMemo(() => {
    const expenseCategories = categories.filter(c => c.type === 'expense');
    return expenseCategories.slice(0, 6).map(cat => {
      const total = transactions
        .filter(t => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat.name,
        value: total,
        color: cat.color,
      };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>Analytics</h1>
      </header>
      
      <div className="analytics-grid">
        <Card className="spending-trend-chart" padding="p-6">
          <h3 className="section-title">Spending Trend (12 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spending']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="spending" fill="#0d7c4f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="category-breakdown" padding="p-6">
          <h3 className="section-title">Total by Category</h3>
          <div className="category-bars">
            {categoryData.map((cat) => {
              const maxValue = categoryData[0]?.value || 1;
              const widthPercent = (cat.value / maxValue) * 100;
              return (
                <div key={cat.name} className="category-bar-row">
                  <span className="bar-label">{cat.name}</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${widthPercent}%`, backgroundColor: cat.color }} />
                  </div>
                  <span className="bar-value">₹{cat.value.toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
