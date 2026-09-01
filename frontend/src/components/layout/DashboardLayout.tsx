import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './layout.css';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const isPoultry = user?.industry === 'POULTRY_FARM';

  return (
    <div className={`erp-layout theme-${theme} ${isPoultry ? 'poultry-light-theme' : ''}`}>
      <Sidebar />
      <div className="erp-main-container">
        <Header />
        <main className="erp-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
