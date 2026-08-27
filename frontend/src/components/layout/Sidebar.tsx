import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Lightbulb, FileText, Building2, Users, Clock, ShieldCheck,
  Package, ShoppingCart, Factory, Wrench, Stethoscope, ClipboardCheck,
  Briefcase, Truck, TrendingUp, Bell, Settings, User as UserIcon, ListTodo,
  ChevronLeft, ChevronRight, Zap, MapPin, Activity, Egg,
  Syringe, DollarSign, Cpu, Heart
} from 'lucide-react';
import './layout.css';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'Employee';
  const industry = user?.industry || 'TEXTILE';
  const [collapsed, setCollapsed] = useState(false);

  const navLinkClass = ({isActive}: {isActive: boolean}) => isActive ? "erp-nav-item active" : "erp-nav-item";

  // ─── FARM SIDEBAR ──────────────────────────────────────────────────────────
  if (industry === 'POULTRY_FARM') {
    return (
      <aside className={`erp-sidebar poultry-sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Logo / Brand */}
        <div className="erp-sidebar-header">
          <div className="erp-brand">
            <div className="erp-brand-icon" style={{ background: '#16a34a', color: '#ffffff' }}>
              <Zap size={22} />
            </div>
            {!collapsed && (
              <div className="erp-brand-text">
                <span className="erp-brand-name" style={{ color: '#0f172a' }}>NOVAX</span>
                <span className="erp-brand-sub" style={{ color: '#16a34a', fontWeight: 600 }}>Farm Command Center</span>
              </div>
            )}
          </div>
        </div>

        <div className="erp-sidebar-nav">

          {/* MAIN */}
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Main</div>}
            <NavLink to="/farm/dashboard" className={navLinkClass}>
              <LayoutDashboard size={18} /> {!collapsed && 'Command Center'}
            </NavLink>
          </div>

          {/* FARM OPERATIONS */}
          {['Admin', 'Manager', 'Employee'].includes(role) && (
            <div className="erp-nav-group">
              {!collapsed && <div className="erp-nav-group-title">Farm Operations</div>}
              <NavLink to="/farm/farms" className={navLinkClass}>
                <MapPin size={18} /> {!collapsed && 'Farms & Sheds'}
              </NavLink>
              <NavLink to="/farm/batches" className={navLinkClass}>
                <Activity size={18} /> {!collapsed && 'Batches / Flocks'}
              </NavLink>
            </div>
          )}

          {/* BIRD HEALTH */}
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Bird Health</div>}
            <NavLink to="/farm/mortality" className={navLinkClass}>
              <Heart size={18} /> {!collapsed && 'Mortality Records'}
            </NavLink>

            {['Admin', 'Manager'].includes(role) && (
              <NavLink to="/farm/vaccinations" className={navLinkClass}>
                <Syringe size={18} /> {!collapsed && 'Vaccinations'}
              </NavLink>
            )}
          </div>

          {/* FEED & RESOURCES */}
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Feed & Resources</div>}
            <NavLink to="/farm/feed-stock" className={navLinkClass}>
              <Package size={18} /> {!collapsed && 'Feed Stock'}
            </NavLink>
            <NavLink to="/farm/feed-consumption" className={navLinkClass}>
              <Stethoscope size={18} /> {!collapsed && 'Feed Consumption'}
            </NavLink>
          </div>

          {/* PRODUCTION */}
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Production</div>}
            <NavLink to="/farm/egg-production" className={navLinkClass}>
              <Egg size={18} /> {!collapsed && 'Egg Production'}
            </NavLink>
            {['Admin', 'Manager', 'Seller'].includes(role) && (
              <NavLink to="/farm/sales" className={navLinkClass}>
                <Briefcase size={18} /> {!collapsed && 'Sales'}
              </NavLink>
            )}
          </div>

          {/* MONITORING */}
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Monitoring</div>}
            <NavLink to="/farm/dashboard#cameras" className={navLinkClass}>
              <Activity size={18} /> {!collapsed && 'Cameras & Control'}
            </NavLink>
          </div>

          {/* BUSINESS */}
          {['Admin', 'Manager', 'Buyer', 'Seller'].includes(role) && (
            <div className="erp-nav-group">
              {!collapsed && <div className="erp-nav-group-title">Business</div>}
              {['Admin', 'Manager', 'Buyer'].includes(role) && (
                <>
                  <NavLink to="/farm/suppliers" className={navLinkClass}>
                    <Building2 size={18} /> {!collapsed && 'Suppliers'}
                  </NavLink>
                  <NavLink to="/farm/purchases" className={navLinkClass}>
                    <ShoppingCart size={18} /> {!collapsed && 'Purchases'}
                  </NavLink>
                </>
              )}
              {['Admin', 'Manager'].includes(role) && (
                <>
                  <NavLink to="/farm/expenses" className={navLinkClass}>
                    <DollarSign size={18} /> {!collapsed && 'Expenses'}
                  </NavLink>
                  <NavLink to="/farm/equipment" className={navLinkClass}>
                    <Cpu size={18} /> {!collapsed && 'Equipment'}
                  </NavLink>
                  <NavLink to="/farm/reports" className={navLinkClass}>
                    <FileText size={18} /> {!collapsed && 'Reports'}
                  </NavLink>
                </>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {role === 'Admin' && (
            <div className="erp-nav-group">
              {!collapsed && <div className="erp-nav-group-title">Settings</div>}
              <NavLink to="/roles" className={navLinkClass}>
                <ShieldCheck size={18} /> {!collapsed && 'Users & Roles'}
              </NavLink>
              <NavLink to="/settings" className={navLinkClass}>
                <Settings size={18} /> {!collapsed && 'Farm Settings'}
              </NavLink>
            </div>
          )}

        </div>

        {/* Collapse toggle */}
        <div className="erp-sidebar-footer">
          <button className="erp-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> <span>Collapse Menu</span></>}
          </button>
        </div>
      </aside>
    );
  }

  // ─── TEXTILE SIDEBAR (original, unchanged) ─────────────────────────────────
  return (
    <aside className={`erp-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo / Brand */}
      <div className="erp-sidebar-header">
        <div className="erp-brand">
          <div className="erp-brand-icon">
            <Zap size={22} />
          </div>
          {!collapsed && (
            <div className="erp-brand-text">
              <span className="erp-brand-name">NOVAX</span>
              <span className="erp-brand-sub">Smart Manufacturing ERP</span>
            </div>
          )}
        </div>
      </div>

      <div className="erp-sidebar-nav">

        {/* MAIN */}
        <div className="erp-nav-group">
          {!collapsed && <div className="erp-nav-group-title">Main</div>}
          <NavLink to="/dashboard" end className={navLinkClass}>
            <LayoutDashboard size={18} /> {!collapsed && 'Dashboard'}
          </NavLink>
          {role === 'Admin' && (
            <NavLink to="/ai-insights" className={navLinkClass}>
              <Lightbulb size={18} /> {!collapsed && 'AI Business Advisor'}
            </NavLink>
          )}
          {['Admin', 'Manager', 'Seller', 'Buyer'].includes(role) && (
            <>
              <NavLink to="/reports" className={navLinkClass}>
                <FileText size={18} /> {!collapsed && 'Reports'}
              </NavLink>
              {['Admin', 'Manager'].includes(role) && (
                <NavLink to="/analytics" className={navLinkClass}>
                  <TrendingUp size={18} /> {!collapsed && 'Analytics'}
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* OPERATIONS (Admin, Manager) */}
        {['Admin', 'Manager'].includes(role) && (
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Operations</div>}
            <NavLink to="/production" className={navLinkClass}>
              <Factory size={18} /> {!collapsed && 'Production'}
            </NavLink>
            <NavLink to="/production" className={navLinkClass}>
              <ClipboardCheck size={18} /> {!collapsed && 'Work Orders'}
            </NavLink>
            <NavLink to="/machines" className={navLinkClass}>
              <Wrench size={18} /> {!collapsed && 'Machines'}
            </NavLink>
            <NavLink to="/quality" className={navLinkClass}>
              <ShieldCheck size={18} /> {!collapsed && 'Quality'}
            </NavLink>
          </div>
        )}

        {/* SUPPLY CHAIN (Admin, Manager, Buyer) */}
        {['Admin', 'Manager', 'Buyer'].includes(role) && (
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Supply Chain</div>}
            <NavLink to="/inventory" className={navLinkClass}>
              <Package size={18} /> {!collapsed && 'Inventory'}
            </NavLink>
            <NavLink to="/procurement" className={navLinkClass}>
              <ShoppingCart size={18} /> {!collapsed && 'Procurement'}
            </NavLink>
            {role === 'Buyer' && (
              <NavLink to="/suppliers" className={navLinkClass}>
                <Building2 size={18} /> {!collapsed && 'Suppliers'}
              </NavLink>
            )}
          </div>
        )}

        {/* SALES & CRM */}
        {['Admin', 'Manager', 'Seller'].includes(role) && (
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Sales & CRM</div>}
            <NavLink to="/orders" className={navLinkClass}>
              <Briefcase size={18} /> {!collapsed && 'Sales Orders'}
            </NavLink>
            <NavLink to="/customers" className={navLinkClass}>
              <Users size={18} /> {!collapsed && 'Customers'}
            </NavLink>
            <NavLink to="/quotations" className={navLinkClass}>
              <FileText size={18} /> {!collapsed && 'Quotations'}
            </NavLink>
          </div>
        )}

        {/* LOGISTICS (Admin, Manager) */}
        {['Admin', 'Manager'].includes(role) && (
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Logistics</div>}
            <NavLink to="/logistics" className={navLinkClass}>
              <Truck size={18} /> {!collapsed && 'Shipments'}
            </NavLink>
          </div>
        )}

        {/* ADMINISTRATION (Admin, Manager) */}
        {['Admin', 'Manager'].includes(role) && (
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">Administration</div>}
            <NavLink to="/employees" className={navLinkClass}>
              <Users size={18} /> {!collapsed && 'Employees'}
            </NavLink>
            <NavLink to="/attendance" className={navLinkClass}>
              <Clock size={18} /> {!collapsed && 'All Attendance'}
            </NavLink>
            <NavLink to="/my-attendance" className={navLinkClass}>
              <Clock size={18} /> {!collapsed && 'My Attendance'}
            </NavLink>
            <NavLink to="/my-tasks" className={navLinkClass}>
              <ListTodo size={18} /> {!collapsed && 'My Tasks'}
            </NavLink>
            <NavLink to="/my-production" className={navLinkClass}>
              <Factory size={18} /> {!collapsed && 'My Production'}
            </NavLink>
            {role === 'Admin' && (
              <>
                <NavLink to="/roles" className={navLinkClass}>
                  <ShieldCheck size={18} /> {!collapsed && 'Users & Roles'}
                </NavLink>
                <NavLink to="/settings" className={navLinkClass}>
                  <Settings size={18} /> {!collapsed && 'Settings'}
                </NavLink>
              </>
            )}
          </div>
        )}

        {/* EMPLOYEE ONLY */}
        {role === 'Employee' && (
          <div className="erp-nav-group">
            {!collapsed && <div className="erp-nav-group-title">My Workspace</div>}
            <NavLink to="/my-profile" className={navLinkClass}>
              <UserIcon size={18} /> {!collapsed && 'My Profile'}
            </NavLink>
            <NavLink to="/my-attendance" className={navLinkClass}>
              <Clock size={18} /> {!collapsed && 'My Attendance'}
            </NavLink>
            <NavLink to="/my-tasks" className={navLinkClass}>
              <ListTodo size={18} /> {!collapsed && 'My Tasks'}
            </NavLink>
            <NavLink to="/my-production" className={navLinkClass}>
              <Factory size={18} /> {!collapsed && 'My Production'}
            </NavLink>
            <NavLink to="/notifications" className={navLinkClass}>
              <Bell size={18} /> {!collapsed && 'Notifications'}
            </NavLink>
          </div>
        )}

      </div>

      {/* Collapse toggle */}
      <div className="erp-sidebar-footer">
        <button className="erp-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> <span>Collapse Menu</span></>}
        </button>
      </div>
    </aside>
  );
};
