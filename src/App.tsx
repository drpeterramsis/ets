/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, 
  User, 
  Building2, 
  Briefcase, 
  Waves as WaveIcon, 
  Users, 
  Lock, 
  Shield,
  ChevronRight,
  LayoutDashboard,
  BarChart3,
  Crown,
  Settings,
  Zap,
  CirclePlay,
  Droplet,
  Search,
  ArrowLeft,
  Info
} from 'lucide-react';

// --- DATA SOURCE ---
import employeeData from './data/employees.json';

// Types and Interfaces
type Employee = {
  "Employee Number": string;
  "Employee Name": string;
  "Email Address": string | null;
  "Division": string;
  "Unit": string | null;
  "Title": string;
  "Level": string;
  "Wave": string;
  "Team": string;
  "Kingdom": string;
};

type ViewMode = 'portal' | 'statistics';

// Helper to get unique values and counts
const getStats = (data: Employee[]) => {
  const waves = Array.from(new Set(data.map(e => e.Wave))).sort();
  const kingdoms = Array.from(new Set(data.map(e => e.Kingdom))).sort((a, b) => Number(a) - Number(b));
  
  return { waves, kingdoms };
};

// Icon Mapping components
const KingdomIcon = ({ id, className }: { id: string, className?: string }) => {
  const icons = [<Shield />, <Crown />, <Shield />, <Shield />, <Shield />];
  return <Crown className={className} />;
};

const TeamIcon = ({ name, className }: { name: string, className?: string }) => {
  const lower = name.toLowerCase();
  if (lower.includes('elect')) return <Zap className={className} />;
  if (lower.includes('eng')) return <Settings className={className} />;
  if (lower.includes('gold')) return <CirclePlay className={className} />;
  if (lower.includes('mushroom')) return <Shield className={className} />;
  if (lower.includes('plum')) return <Droplet className={className} />;
  return <Users className={className} />;
};

