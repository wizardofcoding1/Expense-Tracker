import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  UserCircle,
  TrendingUp,
  Settings
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'Savings Goals', path: '/savings', icon: Target },
    { name: 'Group Expenses', path: '/groups', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Profile Settings', path: '/profile', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-obsidian-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            FINTRACK
          </span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-obsidian-900 border-r border-zinc-800/80 p-6 flex flex-col justify-between transition-transform duration-300 transform md:translate-x-0 md:static md:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col gap-8">
          {/* Logo Section */}
          <div className="hidden md:flex items-center gap-3">
            <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              FINTRACK
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-primary/10 text-primary border-l-4 border-primary pl-3' 
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                    }
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-primary' : 'text-zinc-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile actions bottom of sidebar */}
        <div className="border-t border-zinc-850 pt-4 flex flex-col gap-4">
          <Link 
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-zinc-800/30 transition-all duration-200"
          >
            <div className="h-10 w-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-primary border border-zinc-700/50">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-zinc-200 truncate">
                {user ? `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() || 'User' : 'Guest User'}
              </p>
              <p className="text-xs text-zinc-550 truncate">
                {user ? user.email : 'guest@fintrack.local'}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        ></div>
      )}

      {/* Main page content area */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        {/* Top Header bar for Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-zinc-800/60 bg-obsidian-900/40 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 m-0">
              {menuItems.find(item => item.path === location.pathname)?.name || 'App'}
            </h1>
            <p className="text-xs text-zinc-550 mt-0.5">
              Welcome back, {user?.firstName || user?.first_name || 'User'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-zinc-500">Local Time</p>
              <p className="text-xs font-semibold text-zinc-300">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </header>

        {/* Dynamic page container */}
        <div key={location.pathname} className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-page-transition">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
