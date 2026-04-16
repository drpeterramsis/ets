/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, 
  User, 
  Building2, 
  Briefcase, 
  Waves, 
  Users, 
  Lock, 
  Mail, 
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';

// --- DATA SOURCE ---
// Easy to replace with real data
const employeeData = [
  {
    "Employee Number": "EMP001",
    "Employee Name": "Ahmed Mohamed",
    "Email Address": "ahmed.mohamed@evapharma.com",
    "Division": "Sales",
    "Unit": "Cardiology",
    "Job": "Medical Representative",
    "Title": "Medical Representative",
    "Wave": "AP20 - W1",
    "Team": "Mushroom 1"
  },
  {
    "Employee Number": "EMP002",
    "Employee Name": "Sarah Johnson",
    "Email Address": "sarah.johnson@evapharma.com",
    "Division": "Marketing",
    "Unit": "Digital Health",
    "Job": "Marketing Manager",
    "Title": "Senior Marketing Manager",
    "Wave": "AP20 - W2",
    "Team": "Falcon 3"
  },
  {
    "Employee Number": "EMP003",
    "Employee Name": "Peter Ramsis",
    "Email Address": "peter.ramsis@evapharma.com",
    "Division": "Operations",
    "Unit": "Supply Chain",
    "Job": "Logistics Coordinator",
    "Title": "Lead Logistics Coordinator",
    "Wave": "AP21 - W1",
    "Team": "Eagle 1"
  },
  {
    "Employee Number": "EMP004",
    "Employee Name": "Mona Ali",
    "Email Address": "mona.ali@evapharma.com",
    "Division": "HR",
    "Unit": "Talent Acquisition",
    "Job": "Recruiter",
    "Title": "Senior Talent Partner",
    "Wave": "AP21 - W2",
    "Team": "Phoenix 2"
  }
];

type Employee = typeof employeeData[0];

export default function App() {
  const [user, setUser] = useState<Employee | null>(null);
  const [email, setEmail] = useState('');
  const [empNumber, setEmpNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('employeeSession');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('employeeSession');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const foundUser = employeeData.find(emp => 
      emp["Email Address"].toLowerCase() === email.toLowerCase() && 
      emp["Employee Number"] === empNumber
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('employeeSession', JSON.stringify(foundUser));
    } else {
      setError('Invalid credentials, please try again');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeSession');
    setUser(null);
    setEmail('');
    setEmpNumber('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-4"
          >
            <div className="w-full max-w-md">
              {/* Logo/Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
                  <LayoutDashboard className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Wave Portal</h1>
                <p className="text-slate-500 mt-2">Sign in to access your dashboard</p>
              </div>

              {/* Login Card */}
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@evapharma.com"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Employee Number</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={empNumber}
                        onChange={(e) => setEmpNumber(e.target.value)}
                        placeholder="EMP000"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                  >
                    Sign In
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>

              <p className="text-center text-slate-400 text-xs mt-8">
                &copy; 2026 Eva Pharma. All rights reserved. <br/>
                Version 1.0.001
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pb-12"
          >
            {/* Header */}
            <header className="bg-white border-bottom border-slate-100 sticky top-0 z-10 shadow-sm">
              <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-display font-bold text-lg text-slate-900">Wave Portal</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 pt-8">
              {/* Welcome Section */}
              <div className="mb-8">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-display font-bold text-slate-900"
                >
                  Welcome, {user["Employee Name"].split(' ')[0]}!
                </motion.h2>
                <p className="text-slate-500">Here is your current assignment and profile details.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <User className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{user["Employee Name"]}</h3>
                        <p className="text-blue-600 font-medium text-sm">ID: {user["Employee Number"]}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
                          <Building2 className="w-4 h-4" />
                          Division
                        </div>
                        <p className="text-slate-900 font-semibold text-lg">{user["Division"]}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
                          <Users className="w-4 h-4" />
                          Unit
                        </div>
                        <p className="text-slate-900 font-semibold text-lg">{user["Unit"]}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
                          <Briefcase className="w-4 h-4" />
                          Job Title
                        </div>
                        <p className="text-slate-900 font-semibold text-lg">{user["Title"]}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
                          <Mail className="w-4 h-4" />
                          Email
                        </div>
                        <p className="text-slate-900 font-semibold">{user["Email Address"]}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Highlight Card */}
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group"
                  >
                    <Waves className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/30 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10">
                      <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-2">Current Wave</p>
                      <h3 className="text-4xl font-display font-black tracking-tight">{user["Wave"]}</h3>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-300 relative overflow-hidden group"
                  >
                    <Users className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-800/50 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10">
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Assigned Team</p>
                      <h3 className="text-4xl font-display font-black tracking-tight">{user["Team"]}</h3>
                    </div>
                  </motion.div>
                </div>
              </div>
            </main>

            <footer className="max-w-5xl mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-center">
              <p className="text-slate-400 text-sm">
                Eva Pharma Employee Wave Portal &bull; Version 1.0.001
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
