import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiUpload, FiClock, FiUser, FiLogOut, FiMenu, FiX, FiBell } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid className="w-5 h-5" /> },
    { name: 'Upload Resume', path: '/upload', icon: <FiUpload className="w-5 h-5" /> },
    { name: 'History', path: '/history', icon: <FiClock className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <FiUser className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Get active menu name
  const activeMenu = menuItems.find((item) => item.path === location.pathname)?.name || 'Resume Analyzer';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-slate-100 shadow-sm fixed h-full z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200">
            A
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 leading-none">ResuAI</h1>
            <span className="text-[10px] text-primary font-semibold tracking-wider uppercase">SaaS Analyzer</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-blue-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Slideover */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white z-40 p-6 flex flex-col shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-md">
                    A
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-slate-800 leading-none">ResuAI</h1>
                    <span className="text-[10px] text-primary font-semibold tracking-wider uppercase">SaaS Analyzer</span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-blue-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-950 md:hidden"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-slate-800 text-lg hidden sm:block">{activeMenu}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl relative transition-all">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Summary */}
            {user && (
              <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                <div className="flex flex-col text-right hidden md:flex">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">{user.full_name}</span>
                  <span className="text-[10px] text-slate-400 leading-tight">{user.email}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-100">
                  {getInitials(user.full_name)}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Nested Routes */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
