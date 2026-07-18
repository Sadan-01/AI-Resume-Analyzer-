import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiAward, FiCheck, FiX, FiTrendingUp, FiHelpCircle, FiBookOpen, FiActivity, FiShield } from 'react-icons/fi';

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, skills, improvements, interview

  useEffect(() => {
    const fetchAnalysisDetails = async () => {
      try {
        const response = await api.get(`/analysis/${id}`);
        if (response.data && response.data.success) {
          setAnalysis(response.data.data);
        } else {
          setError('Failed to fetch resume analysis report details.');
        }
      } catch (err) {
        console.error('Error fetching analysis details:', err);
        setError(err.response?.data?.message || 'Error connecting to backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysisDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-200 rounded-2xl lg:col-span-1"></div>
          <div className="h-80 bg-slate-200 rounded-2xl lg:col-span-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex flex-col items-center justify-center min-h-[300px]">
        <p className="font-semibold text-lg">{error}</p>
        <div className="flex gap-4 mt-6">
          <Link 
            to="/dashboard"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-250 font-bold rounded-xl text-sm text-slate-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { ats_score, ai_response_json, created_at, job_description } = analysis;
  const {
    matching_skills = [],
    missing_skills = [],
    strengths = [],
    weaknesses = [],
    improvement_suggestions = [],
    interview_questions = []
  } = ai_response_json;

  // Circle meter metrics
  const radius = 60;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (ats_score / 100) * circumference;

  const tabVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-8">
      {/* Header Back button */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors hover:underline bg-white border border-slate-250/50 px-3.5 py-2 rounded-xl shadow-sm mb-4 cursor-pointer"
        >
          <FiChevronLeft className="w-4 h-4 stroke-[3]" />
          Back to Overview
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Critique Report</h1>
        <p className="text-slate-400 text-xs mt-1.5 font-medium">
          Compiled on {new Date(created_at).toLocaleString()} for Analysis Reference #{id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Animated Score Meter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center lg:col-span-1 min-h-[320px]"
        >
          <h3 className="text-base font-bold text-slate-800 mb-6">ATS Compatibility</h3>

          <div className="relative flex items-center justify-center w-40 h-40">
            {/* SVG Circular Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-slate-100"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx="80"
                cy="80"
              />
              <motion.circle
                className={ats_score >= 80 ? 'text-emerald-500' : ats_score >= 50 ? 'text-amber-500' : 'text-rose-500'}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx="80"
                cy="80"
                strokeLinecap="round"
                fill="transparent"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-800 leading-none">{ats_score}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Score</span>
            </div>
          </div>

          <div className="mt-8 p-3 rounded-2xl bg-slate-50 border border-slate-100 w-full flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${ats_score >= 80 ? 'bg-emerald-50 text-emerald-600' : ats_score >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
              <FiAward className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classification</span>
              <h4 className="text-xs font-bold text-slate-800 mt-0.5">
                {ats_score >= 80 ? 'Excellent Match' : ats_score >= 50 ? 'Moderate Alignment' : 'Low Compatibility'}
              </h4>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Detailed Tabbed Information */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          {/* Tabs Menu */}
          <div className="bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm flex flex-wrap gap-1">
            {[
              { id: 'overview', label: 'Match Overview', icon: <FiTrendingUp className="w-4 h-4" /> },
              { id: 'skills', label: 'Skills Comparison', icon: <FiActivity className="w-4 h-4" /> },
              { id: 'improvements', label: 'Action Items', icon: <FiBookOpen className="w-4 h-4" /> },
              { id: 'interview', label: 'Interview Prep', icon: <FiHelpCircle className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md shadow-blue-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-sm flex-1 min-h-[350px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-800">Match Overview</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Strengths
                      </h4>
                      {strengths.length > 0 ? (
                        <ul className="space-y-2.5">
                          {strengths.map((s, idx) => (
                            <li key={idx} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed items-start">
                              <span className="w-4.5 h-4.5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                                <FiCheck className="w-3 h-3 stroke-[3]" />
                              </span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-400 text-xs italic">No strengths highlighted in response.</p>
                      )}
                    </div>

                    {/* Weaknesses */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Weaknesses
                      </h4>
                      {weaknesses.length > 0 ? (
                        <ul className="space-y-2.5">
                          {weaknesses.map((w, idx) => (
                            <li key={idx} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed items-start">
                              <span className="w-4.5 h-4.5 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                                <FiX className="w-3 h-3 stroke-[3]" />
                              </span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-400 text-xs italic">No critical weaknesses listed.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-800">Skills Comparison</h3>
                  <div className="space-y-6">
                    {/* Matching Skills */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Matching Skills</h4>
                      {matching_skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {matching_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 shadow-sm"
                            >
                              <FiCheck className="w-3 h-3" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-xs italic">No matching tech skills parsed from job description.</p>
                      )}
                    </div>

                    {/* Missing Skills */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Missing Skills (Skill Gaps)</h4>
                      {missing_skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {missing_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100 shadow-sm"
                            >
                              <FiX className="w-3 h-3" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-xs italic text-emerald-600 font-semibold">
                          Excellent! All primary target requirements are fulfilled by your profile.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'improvements' && (
                <motion.div
                  key="improvements"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-800">Action Plan (Suggestions)</h3>
                  {improvement_suggestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {improvement_suggestions.map((suggestion, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-3">
                          <span className="w-7 h-7 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed pt-0.5">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs italic">No specific recommendations compiled.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'interview' && (
                <motion.div
                  key="interview"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-800">Predicted Interview Questions</h3>
                  {interview_questions.length > 0 ? (
                    <div className="space-y-4">
                      {interview_questions.map((question, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-sm space-y-2 hover:border-slate-350 transition-colors"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="p-1 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                              <FiHelpCircle className="w-4.5 h-4.5" />
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 leading-snug">{question}</h4>
                          </div>
                          <p className="text-xs text-slate-400 pl-8 leading-relaxed font-semibold">
                            Tip: Structure your answer using the STAR method (Situation, Task, Action, Result) addressing the weakness related to this query.
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs italic">No interview questions modeled for this profile.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Vacancy description audit preview */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4">Job Description Audited</h3>
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl max-h-40 overflow-y-auto text-xs text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">
          {job_description}
        </div>
      </div>
    </div>
  );
};

export default Result;
