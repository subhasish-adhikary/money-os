import { useMemo } from 'react';
import { format } from 'date-fns';
import Card from '../components/Card';

export default function Recurring({ data }) {
  const { recurringTransactions, transactions, categories, accounts } = data;
  
  // Get transaction details for each recurring item
  const recurringWithDetails = useMemo(() => {
    return recurringTransactions.map(rec => {
      const transaction = transactions.find(t => t.id === rec.transactionId);
      const category = transaction?.categoryId ? categories.find(c => c.id === transaction.categoryId) : null;
      const account = accounts.find(a => a.id === transaction?.accountId);
      
      return {
        ...rec,
        transaction,
        categoryName: category?.name || 'Unknown',
        categoryColor: category?.color || '#737373',
        accountName: account?.name || 'Unknown',
      };
    });
  }, [recurringTransactions, transactions, categories, accounts]);
  
  // Calculate upcoming this month
  const upcomingThisMonth = useMemo(() => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return recurringWithDetails
      .filter(rec => {
        const nextDate = new Date(rec.nextDate);
        return nextDate <= endOfMonth && nextDate >= now;
      })
      .reduce((total, rec) => total + (rec.transaction?.amount || 0), 0);
  }, [recurringWithDetails]);
  
  return (
    <div className="recurring-page">
      <header className="page-header">
        <h1 className="page-title">Recurring Expenses</h1>
        <p className="page-subtitle">Track your subscriptions and regular payments</p>
      </header>
      
      {/* Upcoming Summary */}
      <Card className="upcoming-summary" padding="p-6">
        <div className="summary-content">
          <span className="summary-label">Upcoming this month</span>
          <span className="summary-value">₹{upcomingThisMonth.toLocaleString('en-IN')}</span>
        </div>
      </Card>
      
      {/* Recurring List */}
      <div className="recurring-grid">
        {recurringWithDetails.map((rec) => (
          <Card key={rec.id} className="recurring-card" padding="p-5">
            <div className="recurring-header">
              <div className="recurring-icon" style={{ backgroundColor: rec.categoryColor }} />
              <div className="recurring-info">
                <h3 className="recurring-merchant">{rec.transaction?.merchant || 'Unknown'}</h3>
                <span className="recurring-category">{rec.categoryName}</span>
              </div>
            </div>
            
            <div className="recurring-details">
              <div className="detail-row">
                <span className="detail-label">Amount</span>
                <span className="detail-value">₹{(rec.transaction?.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Frequency</span>
                <span className="detail-value capitalize">{rec.frequency}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Next Payment</span>
                <span className="detail-value">
                  {format(new Date(rec.nextDate), 'dd MMM yyyy')}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Account</span>
                <span className="detail-value">{rec.accountName}</span>
              </div>
            </div>
            
            {rec.transaction?.recurring && (
              <div className="recurring-badge">Auto-renewing</div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
