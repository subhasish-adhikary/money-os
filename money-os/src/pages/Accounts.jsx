import { useMemo } from 'react';
import { formatCurrency, calculateNetWorth } from '../utils/helpers';
import Card from '../components/Card';
import AccountCard from '../components/AccountCard';

export default function Accounts({ data }) {
  const { accounts } = data;
  
  // Group accounts by type
  const accountsByType = useMemo(() => {
    return accounts.reduce((groups, account) => {
      if (!groups[account.type]) {
        groups[account.type] = [];
      }
      groups[account.type].push(account);
      return groups;
    }, {});
  }, [accounts]);
  
  // Calculate totals by type
  const totalsByType = useMemo(() => {
    const totals = {};
    Object.entries(accountsByType).forEach(([type, accs]) => {
      totals[type] = accs.reduce((sum, acc) => sum + acc.balance, 0);
    });
    return totals;
  }, [accountsByType]);
  
  const netWorth = calculateNetWorth(accounts);
  
  const accountTypes = [
    { key: 'bank', label: 'Bank Accounts', icon: '🏦' },
    { key: 'credit', label: 'Credit Cards', icon: '💳' },
    { key: 'investment', label: 'Investments', icon: '📈' },
    { key: 'loan', label: 'Loans', icon: '🏠' },
    { key: 'cash', label: 'Cash', icon: '💵' },
  ];
  
  return (
    <div className="accounts-page">
      <header className="page-header">
        <h1 className="page-title">Accounts</h1>
        <p className="page-subtitle">Track all your financial accounts in one place</p>
      </header>
      
      {/* Net Worth Summary */}
      <Card className="net-worth-summary" padding="p-6">
        <div className="summary-content">
          <span className="summary-label">Total Net Worth</span>
          <span className={`summary-value ${netWorth >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(netWorth)}
          </span>
        </div>
      </Card>
      
      {/* Accounts by Type */}
      <div className="accounts-grid">
        {accountTypes.map(({ key, label, icon }) => {
          const typeAccounts = accountsByType[key] || [];
          const typeTotal = totalsByType[key] || 0;
          
          if (typeAccounts.length === 0) return null;
          
          return (
            <Card key={key} className="account-type-section" padding="p-5">
              <div className="account-type-header">
                <h3 className="account-type-title">
                  <span className="type-icon">{icon}</span>
                  {label}
                </h3>
                <span className={`account-type-total ${typeTotal >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(typeTotal)}
                </span>
              </div>
              
              <div className="account-list">
                {typeAccounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
