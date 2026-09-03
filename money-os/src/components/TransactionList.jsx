import { formatCurrency, formatDate } from '../utils/helpers';
import { clsx } from 'clsx';

export default function TransactionList({ transactions, categories, accounts, limit = 10 }) {
  const getCategoryById = (id) => categories.find(c => c.id === id);
  const getAccountById = (id) => accounts.find(a => a.id === id);

  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="transaction-list">
      {displayedTransactions.map((txn) => {
        const category = getCategoryById(txn.categoryId);
        const account = getAccountById(txn.accountId);
        const isIncome = txn.type === 'income';
        
        return (
          <div key={txn.id} className="transaction-item">
            <div className="transaction-icon" style={{ backgroundColor: `${category?.color}20`, color: category?.color }}>
              {category?.icon?.[0]?.toUpperCase() || 'T'}
            </div>
            <div className="transaction-details">
              <div className="transaction-merchant">{txn.merchant}</div>
              <div className="transaction-meta">
                <span className="transaction-category">{category?.name}</span>
                <span className="transaction-separator">•</span>
                <span className="transaction-date">{formatDate(txn.date, 'short')}</span>
              </div>
            </div>
            <div className={clsx('transaction-amount', isIncome ? 'positive' : 'negative')}>
              {isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
