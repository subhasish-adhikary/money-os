import { useState } from 'react';
import Card from '../components/Card';

export default function Settings({ data }) {
  const { user } = data;
  const [currency, setCurrency] = useState('INR');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className="settings-page">
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Customize your Money OS experience</p>
      </header>
      
      <div className="settings-grid">
        {/* Profile Section */}
        <Card className="settings-section" padding="p-6">
          <h3 className="section-title">Profile</h3>
          <div className="profile-info">
            <div className="avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
            </div>
          </div>
        </Card>
        
        {/* Preferences Section */}
        <Card className="settings-section" padding="p-6">
          <h3 className="section-title">Preferences</h3>
          
          <div className="setting-row">
            <div className="setting-label">
              <span>Currency</span>
              <span className="setting-description">Display currency for all amounts</span>
            </div>
            <select 
              className="setting-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">₹ INR - Indian Rupee</option>
              <option value="USD">$ USD - US Dollar</option>
              <option value="EUR">€ EUR - Euro</option>
              <option value="GBP">£ GBP - British Pound</option>
            </select>
          </div>
          
          <div className="setting-row">
            <div className="setting-label">
              <span>Notifications</span>
              <span className="setting-description">Receive alerts for budgets and goals</span>
            </div>
            <button 
              className={`toggle-btn ${notifications ? 'active' : ''}`}
              onClick={() => setNotifications(!notifications)}
            >
              <span className="toggle-indicator" />
            </button>
          </div>
          
          <div className="setting-row">
            <div className="setting-label">
              <span>Dark Mode</span>
              <span className="setting-description">Use dark theme</span>
            </div>
            <button 
              className={`toggle-btn ${darkMode ? 'active' : ''}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <span className="toggle-indicator" />
            </button>
          </div>
        </Card>
        
        {/* Data Section */}
        <Card className="settings-section" padding="p-6">
          <h3 className="section-title">Data & Privacy</h3>
          
          <div className="setting-actions">
            <button className="action-btn secondary">
              Export Data
            </button>
            <button className="action-btn secondary">
              Import Data
            </button>
            <button className="action-btn danger">
              Delete All Data
            </button>
          </div>
        </Card>
        
        {/* About Section */}
        <Card className="settings-section" padding="p-6">
          <h3 className="section-title">About Money OS</h3>
          <div className="about-content">
            <p className="version">Version 1.0.0</p>
            <p className="description">
              Money OS is your financial operating system, bringing spending, saving, 
              forecasting, goals, budgets, and financial health into one coherent system.
            </p>
            <p className="copyright">© 2025 Money OS. All rights reserved.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
