import { useMemo } from 'react';
import { format, subDays, startOfMonth } from 'date-fns';
import { getGreeting, formatCurrency, calculateNetWorth, getAvailableCash, calculateMonthlyTotals, getSpendingByCategory, generateInsights } from '../utils/helpers';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import CashFlowChart from '../components/CashFlowChart';
import SpendingDonut from '../components/SpendingDonut';
import TransactionList from '../components/TransactionList';
import InsightCard from '../components/InsightCard';
import BudgetProgress from '../components/BudgetProgress';

export default function Overview({ data }) {
  const { user, accounts, transactions, categories, budgets } = data;
  
  // Calculate key metrics
  const netWorth = useMemo(() => calculateNetWorth(accounts), [accounts]);
  const availableCash = useMemo(() => getAvailableCash(accounts), [accounts]);
  
  // Current month calculations
  const currentMonthStart = startOfMonth(new Date());
  const lastMonthStart = startOfMonth(subDays(currentMonthStart, 1));
  
  const currentMonthIncome = useMemo(() => 
    calculateMonthlyTotals(transactions, 'income', 1),
    [transactions]
  );
  
  const currentMonthExpenses = useMemo(() => 
    calculateMonthlyTotals(transactions, 'expense', 1),
    [transactions]
  );
  
  const lastMonthExpenses = useMemo(() => 
    transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' && tDate >= lastMonthStart && tDate < currentMonthStart;
      })
      .reduce((total, t) => total + t.amount, 0),
    [transactions, lastMonthStart, currentMonthStart]
  );
  
  const savingsThisMonth = currentMonthIncome - currentMonthExpenses;
  const expenseChangePercent = lastMonthExpenses > 0 
    ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
    : 0;
  
  // Net worth change (simplified - comparing to 30 days ago)
  const netWorthChange = 2.4; // Would be calculated from historical snapshots
  
  // Cash flow data for chart
  const cashFlowData = useMemo(() => {
    const days = 30;
    const result = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dayTransactions = transactions.filter(t => t.date === date);
      
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      result.push({
        date,
        income,
        expenses,
        savings: income - expenses,
      });
    }
    
    return result;
  }, [transactions]);
  
  // Spending by category
  const spendingByCategory = useMemo(() => 
    getSpendingByCategory(transactions, categories),
    [transactions, categories]
  );
  
  // Prepare donut data
  const donutData = spendingByCategory.slice(0, 6).map(s => ({
    name: s.categoryName.length > 12 ? s.categoryName.substring(0, 12) + '...' : s.categoryName,
    value: s.amount,
    color: s.color,
    percent: (s.amount / currentMonthExpenses) * 100,
  }));
  
  // Generate insights
  const insights = useMemo(() => 
    generateInsights(transactions, budgets, categories),
    [transactions, budgets, categories]
  );
  
  // Recent transactions
  const recentTransactions = useMemo(() => 
    transactions.slice(0, 8),
    [transactions]
  );
  
  // Budget progress
  const budgetProgress = useMemo(() => {
    return budgets.map(budget => {
      const spent = spendingByCategory.find(s => s.categoryId === budget.categoryId)?.amount || 0;
      const category = categories.find(c => c.id === budget.categoryId);
      return {
        ...budget,
        spent,
        categoryName: category?.name || 'Unknown',
      };
    });
  }, [budgets, spendingByCategory, categories]);

  return (
    <div className="overview-page">
      <header className="page-header">
        <div>
          <h1 className="greeting">{getGreeting()}, {user.name}</h1>
          <p className="date-subtitle">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </header>
      
      {/* Key Metrics */}
      <section className="metrics-grid">
        <Card className="metric-card net-worth">
          <div className="metric-label">Net Worth</div>
          <div className="metric-value">{formatCurrency(netWorth)}</div>
          <div className={`metric-change ${netWorthChange >= 0 ? 'positive' : 'negative'}`}>
            {netWorthChange >= 0 ? '+' : ''}{netWorthChange}% this month
          </div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-label">Available Cash</div>
          <div className="metric-value">{formatCurrency(availableCash)}</div>
          <div className="metric-subtext">Across bank accounts</div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-label">Monthly Income</div>
          <div className="metric-value">{formatCurrency(currentMonthIncome)}</div>
          <div className="metric-subtext">Year to date</div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-label">Monthly Spending</div>
          <div className={`metric-value ${expenseChangePercent > 0 ? 'warning' : ''}`}>
            {formatCurrency(currentMonthExpenses)}
          </div>
          <div className={`metric-change ${expenseChangePercent <= 0 ? 'positive' : 'negative'}`}>
            {expenseChangePercent >= 0 ? '+' : ''}{expenseChangePercent.toFixed(1)}% vs last month
          </div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-label">Saved This Month</div>
          <div className={`metric-value ${savingsThisMonth >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(savingsThisMonth)}
          </div>
          <div className="metric-subtext">
            {currentMonthIncome > 0 ? ((savingsThisMonth / currentMonthIncome) * 100).toFixed(1) : 0}% savings rate
          </div>
        </Card>
      </section>
      
      {/* Main Content Grid */}
      <div className="overview-grid">
        {/* Cash Flow Chart */}
        <Card className="cashflow-section" padding="p-6">
          <div className="section-header">
            <h3 className="section-title">Income vs Spending</h3>
            <div className="time-range-selector">
              <button className="range-btn active">30D</button>
              <button className="range-btn">3M</button>
              <button className="range-btn">6M</button>
            </div>
          </div>
          <CashFlowChart data={cashFlowData} timeRange="30D" />
          <div className="cashflow-insight">
            {expenseChangePercent <= 0 ? (
              <>
                <span className="insight-icon positive">✓</span>
                <span>You spent ₹{(lastMonthExpenses - currentMonthExpenses).toLocaleString('en-IN')} less than last month</span>
              </>
            ) : (
              <>
                <span className="insight-icon warning">!</span>
                <span>Spending is up ₹{(currentMonthExpenses - lastMonthExpenses).toLocaleString('en-IN')} compared to last month</span>
              </>
            )}
          </div>
        </Card>
        
        {/* Spending Breakdown */}
        <Card className="spending-section" padding="p-6">
          <div className="section-header">
            <h3 className="section-title">Spending Breakdown</h3>
          </div>
          <div className="spending-content">
            <div className="donut-wrapper">
              <SpendingDonut data={donutData} />
            </div>
            <div className="category-list">
              {spendingByCategory.slice(0, 5).map((category) => (
                <div key={category.categoryId} className="category-item">
                  <div className="category-dot" style={{ backgroundColor: category.color }} />
                  <div className="category-info">
                    <span className="category-name">{category.categoryName}</span>
                    <span className="category-amount">₹{category.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="category-percent">
                    {((category.amount / currentMonthExpenses) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        {/* Money OS Insights */}
        <Card className="insights-section" padding="p-6">
          <div className="section-header">
            <h3 className="section-title">Money OS Insights</h3>
          </div>
          <div className="insights-list">
            {insights.slice(0, 4).map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
            {insights.length === 0 && (
              <div className="no-insights">
                <p>Your finances look healthy this month.</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* What Changed */}
        <Card className="changes-section" padding="p-6">
          <div className="section-header">
            <h3 className="section-title">What Changed</h3>
          </div>
          <div className="changes-list">
            <div className="change-item">
              <span className="change-indicator positive"></span>
              <span>Savings rate increased to {((savingsThisMonth / currentMonthIncome) * 100).toFixed(0)}%</span>
            </div>
            <div className="change-item">
              <span className="change-indicator neutral"></span>
              <span>Rent remains your largest expense at ₹28,000</span>
            </div>
            <div className="change-item">
              <span className="change-indicator warning"></span>
              <span>Transport spending below your monthly average</span>
            </div>
            <div className="change-item">
              <span className="change-indicator neutral"></span>
              <span>3 subscriptions renewed this month</span>
            </div>
          </div>
        </Card>
        
        {/* Budget Progress */}
        <Card className="budgets-section" padding="p-6">
          <div className="section-header">
            <h3 className="section-title">Budget Progress</h3>
          </div>
          <div className="budgets-list">
            {budgetProgress.slice(0, 4).map((budget) => (
              <BudgetProgress
                key={budget.id}
                category={budget.categoryName}
                spent={budget.spent}
                limit={budget.limit}
              />
            ))}
          </div>
        </Card>
        
        {/* Recent Transactions */}
        <Card className="transactions-section" padding="p-6">
          <div className="section-header justify-between">
            <h3 className="section-title">Recent Transactions</h3>
          </div>
          <TransactionList 
            transactions={recentTransactions} 
            categories={categories}
            accounts={accounts}
          />
        </Card>
      </div>
    </div>
  );
}
