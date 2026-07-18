import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiTrash2, FiFileText, FiAward, FiArrowRight, FiInfo } from 'react-icons/fi';

const History = () => {
  const navigate = useNavigate();
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all'); // all, high, medium, low

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/analysis/history');
        if (response.data && response.data.success) {
          setHistory(response.data.data);
        } else {
          setError('Failed to retrieve analysis history.');
        }
      } catch (err) {
        console.error('Error fetching analysis history:', err);
        setError('Error connecting to backend database.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDeleteLocal = (id) => {
    // Delete purely on frontend as backend does not expose a DELETE route
    if (window.confirm('Are you sure you want to remove this report from your list? This change is local-only.')) {
      setHistory(history.filter(item => item.id !== id));
    }
  };

  // Filter logic
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.job_description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (scoreFilter === 'all') return matchesSearch;
    if (scoreFilter === 'high') return matchesSearch && item.ats_score >= 80;
    if (scoreFilter === 'medium') return matchesSearch && item.ats_score >= 50 && item.ats_score < 80;
    if (scoreFilter === 'low') return matchesSearch && item.ats_score < 50;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4"></div>
        <div className="h-12 bg-slate-200 rounded-xl"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-24 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex flex-col items-center justify-center min-h-[300px]">
        <p className="font-semibold text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analysis History</h1>
        <p className="text-slate-500 text-sm mt-1">Review and manage your compiled AI feedback archives</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FiSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 text-slate-800 bg-white text-xs transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
            <FiFilter className="w-4.5 h-4.5" />
            Filter:
          </span>
          <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-150/50">
            {[
              { id: 'all', label: 'All' },
              { id: 'high', label: 'High (80+)' },
              { id: 'medium', label: 'Mid (50-79)' },
              { id: 'low', label: 'Low (<50)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setScoreFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  scoreFilter === f.id
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* Visual ID Box */}
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 leading-none">RPT</span>
                    <span className="text-sm font-black text-primary mt-0.5 leading-none">#{item.id}</span>
                  </div>
                  
                  {/* Job and Resume references */}
                  <div className="space-y-1 max-w-xl">
                    <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5 select-none">
                      <FiFileText className="w-3.5 h-3.5" />
                      Resume ID: {item.resume_id}
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      Analyzed on {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <p className="text-xs text-slate-500 font-semibold line-clamp-2 leading-relaxed">
                      {item.job_description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t border-slate-50 md:border-none">
                  {/* ATS Score Visual badge */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
                      <span className={`text-sm font-black mt-0.5 leading-none ${
                        item.ats_score >= 80 ? 'text-emerald-500' : item.ats_score >= 50 ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        {item.ats_score}%
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 border ${
                      item.ats_score >= 80 ? 'border-emerald-200 text-emerald-500' : item.ats_score >= 50 ? 'border-amber-200 text-amber-500' : 'border-rose-200 text-rose-500'
                    }`}>
                      <FiAward className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/analysis/${item.id}`)}
                      className="px-4 py-2 text-xs bg-slate-100 hover:bg-primary hover:text-white font-bold rounded-xl text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Report
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLocal(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove locally"
                    >
                      <FiTrash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 bg-white border border-slate-100 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50/50 flex items-center justify-center text-slate-400 mb-4 border border-blue-50">
                <FiInfo className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No matching analyses</h4>
              <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
                Try modifying your search queries or score selection filters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default History;
