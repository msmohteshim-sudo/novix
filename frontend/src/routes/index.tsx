import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Production } from '../pages/production/Production';
import { Inventory } from '../pages/inventory/Inventory';
import { PurchaseOrders } from '../pages/procurement/PurchaseOrders';
import { Procurement } from '../pages/procurement/Procurement';
import { SalesOrders } from '../pages/sales/SalesOrders';
import { QualityInspections } from '../pages/quality/QualityInspections';
import { Machines } from '../pages/production/Machines';
import { Logistics } from '../pages/logistics/Logistics';
import { Reports } from '../pages/reports/Reports';
import { Analytics } from '../pages/analytics/Analytics';
import { Employees } from '../pages/employees/Employees';
import { Attendance } from '../pages/attendance/Attendance';
import { MyAttendance } from '../pages/attendance/MyAttendance';
import { MyTasks } from '../pages/tasks/MyTasks';
import { MyProduction } from '../pages/production/MyProduction';
import { RolesPermissions } from '../pages/admin/RolesPermissions';
import { Settings } from '../pages/admin/Settings';
import { AIInsights } from '../pages/ai/AIAdvisor';
import { Notifications } from '../pages/dashboard/Notifications';

import { Customers } from '../pages/sales/Customers';
import { MyProfile } from '../pages/profile/MyProfile';

import { ProtectedRoute } from '../components/layout/ProtectedRoute';

import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// Farm / Poultry Pages
import { FarmDashboard } from '../pages/farm/FarmDashboard';
import { Farms } from '../pages/farm/Farms';
import { Sheds } from '../pages/farm/Sheds';
import { Batches } from '../pages/farm/Batches';
import { Mortality } from '../pages/farm/Mortality';
import { FeedStock } from '../pages/farm/FeedStock';
import { FeedConsumption } from '../pages/farm/FeedConsumption';
import { EggProduction } from '../pages/farm/EggProduction';
import { Vaccinations } from '../pages/farm/Vaccinations';
import { FarmSuppliers } from '../pages/farm/FarmSuppliers';
import { FarmPurchases } from '../pages/farm/FarmPurchases';
import { FarmSales } from '../pages/farm/FarmSales';
import { FarmExpenses } from '../pages/farm/FarmExpenses';
import { FarmEquipment } from '../pages/farm/FarmEquipment';

// Dummy component for unauthorized or placeholder routes
const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: '2rem' }}><h2>{title}</h2><p>This is a placeholder page for the {title} module.</p></div>
);

import { useAuth } from '../context/AuthContext';

// Dynamic root redirect based on user industry
const RootRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user?.industry === 'POULTRY_FARM') {
    return <Navigate to="/farm/dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route index element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<RootRedirect />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="organizations" element={<Placeholder title="Organizations" />} />
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<Placeholder title="Admin Settings" />} />
          </Route>
          
          {/* Admin & Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
            <Route path="employees" element={<Employees />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="production" element={<Production />} />
            <Route path="machines" element={<Machines />} />
            <Route path="quality" element={<QualityInspections />} />
            <Route path="logistics" element={<Logistics />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai-insights" element={<AIInsights />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="predictive-maint" element={<Placeholder title="Predictive Maintenance" />} />
          </Route>

          {/* Supply Chain (Admin, Manager, Buyer) */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Buyer']} />}>
            <Route path="inventory" element={<Inventory />} />
            <Route path="procurement" element={<Procurement />} />
          </Route>

          {/* Buyer Only */}
          <Route element={<ProtectedRoute allowedRoles={['Buyer']} />}>
            <Route path="suppliers" element={<Placeholder title="Suppliers" />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
          </Route>

          {/* Sales (Admin, Manager, Seller) */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Seller']} />}>
            <Route path="sales" element={<Placeholder title="Sales & CRM" />} />
            <Route path="orders" element={<SalesOrders />} />
            <Route path="quotations" element={<SalesOrders />} />
            <Route path="customers" element={<Customers />} />
          </Route>

          {/* Profile, Attendance, Task & Production Routes accessible to all roles */}
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="my-attendance" element={<MyAttendance />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="my-production" element={<MyProduction />} />

          {/* Farm / Poultry Industry Routes */}
          <Route path="farm">
            <Route path="dashboard" element={<FarmDashboard />} />
            <Route path="farms" element={<Farms />} />
            <Route path="sheds" element={<Sheds />} />
            <Route path="batches" element={<Batches />} />
            <Route path="mortality" element={<Mortality />} />
            <Route path="feed-stock" element={<FeedStock />} />
            <Route path="feed-consumption" element={<FeedConsumption />} />
            <Route path="egg-production" element={<EggProduction />} />
            <Route path="vaccinations" element={<Vaccinations />} />
            <Route path="suppliers" element={<FarmSuppliers />} />
            <Route path="purchases" element={<FarmPurchases />} />
            <Route path="customers" element={<Customers />} />
            <Route path="sales" element={<FarmSales />} />
            <Route path="expenses" element={<FarmExpenses />} />
            <Route path="equipment" element={<FarmEquipment />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Data (Admin, Manager, Seller, Buyer) */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Seller', 'Buyer']} />}>
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Employee Only */}
          <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
            <Route path="notifications" element={<Placeholder title="Notifications" />} />
          </Route>
        </Route>
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};
