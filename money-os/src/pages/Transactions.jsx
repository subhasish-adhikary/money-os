import { useState, useMemo } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Transactions({ data }) {
  const { transactions, categories, accounts } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const getCategoryById = (id) => categories.find(c => c.id === id);
  
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = txn.merchant.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || txn.type === filterType;
      const matchesCategory = selectedCategory === 'all' || txn.categoryId === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, filterType, selectedCategory]);

  return (
    <div className="transactions-page">
      <header className="page-header">
        <h1>Transactions</h1>
        <Button variant="primary" onClick={() => {}}>
          <Plus size={18} />
          Add Transaction
        </Button>
      </header>
      
      <Card className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </Card>
      
      <Card className="transactions-list-card" padding="no-border">
        <div className="transactions-table">
          <div className="table-header">
            <span>Transaction</span>
            <span>Category</span>
            <span>Date</span>
            <span>Account</span>
            <span className="text-right">Amount</span>
          </div>
          
          {filteredTransactions.slice(0, 50).map((txn) => {
            const category = getCategoryById(txn.categoryId);
            const account = accounts.find(a => a.id === txn.accountId);
            const isIncome = txn.type === 'income';
            
            return (
              <div key={txn.id} className="table-row">
                <div className="row-merchant">
                  <div className="merchant-icon" style={{ backgroundColor: `${category?.color}20`, color: category?.color }}>
                    {category?.icon?.[0]?.toUpperCase() || 'T'}
                  </div>
                  <div>
                    <div className="merchant-name">{txn.merchant}</div>
                    {txn.notes && <div className="merchant-notes">{txn.notes}</div>}
                  </div>
                </div>
                <span className="row-category">{category?.name}</span>
                <span className="row-date">{formatDate(txn.date, 'short')}</span>
                <span className="row-account">{account?.name}</span>
                <span className={`row-amount ${isIncome ? 'positive' : 'negative'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
