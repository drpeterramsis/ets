/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, 
  User as UserIcon, 
  Building2, 
  Briefcase, 
  Waves, 
  Users, 
  LayoutDashboard,
  Search as SearchIcon,
  BarChart3,
  CheckCircle2,
  XCircle,
  Shield,
  ArrowRight
} from 'lucide-react';

// Data and Types
import employeeData from './data/employees.json';
import type { Employee, ThemeMode } from './types';

export const getTeamIcon = (teamName: string): string => {
  const name = teamName.toLowerCase().trim();
  if (name.includes('electric'))  return '⚡';
  if (name.includes('engineer'))  return '⚙️';
  if (name.includes('gold'))      return '🥇';
  if (name.includes('mushroom'))  return '🍄';
  if (name.includes('plumb'))     return '🔧';
  return '👥';
};

// Components
import { ThemeToggle } from './components/ThemeToggle';
import { Footer } from './components/Footer';
import { SearchEngine } from './components/SearchEngine';
import { DrillDown } from './components/DrillDown';

export default function App() {
  const [user, setUser] = useState<Employee | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [empNumber, setEmpNumber] = useState('');
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [foundEmployee, setFoundEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'drill' | 'search'>('drill');

  // Initialization: Theme and Session
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('themeMode') as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }

    // Session
    const savedSession = localStorage.getItem('evaSession');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem('evaSession');
      }
    }
    
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('themeMode', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Auth Handlers
  const handleStep1 = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const found = employeeData.find(emp => emp["Employee Number"] === empNumber.trim());
    if (found) {
      setFoundEmployee(found as Employee);
      setLoginStep(2);
    } else {
      setError('Invalid Employee ID, please try again');
    }
  };

  const confirmLogin = () => {
    if (foundEmployee) {
      setUser(foundEmployee);
      localStorage.setItem('evaSession', JSON.stringify(foundEmployee));
    }
  };

  const cancelLogin = () => {
    setLoginStep(1);
    setFoundEmployee(null);
    setEmpNumber('');
  };

  const handleLogout = () => {
    localStorage.removeItem('evaSession');
    setUser(null);
    setLoginStep(1);
    setEmpNumber('');
    setFoundEmployee(null);
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Universal Theme Toggle (Top Right) */}
      <div className="fixed top-4 right-4 z-[100]">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center p-4"
          >
            <div className="w-full max-w-sm space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[var(--accent-color)] rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-[var(--accent-color)]/20 rotate-3">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-display font-black tracking-tight mt-6">EVA Training</h1>
                <p className="text-[var(--text-secondary)] font-medium">Simulation Management Portal</p>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[var(--accent-color)]" />
                
                <AnimatePresence mode="wait">
                  {loginStep === 1 ? (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <form onSubmit={handleStep1} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-1">Employee Number</label>
                          <input
                            type="text"
                            required
                            value={empNumber}
                            onChange={(e) => setEmpNumber(e.target.value)}
                            placeholder="Enter Employee ID"
                            autoFocus
                            className="w-full px-5 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all outline-none font-bold text-lg"
                          />
                        </div>
                        {error && (
                          <motion.p 
                            animate={{ x: [0, -10, 10, -10, 10, 0] }}
                            transition={{ duration: 0.4 }}
                            className="text-red-500 text-xs font-bold transition-all"
                          >
                            {error}
                          </motion.p>
                        )}
                        <button type="submit" className="w-full py-4 bg-[var(--accent-color)] text-white rounded-2xl font-black shadow-lg shadow-[var(--accent-color)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                          CONTINUE <ArrowRight className="w-5 h-5" />
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center space-y-8">
                       <div className="space-y-4">
                          <div className="w-20 h-20 bg-[var(--input-bg)] rounded-full mx-auto flex items-center justify-center text-[var(--accent-color)] border-4 border-[var(--border-color)]">
                             <UserIcon className="w-10 h-10" />
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Identity Confirmation</p>
                             <h2 className="text-2xl font-black leading-tight">{foundEmployee?.["Employee Name"]}</h2>
                             <span className="inline-block px-3 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-lg text-[10px] font-black uppercase">{foundEmployee?.Unit}</span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] font-medium">Is this you? Please confirm to continue.</p>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <button onClick={confirmLogin} className="py-4 bg-[var(--accent-color)] text-white rounded-2xl font-black flex items-center justify-center gap-2 text-xs hover:bg-opacity-90">
                             <CheckCircle2 className="w-4 h-4" /> YES, IT'S ME
                          </button>
                          <button onClick={cancelLogin} className="py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black flex items-center justify-center gap-2 text-xs hover:bg-red-500/20">
                             <XCircle className="w-4 h-4" /> NO, WRONG ID
                          </button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Header / Nav */}
            <header className="sticky top-0 z-50 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
               <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-[var(--accent-color)] rounded-xl flex items-center justify-center text-white shadow-lg">
                        <LayoutDashboard className="w-5 h-5" />
                     </div>
                     <div className="hidden sm:block">
                        <h1 className="font-display font-black text-xl leading-none">EVA SIM</h1>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mt-1">Version 1.0.007</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-500 font-black text-xs hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">LOGOUT</span>
                     </button>
                  </div>
               </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
               {/* Welcome Header */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-1">
                     <h2 className="text-3xl sm:text-4xl font-display font-black">Welcome, {user["Employee Name"].split(' ')[0]}! 👋</h2>
                     <p className="text-[var(--text-secondary)] font-medium">Access your team simulations and training tracking.</p>
                  </div>
                  
                  <div className="flex bg-[var(--bg-card)] p-1 rounded-2xl border border-[var(--border-color)] shadow-sm self-start">
                     <button 
                        onClick={() => setActiveTab('drill')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'drill' ? 'bg-[var(--accent-color)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                      >
                        <BarChart3 className="w-4 h-4" /> DRILL-DOWN
                     </button>
                     <button 
                        onClick={() => setActiveTab('search')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'search' ? 'bg-[var(--accent-color)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                      >
                        <SearchIcon className="w-4 h-4" /> SEARCH ENGINE
                     </button>
                  </div>
               </div>

               {/* Profile Card */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-8 relative overflow-hidden"
               >
                   <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--accent-color)]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                   
                   <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                      <div className="flex flex-col sm:flex-row gap-6 items-center flex-1">
                         <div className="w-20 h-20 bg-[var(--input-bg)] rounded-3xl flex items-center justify-center text-[var(--accent-color)] border-2 border-[var(--border-color)] shadow-inner">
                            <UserIcon className="w-10 h-10" />
                         </div>
                         <div className="space-y-1 text-center sm:text-left">
                            <h3 className="text-2xl font-black uppercase tracking-tight">{user["Employee Name"]}</h3>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                               <span className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
                                  <Building2 className="w-3.5 h-3.5" /> {user.Division}
                               </span>
                               <span className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
                                  <Users className="w-3.5 h-3.5" /> {user.Unit}
                               </span>
                               <span className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
                                  <Briefcase className="w-3.5 h-3.5" /> {user.Title}
                               </span>
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                         <div className="flex-1 lg:flex-initial bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 px-8 py-4 rounded-3xl text-center min-w-[140px]">
                            <p className="text-[9px] font-black text-[var(--accent-color)] uppercase tracking-widest mb-1">Assigned Wave</p>
                            <p className="text-lg font-black text-[var(--accent-color)]">{user.Wave.replace(/_/g, '⏰')}</p>
                         </div>
                         <div className="flex-1 lg:flex-initial bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 px-8 py-4 rounded-3xl text-center min-w-[140px]">
                            <p className="text-[9px] font-black text-[var(--accent-color)] uppercase tracking-widest mb-1">Tactical Team</p>
                            <p className="text-lg font-black text-[var(--accent-color)]">{getTeamIcon(user.Team)} {user.Team}</p>
                         </div>
                      </div>
                   </div>
               </motion.div>

               {/* Feature Tabs */}
               <div className="min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {activeTab === 'drill' ? (
                       <motion.div key="drill" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          <div className="space-y-6">
                             <div className="pl-2">
                                <h3 className="text-xl font-display font-black tracking-tight">Wave Drill-Down</h3>
                                <p className="text-sm text-[var(--text-secondary)]">Browse institutional structure from Wave to individual Teams.</p>
                             </div>
                             <DrillDown data={employeeData as Employee[]} />
                          </div>
                       </motion.div>
                    ) : (
                      <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          <div className="space-y-6">
                             <div className="pl-2">
                                <h3 className="text-xl font-display font-black tracking-tight">Database Search</h3>
                                <p className="text-sm text-[var(--text-secondary)]">Search across all employee records with specific filters.</p>
                             </div>
                             <SearchEngine data={employeeData as Employee[]} />
                          </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
