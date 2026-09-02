import { useState, useMemo } from 'react';
import generateMockData from './data/mockData';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Overview from './pages/Overview';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';
import Forecast from './pages/Forecast';
import Goals from './pages/Goals';
import Recurring from './pages/Recurring';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Load mock data
  const data = useMemo(() => generateMockData(), []);
  
  const pages = {
    overview: Overview,
    transactions: Transactions,
    analytics: Analytics,
    budgets: Budgets,
    forecast: Forecast,
    goals: Goals,
    recurring: Recurring,
    accounts: Accounts,
    settings: Settings,
  };
  
  const CurrentPage = pages[currentPage] || Overview;
  
  return (
    <div className="app">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="main-content">
        <CurrentPage data={data} />
      </main>
      
      <MobileNav 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
      />
    </div>
  );
}

export default App;
