import { Home, CreditCard, PieChart, Wallet, Plus } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { id: 'overview', icon: Home },
  { id: 'transactions', icon: CreditCard },
  { id: 'analytics', icon: PieChart },
  { id: 'budgets', icon: Wallet },
];

export default function MobileNav({ currentPage, onNavigate }) {
  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            className={clsx('mobile-nav-item', isActive && 'mobile-nav-item-active')}
            onClick={() => onNavigate(item.id)}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
      <button className="mobile-nav-add" onClick={() => onNavigate('transactions')}>
        <Plus size={24} strokeWidth={2} />
      </button>
    </nav>
  );
}
