import { Home, CreditCard, PieChart, Wallet, TrendingUp, Target, Repeat, Building, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'budgets', label: 'Budgets', icon: Wallet },
  { id: 'forecast', label: 'Forecast', icon: TrendingUp },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'recurring', label: 'Recurring', icon: Repeat },
  { id: 'accounts', label: 'Accounts', icon: Building },
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onToggle }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={clsx('sidebar', !isOpen && 'sidebar-closed')}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">Money OS</span>
          </div>
          <button className="sidebar-toggle" onClick={onToggle}>
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                className={clsx('nav-item', isActive && 'nav-item-active')}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={18} strokeWidth={2} />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <button
            className={clsx('nav-item')}
            onClick={() => onNavigate('settings')}
          >
            <SettingsIcon size={18} strokeWidth={2} />
            {isOpen && <span>Settings</span>}
          </button>
          
          {isOpen && (
            <div className="user-info">
              <div className="user-avatar">S</div>
              <div className="user-details">
                <span className="user-name">Subh</span>
                <span className="user-email">subh@example.com</span>
              </div>
            </div>
          )}
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  );
}
