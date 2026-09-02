import { formatCurrency } from '../utils/helpers';
import { clsx } from 'clsx';

const accountIcons = {
  bank: '🏦',
  credit: '💳',
  investment: '📈',
  loan: '📋',
  cash: '💵',
};

export default function AccountCard({ account }) {
  const isNegative = account.balance < 0;
  
  return (
    <div className={clsx('account-card', isNegative && 'negative')}>
      <div className="account-icon" style={{ backgroundColor: `${account.color}15` }}>
        {accountIcons[account.type] || '🏦'}
      </div>
      <div className="account-info">
        <h4 className="account-name">{account.name}</h4>
        <p className="account-institution">{account.institution || account.type}</p>
      </div>
      <div className={clsx('account-balance', isNegative && 'negative')}>
        {formatCurrency(account.balance)}
      </div>
    </div>
  );
}
