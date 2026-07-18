import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiTrash2, FiArrowRight, FiCheckCircle, FiCpu, FiAlertTriangle } from 'react-icons/fi';

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form states
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  // Upload/Processing states
  const [uploadPhase, setUploadPhase] = useState('idle'); // idle, uploading, analyzing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  // File size formatter
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setErrorMsg('');
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Invalid file type. Only PDF documents are allowed.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current.click();
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!file) {
      setErrorMsg('Please upload your resume PDF first.');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 10) {
      setErrorMsg('Please enter a job description (at least 10 characters).');
      return;
    }

    try {
      // Phase 1: Upload resume PDF
      setUploadPhase('uploading');
      setProgressPercent(20);

      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!uploadRes.data || !uploadRes.data.success) {
        throw new Error(uploadRes.data?.message || 'Failed to upload resume file.');
      }

      const resumeId = uploadRes.data.data.id;
      setProgressPercent(50);

      // Phase 2: Create AI analysis
      setUploadPhase('analyzing');
      setProgressPercent(75);

      const analysisRes = await api.post('/analysis/create', {
        resume_id: resumeId,
        job_description: jobDescription,
      });

      if (!analysisRes.data || !analysisRes.data.success) {
        throw new Error(analysisRes.data?.message || 'Failed to compile AI analysis.');
      }

      setProgressPercent(100);
      setUploadPhase('success');

      // Short pause for success animation completion, then redirect
      setTimeout(() => {
        navigate(`/analysis/${analysisRes.data.data.id}`);
      }, 1000);

    } catch (err) {
      console.error('Analysis error:', err);
      const backendErr = err.response?.data?.message || err.message || 'Error communicating with server.';
      setErrorMsg(backendErr);
      setUploadPhase('error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Resume Analyzer</h1>
        <p className="text-slate-500 text-sm mt-1">Upload a PDF resume and match it against any job posting description</p>
      </div>

      <AnimatePresence mode="wait">
        {uploadPhase === 'idle' || uploadPhase === 'error' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm space-y-6"
          >
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start gap-3">
                <FiAlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                <div className="font-semibold">{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleAnalyze} className="space-y-6">
              {/* Drag and Drop Zone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">1. Upload Resume (PDF only)</label>
                {!file ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerBrowse}
                    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                      isDragActive 
                        ? 'border-primary bg-blue-50/50 scale-[1.01]' 
                        : 'border-slate-200 hover:border-primary/60 hover:bg-slate-50/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <FiUploadCloud className="w-12 h-12 text-slate-400 group-hover:text-primary mb-4 transition-colors" />
                    <p className="text-sm font-semibold text-slate-700 text-center">
                      Drag & drop your resume PDF here, or <span className="text-primary font-bold hover:underline">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Maximum upload size: 10MB</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-primary">
                        <FiFile className="w-5 h-5" />
                      </div>
                      <div className="max-w-md">
                        <h4 className="text-sm font-bold text-slate-800 truncate leading-snug">{file.name}</h4>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{formatBytes(file.size)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Job Description Text Area */}
              <div className="space-y-2">
                <label htmlFor="job-description" className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                  2. Paste Job Description
                </label>
                <textarea
                  id="job-description"
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the details of the job you want to analyze against (minimum 10 characters)..."
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 text-slate-800 bg-white text-sm transition-all resize-none"
                  required
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold px-1 select-none">
                  <span>Minimum characters: 10</span>
                  <span>{jobDescription.trim().length} characters entered</span>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-blue-150 hover:bg-blue-700 active:scale-[0.99] transition-all flex justify-center items-center gap-2 cursor-pointer mt-4"
              >
                Analyze Match
                <FiArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-100 p-10 rounded-3xl shadow-lg flex flex-col items-center justify-center min-h-[400px] text-center"
          >
            {/* Spinning/pulsing animation */}
            <div className="relative mb-8 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-blue-50 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-primary animate-pulse">
                <FiCpu className="w-8 h-8" />
              </div>
            </div>

            {uploadPhase === 'uploading' && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-800">Reading Resume Document</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Uploading PDF structure and extracting raw text formatting...
                </p>
              </div>
            )}

            {uploadPhase === 'analyzing' && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-800">AI Scoring & Skill Extraction</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Critiquing matching skills, identifying gaps, and preparing interview guides using OpenAI GPT model...
                </p>
              </div>
            )}

            {uploadPhase === 'success' && (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <FiCheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-emerald-600">Analysis Complete!</h3>
                <p className="text-sm text-slate-400">Loading your personalized dashboard report...</p>
              </div>
            )}

            {/* Custom Visual Progress Bar */}
            <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Upload;
