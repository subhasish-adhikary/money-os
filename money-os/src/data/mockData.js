import { subDays, format } from 'date-fns';

// Category definitions with colors
const categories = [
  { id: 'cat-1', name: 'Rent & Housing', color: '#166534', icon: 'home' },
  { id: 'cat-2', name: 'Food & Dining', color: '#dc2626', icon: 'restaurant' },
  { id: 'cat-3', name: 'Transport', color: '#2563eb', icon: 'directions-car' },
  { id: 'cat-4', name: 'Shopping', color: '#9333ea', icon: 'shopping-bag' },
  { id: 'cat-5', name: 'Entertainment', color: '#f59e0b', icon: 'movie' },
  { id: 'cat-6', name: 'Bills & Utilities', color: '#0891b2', icon: 'receipt' },
  { id: 'cat-7', name: 'Health', color: '#ec4899', icon: 'favorite' },
  { id: 'cat-8', name: 'Travel', color: '#06b6d4', icon: 'flight' },
  { id: 'cat-9', name: 'Investments', color: '#10b981', icon: 'trending-up' },
  { id: 'cat-10', name: 'Other', color: '#6b7280', icon: 'more-horiz' },
];

// User profile
const user = {
  id: 'user-1',
  name: 'Subh',
  email: 'subh@example.com',
  currency: 'INR',
  locale: 'en-IN',
};

// Accounts
const accounts = [
  { id: 'acc-1', name: 'HDFC Savings', type: 'bank', balance: 84320, institution: 'HDFC Bank', lastFour: '4521' },
  { id: 'acc-2', name: 'ICICI Credit Card', type: 'credit', balance: -18420, institution: 'ICICI Bank', lastFour: '8832', creditLimit: 200000 },
  { id: 'acc-3', name: 'SBI Salary Account', type: 'bank', balance: 42150, institution: 'State Bank of India', lastFour: '7721' },
  { id: 'acc-4', name: 'Mutual Funds', type: 'investment', balance: 284600, institution: 'Zerodha Coin', lastFour: null },
  { id: 'acc-5', name: 'Personal Loan', type: 'loan', balance: -342000, institution: 'HDFC Bank', lastFour: '3344' },
  { id: 'acc-6', name: 'Cash', type: 'cash', balance: 5000, institution: null, lastFour: null },
  { id: 'acc-7', name: 'Emergency Fund', type: 'investment', balance: 156000, institution: 'Axis Bank FD', lastFour: '9921' },
];

