import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiFileText, FiActivity, FiAward, FiPlus, FiArrowRight } from 'react-icons/fi';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        if (response.data && response.data.success) {
          setStats(response.data.data);
        } else {
          setError('Failed to fetch dashboard statistics.');
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
        setError('Error connecting to backend API.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4"></div>
        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
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
          Try Again
        </button>
      </div>
    );
  }

  const { total_resumes, total_analyses, average_score, recent_analyses } = stats;

  // Format chart data from recent analyses
  const chartData = [...recent_analyses]
    .reverse()
    .map((item, idx) => ({
      name: `Anal. #${item.id}`,
      Score: item.ats_score,
      Matching: item.ai_response_json?.matching_skills?.length || 0,
      Missing: item.ai_response_json?.missing_skills?.length || 0,
    }));

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time resume metrics and parsing summaries</p>
        </div>
        <Link
          to="/upload"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-150 hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer w-full md:w-auto"
        >
          <FiPlus className="w-5 h-5 stroke-[3]" />
          Analyze New Resume
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Resumes */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Resumes</span>
              <h3 className="text-3xl font-black text-slate-800 mt-2">{total_resumes}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-primary rounded-xl group-hover:scale-110 transition-transform">
              <FiFileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs font-semibold text-slate-500 flex items-center gap-1">
            <span className="text-primary">Uploaded files</span> in database
          </div>
        </motion.div>

        {/* Total Analyses */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Analyses</span>
              <h3 className="text-3xl font-black text-slate-800 mt-2">{total_analyses}</h3>
            </div>
            <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:scale-110 transition-transform">
              <FiActivity className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs font-semibold text-slate-500 flex items-center gap-1">
            <span className="text-accent">AI reports</span> compiled so far
          </div>
        </motion.div>

        {/* Average ATS Score */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg ATS Score</span>
              <h3 className="text-3xl font-black text-slate-800 mt-2">{average_score}%</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <FiAward className="w-6 h-6" />
            </div>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="mt-4 space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${average_score}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Match quality rating</span>
          </div>
        </motion.div>
      </div>

      {/* Analytics Charts */}
      {recent_analyses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-6">ATS Score Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                  <Line type="monotone" dataKey="Score" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-6">Skills Evaluation Summary</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="Matching" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Matching Skills" />
                  <Bar dataKey="Missing" fill="#EF4444" radius={[4, 4, 0, 0]} name="Missing Skills" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Recent Analyses</h3>
          {recent_analyses.length > 0 && (
            <Link to="/history" className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
              View History
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recent_analyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="px-6 py-4">Analysis / Resume</th>
                  <th className="px-6 py-4 text-center">ATS Score</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent_analyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">Report #{analysis.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Resume ID: {analysis.resume_id}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span 
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          analysis.ats_score >= 80 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : analysis.ats_score >= 50 
                            ? 'bg-amber-50 text-amber-600' 
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {analysis.ats_score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(analysis.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/analysis/${analysis.id}`)}
                        className="px-4 py-1.5 text-xs bg-slate-100 hover:bg-primary hover:text-white font-bold rounded-lg text-slate-600 transition-colors"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-primary mb-4">
              <FiFileText className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">No analyses found</h4>
            <p className="text-slate-400 text-xs mt-1.5 max-w-xs mx-auto">
              You haven't run any analyses yet. Upload your resume and check compatibility against target jobs!
            </p>
            <Link
              to="/upload"
              className="mt-5 px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md shadow-blue-100 hover:bg-blue-700 transition-colors"
            >
              Analyze Your First Resume
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
