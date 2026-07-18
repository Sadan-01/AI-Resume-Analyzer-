import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiFileText, FiAward, FiTarget, FiHelpCircle, FiArrowRight, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

// Helper component for simple animated counter
const StatCounter = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
      <motion.span 
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight"
      >
        {value}
      </motion.span>
      <span className="text-sm font-medium text-slate-500 mt-2 text-center">{label}</span>
    </div>
  );
};

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Decorative Blob Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] animate-blob z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-accent/10 blur-[100px] animate-blob animation-delay-2000 z-0" />
      <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-blue-400/10 blur-[120px] animate-blob animation-delay-4000 z-0" />

      {/* Header / Navbar */}
      <header className="sticky top-0 bg-slate-50/70 backdrop-blur-md border-b border-slate-100 py-4 px-6 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-md">
              A
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-none">ResuAI</h1>
              <span className="text-[10px] text-primary font-semibold tracking-wider uppercase">SaaS Analyzer</span>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg transition-all duration-200">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:py-28 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-semibold mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            Next-Gen AI Resume Analyzer
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto"
          >
            Analyze Your Resume <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-accent">
              With Advanced AI
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-base md:text-xl text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Optimize your resume, compute your ATS compatibility score, detect critical skill gaps, and master your upcoming interviews with our premium AI-powered critiquing suite.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Get Started Free
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 text-center"
            >
              Login to Account
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="bg-white border-y border-slate-100 py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Designed to accelerate your career
              </h2>
              <p className="text-slate-500 mt-3">
                Unlock career insights and align your resume directly with corporate applicant tracking systems.
              </p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <FiFileText className="text-primary w-6 h-6" />,
                  title: "AI Resume Analysis",
                  description: "Leverage advanced LLMs to audit resume syntax, clarity, formatting, and structural weaknesses automatically."
                },
                {
                  icon: <FiAward className="text-accent w-6 h-6" />,
                  title: "ATS Score",
                  description: "Obtain an applicant tracking system match score out of 100 to gauge how well your file matches the vacancy."
                },
                {
                  icon: <FiTarget className="text-blue-500 w-6 h-6" />,
                  title: "Skill Gap Detection",
                  description: "Identify key programming languages, frameworks, or soft skills missing from your profile based on the job posting."
                },
                {
                  icon: <FiHelpCircle className="text-indigo-500 w-6 h-6" />,
                  title: "Interview Prep Questions",
                  description: "Review predictive interview questions that recruiters are highly likely to ask, tailored to your resume's weaknesses."
                },
                {
                  icon: <FiCheckCircle className="text-green-500 w-6 h-6" />,
                  title: "Resume Suggestions",
                  description: "Receive exact bullet-point recommendations detailing how to rephrase experience to sound more impactful."
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-slate-50 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Get analysed in 3 simple steps
              </h2>
              <p className="text-slate-500 mt-3">
                No complex forms, no configuration. Get professional reports in minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 relative">
              {[
                { step: "1", title: "Upload Resume", desc: "Drag and drop your resume in PDF format. We handle text parsing securely." },
                { step: "2", title: "Paste Job Vacancy", desc: "Provide the target job description or requirements you are applying for." },
                { step: "3", title: "Receive AI Report", desc: "Access scoring, skill diagnostics, critique feedback, and interview guides." }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-6 relative bg-white/40 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-lg shadow-md mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-slate-100/50 py-16 border-y border-slate-200/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCounter value="1,000+" label="Resumes Analyzed" />
              <StatCounter value="95%" label="Accuracy Score" />
              <StatCounter value="500+" label="Happy Jobseekers" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Trusted by job hunters worldwide
              </h2>
              <p className="text-slate-500 mt-3">
                See how job seekers improved their response rates and landed interviews.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "This analyzer completely changed how I tailored my resume. My response rate doubled in less than two weeks!",
                  author: "Sarah Jenkins",
                  role: "Frontend Engineer at TechCorp"
                },
                {
                  quote: "The missing skills report identified three critical database frameworks I forgot to mention. Absolute life saver.",
                  author: "Marcus Aurelius",
                  role: "Fullstack Developer"
                },
                {
                  quote: "The sample interview questions were 90% accurate to what the hiring panel actually asked during my first round.",
                  author: "Diana Prince",
                  role: "Product Manager"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <p className="text-slate-600 text-sm italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-none">{testimonial.author}</h4>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 block">{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-none">ResuAI</h1>
              <span className="text-[10px] text-accent font-semibold tracking-wider uppercase">SaaS Analyzer</span>
            </div>
          </div>
          
          <div className="text-sm text-center md:text-right">
            &copy; {new Date().getFullYear()} ResuAI. All rights reserved. Built for modern portfolios.
          </div>

          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-800 text-white rounded-lg hover:bg-primary transition-colors">
              <FiTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 text-white rounded-lg hover:bg-primary transition-colors">
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 text-white rounded-lg hover:bg-primary transition-colors">
              <FiGithub className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