// Component: Statistics Dashboard
const StatisticsDashboard = () => {
  const { waves, kingdoms } = useMemo(() => getStats(employeeData as Employee[]), []);
  const [selectedWave, setSelectedWave] = useState<string | null>(null);
  const [selectedKingdom, setSelectedKingdom] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Derived data based on selections
  const waveDetails = useMemo(() => {
    if (!selectedWave) return null;
    const members = employeeData.filter(e => e.Wave === selectedWave);
    const divisions = Array.from(new Set(members.map(e => e.Division)));
    const units = Array.from(new Set(members.map(e => e.Unit).filter(Boolean)));
    return { divisions, units, count: members.length };
  }, [selectedWave]);

  const kingdomTeams = useMemo(() => {
    if (!selectedKingdom) return [];
    return Array.from(new Set(employeeData.filter(e => e.Kingdom === selectedKingdom).map(e => e.Team)));
  }, [selectedKingdom]);

  const teamMembers = useMemo(() => {
    if (!selectedTeam || !selectedKingdom) return [];
    return employeeData.filter(e => e.Kingdom === selectedKingdom && e.Team === selectedTeam);
  }, [selectedTeam, selectedKingdom]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand/20 rounded-lg">
          <BarChart3 className="text-brand w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Live Statistics</h2>
          <p className="text-slate-400 text-sm">Real-time overview of Waves, Kingdoms and Teams</p>
        </div>
      </div>

      {/* Waves Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 border-l-4 border-brand pl-3">
          <WaveIcon className="w-5 h-5 text-brand" />
          Training Waves
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {waves.slice(0, 4).map((wave) => (
            <button
              key={wave}
              onClick={() => setSelectedWave(selectedWave === wave ? null : wave)}
              className={`p-5 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                selectedWave === wave 
                ? 'bg-brand text-slate-950 border-brand' 
                : 'bg-slate-900 border-slate-800 text-white hover:border-brand/50'
              }`}
            >
              <WaveIcon className={`absolute -right-4 -bottom-4 w-20 h-20 opacity-10 group-hover:scale-110 transition-transform ${selectedWave === wave ? 'text-slate-950' : 'text-brand'}`} />
              <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Time Slot</p>
              <h4 className="font-display font-bold text-lg leading-tight">{wave}</h4>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selectedWave && waveDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-brand text-xs font-bold uppercase mb-3 flex items-center gap-2">
                    <Building2 className="w-3 h-3" /> Included Divisions ({waveDetails.divisions.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {waveDetails.divisions.map(d => (
                      <span key={d} className="px-3 py-1 bg-slate-800 text-slate-200 rounded-full text-xs border border-slate-700">{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-brand text-xs font-bold uppercase mb-3 flex items-center gap-2">
                    <Users className="w-3 h-3" /> Included Units ({waveDetails.units.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {waveDetails.units.map(u => (
                      <span key={u} className="px-3 py-1 bg-slate-800 text-brand rounded-full text-xs border border-brand/20">{u}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Kingdoms Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 border-l-4 border-brand pl-3">
          <Crown className="w-5 h-5 text-brand" />
          Kingdoms & Teams
        </h3>
        <div className="flex flex-wrap gap-3">
          {kingdoms.map((k) => (
            <button
              key={k}
              onClick={() => {
                setSelectedKingdom(selectedKingdom === k ? null : k);
                setSelectedTeam(null);
              }}
              className={`px-6 py-3 rounded-xl border font-bold transition-all flex items-center gap-2 ${
                selectedKingdom === k 
                ? 'bg-brand text-slate-950 border-brand shadow-lg shadow-brand/20' 
                : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
              }`}
            >
              <Crown className="w-4 h-4" />
              Kingdom {k}
            </button>
          ))}
        </div>

        {/* Teams in Kingdom */}
        <AnimatePresence>
          {selectedKingdom && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4 pt-4"
            >
              <p className="text-slate-400 text-sm font-medium pl-1">Teams in Kingdom {selectedKingdom}:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {kingdomTeams.map(team => (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(selectedTeam === team ? null : team)}
                    className={`p-4 rounded-xl border transition-all text-center flex flex-col items-center gap-2 ${
                      selectedTeam === team
                      ? 'bg-brand/20 border-brand text-brand'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <TeamIcon name={team || ''} className="w-6 h-6" />
                    <span className="text-sm font-bold">{team}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Members */}
        <AnimatePresence>
          {selectedTeam && teamMembers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden mt-6"
            >
              <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TeamIcon name={selectedTeam} className="w-5 h-5 text-brand" />
                  <h4 className="font-bold text-white">{selectedTeam} Members</h4>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
                  {teamMembers.length} Members
                </span>
              </div>
              <div className="divide-y divide-slate-800 max-h-[400px] overflow-y-auto custom-scrollbar">
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand font-bold text-sm">
                        {member["Employee Name"].charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{member["Employee Name"]}</p>
                        <p className="text-xs text-slate-400">{member["Title"]}</p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Unit</p>
                      <p className="text-sm text-brand/80 font-medium">{member["Unit"] || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<Employee | null>(null);
  const [empNumber, setEmpNumber] = useState('');
  const [foundEmployee, setFoundEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loginStep, setLoginStep] = useState<'id' | 'confirm'>('id');
  const [view, setViewmode] = useState<ViewMode>('portal');

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

  const handleCheckId = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const emp = employeeData.find(emp => 
      emp["Employee Number"] === empNumber.trim()
    );

    if (emp) {
      setFoundEmployee(emp as Employee);
      setLoginStep('confirm');
    } else {
      setError('Invalid Employee ID, please try again');
    }
  };

  const handleConfirmLogin = () => {
    if (foundEmployee) {
      setUser(foundEmployee);
      localStorage.setItem('employeeSession', JSON.stringify(foundEmployee));
    }
  };

  const handleCancel = () => {
    setLoginStep('id');
    setFoundEmployee(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeSession');
    setUser(null);
    setFoundEmployee(null);
    setEmpNumber('');
    setLoginStep('id');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand selection:text-slate-950">
      
      {/* Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-slate-900/80">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewmode('portal')}>
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center rotate-3 group overflow-hidden shadow-lg shadow-brand/10">
              <LayoutDashboard className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-display font-black text-xl text-white tracking-tight">WAVE<span className="text-brand">CENTER</span></span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => setViewmode('portal')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                view === 'portal' ? 'bg-brand text-slate-950 shadow-lg shadow-brand/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">My Portal</span>
            </button>
            <button 
              onClick={() => setViewmode('statistics')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                view === 'statistics' ? 'bg-brand text-slate-950 shadow-lg shadow-brand/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            
            {user && (
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <AnimatePresence mode="wait">
          {view === 'statistics' ? (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <StatisticsDashboard />
            </motion.div>
          ) : !user ? (
            <motion.div
              key="login-flow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <div className="w-full max-w-md">
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2">Welcome Back</h1>
                  <p className="text-slate-400">Enter your official employee ID to access your area</p>
                </div>

                <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 min-h-[320px] flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <WaveIcon className="w-40 h-40" />
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {loginStep === 'id' ? (
                      <motion.div
                        key="step-id"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative z-10"
                      >
                        <form onSubmit={handleCheckId} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-brand uppercase tracking-widest ml-1">Employee ID</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand transition-colors" />
                              <input
                                type="text"
                                required
                                value={empNumber}
                                onChange={(e) => setEmpNumber(e.target.value)}
                                placeholder="e.g. 4591"
                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border-2 border-slate-800 rounded-2xl focus:border-brand transition-all outline-none text-white text-lg font-bold"
                              />
                            </div>
                          </div>

                          {error && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-2 text-red-400 text-sm font-medium bg-red-400/10 p-4 rounded-xl border border-red-400/20"
                            >
                              <Info className="w-4 h-4 shrink-0" />
                              {error}
                            </motion.div>
                          )}

                          <button
                            type="submit"
                            className="w-full bg-brand hover:bg-white text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-brand/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                          >
                            VERIFY IDENTITY
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step-confirm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-8 relative z-10"
                      >
                        <div className="space-y-4">
                          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto text-brand border border-brand/20">
                            <User className="w-10 h-10" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2">IS THIS CORRECT?</p>
                            <h2 className="text-3xl font-display font-black text-white leading-tight">{foundEmployee?.["Employee Name"]}</h2>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                              <span className="px-3 py-1 bg-slate-800 text-brand rounded-lg text-xs font-black border border-brand/10 uppercase tracking-tighter">
                                Unit: {foundEmployee?.["Unit"] || "N/A"}
                              </span>
                              <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs font-black border border-slate-700 uppercase tracking-tighter">
                                Kingdom {foundEmployee?.["Kingdom"]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={handleConfirmLogin}
                            className="w-full bg-brand hover:bg-white text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-brand/20 transition-all active:scale-[0.98]"
                          >
                            YES, THAT'S ME
                          </button>
                          <button
                            onClick={handleCancel}
                            className="w-full text-slate-500 hover:text-white font-bold py-2 transition-colors flex items-center justify-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            WRONG ID, GO BACK
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pb-20"
            >
              {/* Profile Card Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 mb-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-brand/5 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="w-24 h-24 bg-brand rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl shadow-brand/20 rotate-3">
                    <User className="w-12 h-12" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-display font-black text-white tracking-tight leading-none uppercase">
                        {user["Employee Name"].split(' ')[0]} {user["Employee Name"].split(' ')[1]}
                      </h2>
                    </div>
                    <p className="text-brand font-black text-sm tracking-widest uppercase flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Kingdom {user["Kingdom"]} Official
                    </p>
                  </div>
                  
                  <div className="bg-slate-950/50 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl min-w-[200px]">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="font-bold text-sm">ACTIVE ASSIGNMENT</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-800">
                  <div className="space-y-1">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Job Title
                    </p>
                    <p className="text-white font-bold">{user["Title"]}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Building2 className="w-3 h-3" /> Division
                    </p>
                    <p className="text-white font-bold">{user["Division"]}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-3 h-3" /> Assigned Unit
                    </p>
                    <p className="text-white font-bold">{user["Unit"] || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Assignment Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-brand rounded-[2.5rem] p-8 text-slate-950 shadow-2xl relative overflow-hidden group h-full"
                >
                  <WaveIcon className="absolute -right-4 -bottom-4 w-40 h-40 opacity-20 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="bg-slate-950/10 w-fit p-3 rounded-2xl mb-4 backdrop-blur-sm">
                      <WaveIcon className="w-6 h-6" />
                    </div>
                    <p className="text-slate-950/60 text-xs font-black uppercase tracking-wider mb-2">Primary Wave Orientation</p>
                    <h3 className="text-3xl font-display font-black tracking-tight leading-tight">{user["Wave"]}</h3>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-900 rounded-[2.5rem] p-8 text-white border border-slate-800 relative overflow-hidden group h-full"
                >
                  <TeamIcon name={user["Team"]} className="absolute -right-4 -bottom-4 w-40 h-40 text-brand/5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="bg-brand/10 w-fit p-3 rounded-2xl mb-4 text-brand border border-brand/20">
                      <TeamIcon name={user["Team"]} className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-wider mb-2">Tactical Team Assignment</p>
                    <h3 className="text-4xl font-display font-black tracking-tight text-brand">{user["Team"]}</h3>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistence Info & Footer */}
      <footer className="max-w-5xl mx-auto px-4 mt-12 py-12 border-t border-slate-900 text-center space-y-4">
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Kingdoms</span>
            <span className="text-brand font-bold text-lg">10</span>
          </div>
          <div className="w-px h-8 bg-slate-900" />
          <div className="flex flex-col items-center">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Members</span>
            <span className="text-white font-bold text-lg">{employeeData.length}</span>
          </div>
          <div className="w-px h-8 bg-slate-900" />
          <div className="flex flex-col items-center">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Status</span>
            <span className="text-green-500 font-bold text-lg flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              LIVE
            </span>
          </div>
        </div>
        
        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
          Eva Pharma Wave Center &bull; Version 1.0.004
        </p>
      </footer>

      {/* Global CSS for scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ffc000; }
      `}</style>
    </div>
  );
}
