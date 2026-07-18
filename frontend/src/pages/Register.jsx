import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiCheck, FiAlertCircle } from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength states
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthText, setStrengthText] = useState('Weak');
  const [strengthColor, setStrengthColor] = useState('bg-red-400');

  useEffect(() => {
    // Basic password strength logic
    if (!password) {
      setStrengthScore(0);
      setStrengthText('Weak');
      setStrengthColor('bg-slate-200');
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setStrengthScore(score);

    if (score <= 2) {
      setStrengthText('Weak');
      setStrengthColor('bg-red-400');
    } else if (score === 3 || score === 4) {
      setStrengthText('Good');
      setStrengthColor('bg-yellow-400');
    } else {
      setStrengthText('Strong');
      setStrengthColor('bg-green-500');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Please complete all form fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(fullName, email, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[80px] animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/10 blur-[80px] animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md glass rounded-3xl shadow-xl shadow-slate-100 p-8 border border-white relative z-10 overflow-hidden"
      >
        {/* Animated Success Overlay */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm z-25 flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4 shadow-sm"
              >
                <FiCheck className="w-8 h-8 stroke-[3]" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800">Success!</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">{successMsg}</p>
              <div className="mt-6 w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                  className="h-full bg-green-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-md">
              A
            </div>
            <span className="font-extrabold text-slate-800 text-lg leading-none">ResuAI</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1">Register now and explore AI critique report</p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-red-700 text-xs"
          >
            <FiAlertCircle className="w-4.5 h-4.5 shrink-0 text-red-500" />
            <div className="font-medium">{errorMsg}</div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <FiUser className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 text-slate-800 bg-white/50 text-sm transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <FiMail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 text-slate-800 bg-white/50 text-sm transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 text-slate-800 bg-white/50 text-sm transition-all duration-200"
                required
              />
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1 select-none">
                  <span>Password Strength:</span>
                  <span className={strengthScore >= 4 ? 'text-green-600' : strengthScore >= 3 ? 'text-yellow-600' : 'text-red-500'}>
                    {strengthText}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 h-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <div
                      key={val}
                      className={`h-full rounded-full transition-all duration-300 ${
                        val <= strengthScore ? strengthColor : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 text-slate-800 bg-white/50 text-sm transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-blue-150 hover:bg-blue-700 active:scale-[0.99] transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:bg-blue-400 mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
