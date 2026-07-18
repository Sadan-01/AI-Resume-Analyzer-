import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiLogOut, FiShield, FiSliders } from 'react-icons/fi';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (!user) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your resume profile metrics and user options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar Panel */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center space-y-4 md:col-span-1">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary via-blue-600 to-accent flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100">
              {getInitials(user.full_name)}
            </div>
            <span className="absolute bottom-[-6px] right-[-6px] px-2 py-0.5 bg-emerald-500 text-white rounded-md text-[8px] font-black uppercase tracking-wider shadow-sm select-none border border-white">
              Active
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800 leading-snug">{user.full_name}</h3>
            <span className="text-[10px] text-slate-400 font-semibold">{user.email}</span>
          </div>

          <div className="w-full pt-4 border-t border-slate-100">
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-wider inline-block">
              Free Plan Tier
            </div>
          </div>
        </div>

        {/* Right Side: Account Details Panel */}
        <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm md:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FiSliders className="text-primary w-4.5 h-4.5" />
            Profile Details
          </h3>

          <div className="space-y-4">
            {/* Full Name field */}
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                <FiUser className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">{user.full_name}</span>
              </div>
            </div>

            {/* Email field */}
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                <FiMail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">{user.email}</span>
              </div>
            </div>

            {/* Joined date field */}
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                <FiCalendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Member Since</span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">{formatDate(user.created_at)}</span>
              </div>
            </div>

            {/* System Status field */}
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                <FiShield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Level</span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">User Access Roles</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Need to change your details? <br />
              Contact backend administrator.
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              <FiLogOut className="w-4.5 h-4.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