// Generate transactions over the last 60 days
const generateTransactions = () => {
  const transactions = [];
  const today = new Date();
  
  // Regular income (salary on 1st of each month)
  const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  
  transactions.push({
    id: 'txn-income-1',
    type: 'income',
    amount: 85000,
    categoryId: null,
    accountId: 'acc-3',
    merchant: 'Tech Solutions Pvt Ltd',
    date: format(firstOfThisMonth, 'yyyy-MM-dd'),
    notes: 'Monthly salary',
    recurring: true,
  });
  
  transactions.push({
    id: 'txn-income-2',
    type: 'income',
    amount: 85000,
    categoryId: null,
    accountId: 'acc-3',
    merchant: 'Tech Solutions Pvt Ltd',
    date: format(firstOfLastMonth, 'yyyy-MM-dd'),
    notes: 'Monthly salary',
    recurring: true,
  });
  
  // Rent payment (1st of each month)
  transactions.push({
    id: 'txn-rent-1',
    type: 'expense',
    amount: 28000,
    categoryId: 'cat-1',
    accountId: 'acc-1',
    merchant: 'Property Management Co',
    date: format(firstOfThisMonth, 'yyyy-MM-dd'),
    notes: 'Monthly rent',
    recurring: true,
  });
  
  transactions.push({
    id: 'txn-rent-2',
    type: 'expense',
    amount: 28000,
    categoryId: 'cat-1',
    accountId: 'acc-1',
    merchant: 'Property Management Co',
    date: format(firstOfLastMonth, 'yyyy-MM-dd'),
    notes: 'Monthly rent',
    recurring: true,
  });
  
  // Personal loan EMI (5th of each month)
  const fifthOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 5);
  const fifthOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 5);
  
  transactions.push({
    id: 'txn-emi-1',
    type: 'expense',
    amount: 15420,
    categoryId: 'cat-10',
    accountId: 'acc-1',
    merchant: 'HDFC Bank',
    date: format(fifthOfThisMonth, 'yyyy-MM-dd'),
    notes: 'Personal loan EMI',
    recurring: true,
  });
  
  transactions.push({
    id: 'txn-emi-2',
    type: 'expense',
    amount: 15420,
    categoryId: 'cat-10',
    accountId: 'acc-1',
    merchant: 'HDFC Bank',
    date: format(fifthOfLastMonth, 'yyyy-MM-dd'),
    notes: 'Personal loan EMI',
    recurring: true,
  });
  
  // Recurring subscriptions
  const subscriptions = [
    { id: 'txn-sub-netflix', merchant: 'Netflix', amount: 649, categoryId: 'cat-5', day: 10 },
    { id: 'txn-sub-spotify', merchant: 'Spotify Premium', amount: 119, categoryId: 'cat-5', day: 15 },
    { id: 'txn-sub-prime', merchant: 'Amazon Prime', amount: 1499, categoryId: 'cat-5', day: 8 },
    { id: 'txn-sub-jio', merchant: 'Jio Postpaid', amount: 399, categoryId: 'cat-6', day: 12 },
  ];
  
  subscriptions.forEach((sub, idx) => {
    const subDateThisMonth = new Date(today.getFullYear(), today.getMonth(), sub.day);
    const subDateLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, sub.day);
    
    transactions.push({
      id: `${sub.id}-1`,
      type: 'expense',
      amount: sub.amount,
      categoryId: sub.categoryId,
      accountId: 'acc-2',
      merchant: sub.merchant,
      date: format(subDateThisMonth, 'yyyy-MM-dd'),
      notes: 'Subscription renewal',
      recurring: true,
    });
    
    transactions.push({
      id: `${sub.id}-2`,
      type: 'expense',
      amount: sub.amount,
      categoryId: sub.categoryId,
      accountId: 'acc-2',
      merchant: sub.merchant,
      date: format(subDateLastMonth, 'yyyy-MM-dd'),
      notes: 'Subscription renewal',
      recurring: true,
    });
  });
  
  // Food & Dining transactions (multiple per week)
  const foodMerchants = ['Swiggy', 'Zomato', 'Starbucks', 'McDonald\'s', 'Biryani Blues', 'Theobroma', 'CCD'];
  for (let i = 0; i < 25; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const date = subDays(today, daysAgo);
    const amount = Math.floor(Math.random() * 800) + 150;
    
    transactions.push({
      id: `txn-food-${i}`,
      type: 'expense',
      amount,
      categoryId: 'cat-2',
      accountId: Math.random() > 0.3 ? 'acc-2' : 'acc-1',
      merchant: foodMerchants[Math.floor(Math.random() * foodMerchants.length)],
      date: format(date, 'yyyy-MM-dd'),
      notes: '',
      recurring: false,
    });
  }
  
  // Transport transactions
  const transportMerchants = ['Uber', 'Ola', 'Metro Rail', 'Fuel Station', 'Rapido'];
  for (let i = 0; i < 18; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const date = subDays(today, daysAgo);
    const amount = Math.floor(Math.random() * 500) + 50;
    
    transactions.push({
      id: `txn-transport-${i}`,
      type: 'expense',
      amount,
      categoryId: 'cat-3',
      accountId: Math.random() > 0.3 ? 'acc-2' : 'acc-1',
      merchant: transportMerchants[Math.floor(Math.random() * transportMerchants.length)],
      date: format(date, 'yyyy-MM-dd'),
      notes: '',
      recurring: false,
    });
  }
  
  // Shopping transactions
  const shoppingMerchants = ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Reliance Trends', 'Westside'];
  for (let i = 0; i < 12; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const date = subDays(today, daysAgo);
    const amount = Math.floor(Math.random() * 3000) + 500;
    
    transactions.push({
      id: `txn-shopping-${i}`,
      type: 'expense',
      amount,
      categoryId: 'cat-4',
      accountId: 'acc-2',
      merchant: shoppingMerchants[Math.floor(Math.random() * shoppingMerchants.length)],
      date: format(date, 'yyyy-MM-dd'),
      notes: '',
      recurring: false,
    });
  }
  
  // Entertainment
  const entertainmentMerchants = ['PVR Cinemas', 'BookMyShow', 'INOX', 'PlayStation Store', 'Steam'];
  for (let i = 0; i < 8; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const date = subDays(today, daysAgo);
    const amount = Math.floor(Math.random() * 1500) + 300;
    
    transactions.push({
      id: `txn-ent-${i}`,
      type: 'expense',
      amount,
      categoryId: 'cat-5',
      accountId: 'acc-2',
      merchant: entertainmentMerchants[Math.floor(Math.random() * entertainmentMerchants.length)],
      date: format(date, 'yyyy-MM-dd'),
      notes: '',
      recurring: false,
    });
  }
  
  // Bills & Utilities
  const billMerchants = ['Electricity Board', 'Gas Company', 'Water Supply', 'Internet Provider'];
  const billAmounts = [1250, 850, 450, 999];
  for (let i = 0; i < 4; i++) {
    const daysAgo = Math.floor(Math.random() * 30) + 5;
    const date = subDays(today, daysAgo);
    
    transactions.push({
      id: `txn-bill-${i}`,
      type: 'expense',
      amount: billAmounts[i],
      categoryId: 'cat-6',
      accountId: 'acc-1',
      merchant: billMerchants[i],
      date: format(date, 'yyyy-MM-dd'),
      notes: 'Monthly utility bill',
      recurring: true,
    });
  }
  
  // Health expenses
  const healthMerchants = ['Apollo Pharmacy', 'MedPlus', 'Practo Consultation', 'Gym Membership'];
  for (let i = 0; i < 6; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const date = subDays(today, daysAgo);
    const amount = Math.floor(Math.random() * 2000) + 200;
    
    transactions.push({
      id: `txn-health-${i}`,
      type: 'expense',
      amount,
      categoryId: 'cat-7',
      accountId: 'acc-1',
      merchant: healthMerchants[Math.floor(Math.random() * healthMerchants.length)],
      date: format(date, 'yyyy-MM-dd'),
      notes: '',
      recurring: false,
    });
  }
  
  // Investment SIP
  transactions.push({
    id: 'txn-sip-1',
    type: 'expense',
    amount: 25000,
    categoryId: 'cat-9',
    accountId: 'acc-1',
    merchant: 'Zerodha Coin',
    date: format(firstOfThisMonth, 'yyyy-MM-dd'),
    notes: 'Monthly SIP',
    recurring: true,
  });
  
  transactions.push({
    id: 'txn-sip-2',
    type: 'expense',
    amount: 25000,
    categoryId: 'cat-9',
    accountId: 'acc-1',
    merchant: 'Zerodha Coin',
    date: format(firstOfLastMonth, 'yyyy-MM-dd'),
    notes: 'Monthly SIP',
    recurring: true,
  });
  
  // Miscellaneous transactions
  const otherMerchants = ['Big Bazaar', 'DMart', 'Local Store', 'Online Transfer'];
  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const date = subDays(today, daysAgo);
    const amount = Math.floor(Math.random() * 1500) + 100;
    
    transactions.push({
      id: `txn-other-${i}`,
      type: 'expense',
      amount,
      categoryId: 'cat-10',
      accountId: 'acc-1',
      merchant: otherMerchants[Math.floor(Math.random() * otherMerchants.length)],
      date: format(date, 'yyyy-MM-dd'),
      notes: '',
      recurring: false,
    });
  }
  
  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const transactions = generateTransactions();

