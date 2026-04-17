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
  Building,
  Briefcase, 
  Waves, 
  Users, 
  LayoutDashboard,
  Search as SearchIcon,
  BarChart3,
  CheckCircle2,
  XCircle,
  Shield,
  ArrowRight,
  Hash
} from 'lucide-react';

// Data and Types
import employeeData from './data/employees.json';
import type { Employee, ThemeMode } from './types';

// ⭐ SUPERUSER IDs — add or remove Employee Numbers here
const SUPERUSER_IDS = [
  "4639",
  // add more IDs here easily
];

const getRole = (employeeNumber: string): string => {
  if (employeeNumber === "000000") return "facilitator";
  if (SUPERUSER_IDS.includes(employeeNumber)) return "superuser";
  return "employee";
};

const splitWave = (wave: string): { date: string; time: string } => {
  // Try splitting on " _ " first, then "_", then first " "
  if (wave.includes(' _ ')) {
    const parts = wave.split(' _ ');
    return { date: parts[0].trim(), time: parts.slice(1).join(' _ ').trim() };
  }
  if (wave.includes('_')) {
    const parts = wave.split('_');
    return { date: parts[0].trim(), time: parts.slice(1).join('_').trim() };
  }
  // Split on first space only
  const idx = wave.indexOf(' ');
  if (idx !== -1) {
    return { 
      date: wave.substring(0, idx).trim(), 
      time: wave.substring(idx + 1).trim() 
    };
  }
  return { date: wave, time: '' };
};

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
    const trimmedId = empNumber.trim();

    if (trimmedId === "000000") {
      setFoundEmployee({
        "Employee Number": "000000",
        "Employee Name": "Facilitator Access",
        "Email Address": "admin@eva.com",
        "Division": "Management",
        "Unit": "Training",
        "Title": "Facilitator",
        "Level": "L1",
        "Wave": "ALL_WAVES",
        "Kingdom": "ALL",
        "Team": "ALL",
        "role": "facilitator"
      } as Employee);
      setLoginStep(2);
      return;
    }

    const found = employeeData.find(emp => emp["Employee Number"] === trimmedId);
    if (found) {
      setFoundEmployee(found as Employee);
      setLoginStep(2);
    } else {
      setError('Invalid Employee ID, please try again');
    }
  };

  const confirmLogin = () => {
    if (foundEmployee) {
      const role = getRole(foundEmployee["Employee Number"]);
      const userWithRole = { ...foundEmployee, role };
      setUser(userWithRole);
      localStorage.setItem('evaSession', JSON.stringify(userWithRole));
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
      {/* Universal Theme Toggle Moved logic - actually the MOD 3 and 4 refine this */}
      
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
                        <a 
                          href="https://wa.me/201069996672?text=Hello%2C%20I'm%20contacting%20from%20EVA%20SIM%20%F0%9F%91%8B%0AI%20cannot%20find%20my%20Employee%20ID.%0ACould%20you%20please%20help%20me%3F"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center mt-3 text-[12px] text-black dark:text-[rgba(255,192,0,0.6)] underline decoration-dotted hover:text-[#333333] dark:hover:text-[#ffc000] hover:decoration-solid transition-all duration-200 cursor-pointer"
                        >
                          💬 Can't find your ID? Click here
                        </a>
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
            <Footer onLogout={handleLogout} showLogout={!!user} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Header / Nav */}
            <header className="sticky top-0 z-[100] bg-[var(--bg-main)] border-b border-[var(--border-color)]">
               <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <h1 className="font-display font-black text-[#ffc000] text-lg sm:text-xl whitespace-nowrap">
                        <span className="hidden sm:inline">EVA Training Simulation</span>
                        <span className="sm:hidden">EVA SIM</span>
                     </h1>
                  </div>

                  <div className="flex items-center gap-2">
                     <ThemeToggle theme={theme} onToggle={toggleTheme} />
                  </div>
               </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8 pb-14">
               {/* Welcome Header */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        <h2 className="text-3xl sm:text-4xl font-display font-black">
                           Welcome, {user.role === 'facilitator' ? 'Facilitator' : user["Employee Name"].split(' ')[0]}! {user.role === 'superuser' ? '⭐' : '👋'}
                        </h2>
                        {user.role === 'superuser' && (
                           <span className="px-2 py-0.5 bg-[#ffc000] text-black text-[10px] font-black uppercase rounded-full shadow-sm">
                              ⭐ Super User
                           </span>
                        )}
                     </div>
                     <p className="text-[var(--text-secondary)] font-medium">Access your team simulations and training tracking.</p>
                  </div>
                  
                  {(user.role === 'superuser' || user.role === 'facilitator') && (
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
                  )}
               </div>

               {/* Profile Card */}
               {(user.role === 'employee' || user.role === 'superuser') && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="bg-[var(--bg-card)] border border-[#ffc000] rounded-[20px] p-5 sm:px-6 sm:py-5 flex flex-col gap-4 shadow-xl"
                 >
                     {/* ROW 1 — IDENTITY */}
                     <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                        <div className="w-16 h-16 bg-transparent border-2 border-[#ffc000] rounded-xl flex items-center justify-center text-[#ffc000] shrink-0">
                           <UserIcon className="w-8 h-8" />
                        </div>
                        <div className="flex-1 min-w-[320px] text-center md:text-left space-y-1">
                           <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[var(--accent-color)]/10 border border-[#ffc000] rounded-full mb-1">
                              <Hash className="w-3 h-3 text-black dark:text-[#ffc000]" />
                              <p className="font-mono text-black dark:text-[#ffc000] text-[12px] font-bold leading-none uppercase">ID: {user["Employee Number"]}</p>
                           </div>
                           <h3 className="text-[20px] sm:text-[22px] font-display font-bold text-[#ffc000] uppercase leading-tight md:whitespace-nowrap">
                             {user["Employee Name"]}
                           </h3>
                           <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
                              <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#111111] dark:text-[#aaaaaa]">
                                 <Building className="w-3.5 h-3.5" /> {user.Division}
                              </span>
                              <span className="md:inline hidden text-[rgba(0,0,0,0.4)] dark:text-[rgba(255,192,0,0.4)]">·</span>
                              <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#111111] dark:text-[#aaaaaa]">
                                 <Building2 className="w-3.5 h-3.5" /> {user.Unit}
                              </span>
                              <span className="md:inline hidden text-[rgba(0,0,0,0.4)] dark:text-[rgba(255,192,0,0.4)]">·</span>
                              <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#111111] dark:text-[#aaaaaa]">
                                 <Briefcase className="w-3.5 h-3.5" /> {user.Title}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* ROW 2 — INFO CARDS */}
                     <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 w-full">
                        {/* KINGDOM */}
                        <div className="flex-1 bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,192,0,0.07)] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,192,0,0.3)] rounded-xl px-4 py-3 flex flex-col items-center justify-center text-center h-full sm:py-3.5">
                            <div className="flex items-center justify-center gap-1 text-black dark:text-[#ffc000] text-[10px] font-semibold uppercase tracking-[0.12em] mb-1">
                                <span>🏰</span> KINGDOM
                            </div>
                            <p className="text-[22px] font-display font-bold text-black dark:text-[#ffc000] leading-none">{user.Kingdom}</p>
                        </div>

                        {/* WAVE DATE */}
                        <div className="flex-1 bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,192,0,0.07)] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,192,0,0.3)] rounded-xl px-4 py-3 flex flex-col items-center justify-center text-center h-full sm:py-3.5">
                            <div className="flex items-center justify-center gap-1 text-black dark:text-[#ffc000] text-[10px] font-semibold uppercase tracking-[0.12em] mb-1">
                                <span>📅</span> WAVE DATE
                            </div>
                            <p className="text-[22px] font-display font-bold text-black dark:text-[#ffc000] leading-none">
                              {splitWave(user.Wave).date.replace(/⏰/g, '').trim()}
                            </p>
                        </div>

                        {/* WAVE TIME */}
                        <div className="flex-1 bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,192,0,0.07)] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,192,0,0.3)] rounded-xl px-4 py-3 flex flex-col items-center justify-center text-center h-full sm:py-3.5">
                            <div className="flex items-center justify-center gap-1 text-black dark:text-[#ffc000] text-[10px] font-semibold uppercase tracking-[0.12em] mb-1">
                                <span>⏰</span> WAVE TIME
                            </div>
                            <p className="text-[22px] font-display font-bold text-black dark:text-[#ffc000] leading-none">
                              {splitWave(user.Wave).time.trim()}
                            </p>
                        </div>

                        {/* TACTICAL TEAM */}
                        <div className="flex-1 bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,192,0,0.07)] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,192,0,0.3)] rounded-xl px-4 py-3 flex flex-col items-center justify-center text-center h-full sm:py-3.5">
                            <div className="flex items-center justify-center gap-1 text-black dark:text-[#ffc000] text-[10px] font-semibold uppercase tracking-[0.12em] mb-1">
                                <span>👥</span> TACTICAL TEAM
                            </div>
                            <p className="text-[22px] font-display font-bold text-black dark:text-[#ffc000] leading-none whitespace-nowrap">
                              {getTeamIcon(user.Team)} {user.Team}
                            </p>
                        </div>
                     </div>
                 </motion.div>
               )}

               {/* Feature Tabs */}
               {(user.role === 'facilitator' || user.role === 'superuser') && (
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
               )}
            </main>
            <Footer onLogout={handleLogout} showLogout={!!user} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
