import { useMemo } from 'react';
import Card from '../components/Card';
import BudgetProgress from '../components/BudgetProgress';
import { getSpendingByCategory } from '../utils/helpers';

export default function Budgets({ data }) {
  const { budgets, categories, transactions } = data;
  
  const spendingByCategory = useMemo(() => 
    getSpendingByCategory(transactions, categories),
    [transactions, categories]
  );
  
  const budgetDetails = useMemo(() => {
    return budgets.map(budget => {
      const spent = spendingByCategory.find(s => s.categoryId === budget.categoryId)?.amount || 0;
      const category = categories.find(c => c.id === budget.categoryId);
      const remaining = budget.limit - spent;
      return {
        ...budget,
        spent,
        remaining,
        categoryName: category?.name || 'Unknown',
        color: category?.color || '#737373',
      };
    });
  }, [budgets, spendingByCategory, categories]);

  return (
    <div className="budgets-page">
      <header className="page-header">
        <h1>Budgets</h1>
      </header>
      
      <div className="budgets-list-full">
        {budgetDetails.map((budget) => (
          <Card key={budget.id} className="budget-item-card">
            <div className="budget-item-header">
              <div className="budget-category-info">
                <div className="category-dot" style={{ backgroundColor: budget.color }} />
                <span className="category-name">{budget.categoryName}</span>
              </div>
              <span className={`budget-status ${budget.remaining < 0 ? 'over' : budget.remaining < budget.limit * 0.15 ? 'near' : 'ok'}`}>
                {budget.remaining < 0 ? 'Over budget' : budget.remaining < budget.limit * 0.15 ? 'Near limit' : 'On track'}
              </span>
            </div>
            
            <BudgetProgress
              category=""
              spent={budget.spent}
              limit={budget.limit}
            />
            
            <div className="budget-footer">
              <span className="budget-remaining">
                {budget.remaining >= 0 
                  ? `₹${budget.remaining.toLocaleString('en-IN')} remaining`
                  : `₹{Math.abs(budget.remaining).toLocaleString('en-IN')} over`}
              </span>
              <span className="budget-limit-text">Monthly limit: ₹{budget.limit.toLocaleString('en-IN')}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