// Budgets
const budgets = [
  { id: 'budget-1', categoryId: 'cat-2', limit: 10000, period: 'monthly' },
  { id: 'budget-2', categoryId: 'cat-3', limit: 5000, period: 'monthly' },
  { id: 'budget-3', categoryId: 'cat-4', limit: 8000, period: 'monthly' },
  { id: 'budget-4', categoryId: 'cat-5', limit: 5000, period: 'monthly' },
  { id: 'budget-5', categoryId: 'cat-7', limit: 3000, period: 'monthly' },
];

// Goals
const goals = [
  { 
    id: 'goal-1', 
    name: 'Emergency Fund', 
    targetAmount: 200000, 
    currentAmount: 120000, 
    targetDate: '2026-06-01',
    monthlyContribution: 10000,
    priority: 'high',
  },
  { 
    id: 'goal-2', 
    name: 'New Laptop', 
    targetAmount: 100000, 
    currentAmount: 45000, 
    targetDate: '2026-03-01',
    monthlyContribution: 8000,
    priority: 'medium',
  },
  { 
    id: 'goal-3', 
    name: 'Vacation to Japan', 
    targetAmount: 150000, 
    currentAmount: 28000, 
    targetDate: '2027-01-01',
    monthlyContribution: 5000,
    priority: 'low',
  },
  { 
    id: 'goal-4', 
    name: 'Car Down Payment', 
    targetAmount: 300000, 
    currentAmount: 85000, 
    targetDate: '2027-06-01',
    monthlyContribution: 12000,
    priority: 'medium',
  },
];

// Recurring transactions
const recurringTransactions = [
  { id: 'rec-1', transactionId: 'txn-rent-1', frequency: 'monthly', nextDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), 'yyyy-MM-dd') },
  { id: 'rec-2', transactionId: 'txn-emi-1', frequency: 'monthly', nextDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 5), 'yyyy-MM-dd') },
  { id: 'rec-3', transactionId: 'txn-sub-netflix-1', frequency: 'monthly', nextDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 10), 'yyyy-MM-dd') },
  { id: 'rec-4', transactionId: 'txn-sub-spotify-1', frequency: 'monthly', nextDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 15), 'yyyy-MM-dd') },
  { id: 'rec-5', transactionId: 'txn-sub-prime-1', frequency: 'yearly', nextDate: format(new Date(new Date().getFullYear() + 1, new Date().getMonth(), 8), 'yyyy-MM-dd') },
  { id: 'rec-6', transactionId: 'txn-sub-jio-1', frequency: 'monthly', nextDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 12), 'yyyy-MM-dd') },
  { id: 'rec-7', transactionId: 'txn-sip-1', frequency: 'monthly', nextDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), 'yyyy-MM-dd') },
];

export default function generateMockData() {
  return {
    user,
    accounts,
    categories,
    transactions,
    budgets,
    goals,
    recurringTransactions,
  };
}
