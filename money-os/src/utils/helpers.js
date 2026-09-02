// Format currency in Indian format
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format short currency (for displays)
export const formatCurrencyShort = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
};

// Format date
export const formatDate = (dateString, format = 'medium') => {
  const date = new Date(dateString);
  const options = {
    short: { day: 'numeric', month: 'short' },
    medium: { day: 'numeric', month: 'long', year: 'numeric' },
    long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    monthYear: { month: 'long', year: 'numeric' },
  };
  return date.toLocaleDateString('en-IN', options[format] || options.medium);
};

// Calculate percentage change
export const calculatePercentChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Get greeting based on time
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Clamp number between min and max
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Group transactions by date
export const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
};

// Calculate net worth from accounts
export const calculateNetWorth = (accounts) => {
  return accounts.reduce((total, account) => total + account.balance, 0);
};

// Get available cash (bank accounts + cash)
export const getAvailableCash = (accounts) => {
  return accounts
    .filter(acc => acc.type === 'bank' || acc.type === 'cash')
    .reduce((total, acc) => total + acc.balance, 0);
};

// Calculate monthly income/expenses
export const calculateMonthlyTotals = (transactions, type, months = 1) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  
  return transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === type && tDate >= startDate;
    })
    .reduce((total, t) => total + t.amount, 0);
};

// Get spending by category for current month
export const getSpendingByCategory = (transactions, categories) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const spending = {};
  
  transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && tDate >= startOfMonth;
    })
    .forEach(t => {
      if (!spending[t.categoryId]) {
        spending[t.categoryId] = 0;
      }
      spending[t.categoryId] += t.amount;
    });
  
  return Object.entries(spending).map(([categoryId, amount]) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      categoryId,
      categoryName: category?.name || 'Unknown',
      color: category?.color || '#737373',
      amount,
    };
  }).sort((a, b) => b.amount - a.amount);
};

// Calculate savings rate
export const calculateSavingsRate = (income, expenses) => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
};

// Get previous month data for comparison
export const getPreviousMonthData = (transactions, type) => {
  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  return transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === type && tDate >= startOfLastMonth && tDate <= endOfLastMonth;
    })
    .reduce((total, t) => total + t.amount, 0);
};

// Generate insights from data
export const generateInsights = (transactions, budgets, categories) => {
  const insights = [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Current month expenses
  const currentMonthExpenses = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && tDate >= startOfMonth;
    });
  
  // Last month expenses
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthExpenses = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && tDate >= startOfLastMonth && tDate <= endOfLastMonth;
    });
  
  // Compare food spending
  const foodCategory = 'cat-2';
  const currentFood = currentMonthExpenses.filter(t => t.categoryId === foodCategory).reduce((sum, t) => sum + t.amount, 0);
  const lastMonthFood = lastMonthExpenses.filter(t => t.categoryId === foodCategory).reduce((sum, t) => sum + t.amount, 0);
  
  if (currentFood > lastMonthFood && lastMonthFood > 0) {
    const percentIncrease = ((currentFood - lastMonthFood) / lastMonthFood) * 100;
    insights.push({
      type: 'warning',
      title: 'Dining spending increased',
      description: `Your dining spending is ${percentIncrease.toFixed(0)}% higher than last month.`,
      category: foodCategory,
    });
  }
  
  // Check budget overruns
  budgets.forEach(budget => {
    const spent = currentMonthExpenses.filter(t => t.categoryId === budget.categoryId).reduce((sum, t) => sum + t.amount, 0);
    const percentUsed = (spent / budget.limit) * 100;
    
    if (percentUsed > 100) {
      const category = categories.find(c => c.id === budget.categoryId);
      insights.push({
        type: 'alert',
        title: 'Budget exceeded',
        description: `${category?.name} is ${(percentUsed - 100).toFixed(0)}% over budget.`,
        category: budget.categoryId,
      });
    } else if (percentUsed > 85) {
      const category = categories.find(c => c.id === budget.categoryId);
      insights.push({
        type: 'warning',
        title: 'Approaching budget limit',
        description: `${category?.name} is at ${percentUsed.toFixed(0)}% of your budget.`,
        category: budget.categoryId,
      });
    }
  });
  
  // Upcoming recurring expenses
  const upcomingRecurring = [];
  const nextTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  
  // Subscription count
  const subscriptionCategories = ['cat-5'];
  const subscriptions = currentMonthExpenses.filter(t => subscriptionCategories.includes(t.categoryId));
  if (subscriptions.length > 3) {
    insights.push({
      type: 'info',
      title: 'Subscription review',
      description: `You have ${subscriptions.length} subscription charges this month.`,
    });
  }
  
  return insights;
};
