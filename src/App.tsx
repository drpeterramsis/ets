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
  Hash,
  UserPlus,
  Save,
  Pencil,
  Trash2
} from 'lucide-react';

// Data and Types
import employeeData from './data/employees.json';
import type { Employee, ThemeMode } from './types';
import { saveToGitHub } from './utils/githubSync';

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
  
  // New States
  const [employees, setEmployees] = useState<Employee[]>(employeeData as Employee[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<Employee | null>(null);
  
  // Deduplication States
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<[string, Employee[]][]>([]);
  const [duplicateSelections, setDuplicateSelections] = useState<Record<string, number>>({});

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '', name: '', division: '', unit: '', title: '', wave: '', kingdom: '', team: ''
  });
  const [otherFields, setOtherFields] = useState({
    division: '', unit: '', title: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    
    // Auto Deduplication
    const rawData = employeeData as Employee[];
    const seen = new Map();
    let hasDuplicates = false;
    rawData.forEach(emp => {
      if (!seen.has(emp["Employee Number"])) {
        seen.set(emp["Employee Number"], emp);
      } else {
        hasDuplicates = true;
      }
    });
    
    if (hasDuplicates) {
      const deduplicatedEmployees = Array.from(seen.values());
      console.warn("⚠️ Duplicates removed:", rawData.length - deduplicatedEmployees.length);
      setEmployees(deduplicatedEmployees as Employee[]);
      saveToGitHub(deduplicatedEmployees as Employee[]).catch(console.error);
      setToast({ message: `⚠️ ${rawData.length - deduplicatedEmployees.length} duplicate records auto-removed`, type: 'success' });
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

  // Toast
  useEffect(() => {
    if (toast && toast.type !== 'loading') {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type });
  };

  // Extract unique values
  const uniqueDivisions = useMemo(() => Array.from(new Set(employees.map(e => e.Division))).sort(), [employees]);
  const uniqueUnits = useMemo(() => Array.from(new Set(employees.map(e => e.Unit))).sort(), [employees]);
  const uniqueTitles = useMemo(() => Array.from(new Set(employees.map(e => e.Title))).sort(), [employees]);
  const uniqueWaves = useMemo(() => Array.from(new Set(employees.map(e => e.Wave))).sort(), [employees]);
  const uniqueKingdoms = useMemo(() => Array.from(new Set(employees.map(e => String(e.Kingdom)))).sort((a,b)=>Number(a)-Number(b)), [employees]);

  const TEAMS = ['Electricians', 'Engineering', 'Gold', 'Mushroom', 'Plumber'];

  const getTeamLabel = (t: string) => {
    switch (t) {
      case 'Electricians': return '⚡ Electricians';
      case 'Engineering': return '⚙️ Engineering';
      case 'Gold': return '🥇 Gold';
      case 'Mushroom': return '🍄 Mushroom';
      case 'Plumber': return '🔧 Plumber';
      default: return t;
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({ id: '', name: '', division: '', unit: '', title: '', wave: '', kingdom: '', team: '' });
    setOtherFields({ division: '', unit: '', title: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (member: Employee) => {
    setEditingMember(member);
    
    setFormData({
      id: member["Employee Number"],
      name: member["Employee Name"],
      division: uniqueDivisions.includes(member.Division) ? member.Division : 'Other',
      unit: uniqueUnits.includes(member.Unit) ? member.Unit : 'Other',
      title: uniqueTitles.includes(member.Title) ? member.Title : 'Other',
      wave: member.Wave,
      kingdom: member.Kingdom,
      team: member.Team
    });
    
    setOtherFields({
      division: !uniqueDivisions.includes(member.Division) ? member.Division : '',
      unit: !uniqueUnits.includes(member.Unit) ? member.Unit : '',
      title: !uniqueTitles.includes(member.Title) ? member.Title : ''
    });
    
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openDeleteModal = (member: Employee) => {
    setDeletingMember(member);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingMember(null);
  };

  const confirmDeleteMember = async () => {
    if (!deletingMember) return;
    
    setIsSaving(true);
    showToast('Saving to GitHub...', 'loading');
    
    const updatedList = employees.filter(e => e["Employee Number"] !== deletingMember["Employee Number"]);
    setEmployees(updatedList);
    
    const result = await saveToGitHub(updatedList);
    setIsSaving(false);
    
    if (result.success) {
      showToast('Member deleted successfully ✅', 'success');
      closeDeleteModal();
    } else {
      showToast('Delete failed. Please try again ❌', 'error');
      // Revert if failed
      setEmployees(employees);
      closeDeleteModal();
    }
  };

  const handleCleanDuplicates = () => {
    const groups: Map<string, Employee[]> = new Map();
    employees.forEach(emp => {
      const id = emp["Employee Number"];
      if (!groups.has(id)) {
         groups.set(id, []);
      }
      groups.get(id)!.push(emp);
    });

    const dupes = Array.from(groups.entries()).filter(([id, arr]) => arr.length > 1);
    
    if (dupes.length === 0) {
      showToast("✅ No duplicates found. Data is clean!", "success");
      return;
    }
    
    setDuplicateGroups(dupes);
    
    const initialKeep: Record<string, number> = {};
    dupes.forEach(([id]) => {
      initialKeep[id] = 0;
    });
    setDuplicateSelections(initialKeep);
    
    setIsDuplicateModalOpen(true);
  };

  const confirmCleanDuplicates = async () => {
    setIsSaving(true);
    showToast('Saving to GitHub...', 'loading');
    
    const duplicateIds = new Set(duplicateGroups.map(g => g[0]));
    
    const cleanedEmployees = employees.filter(emp => {
      const id = emp["Employee Number"];
      if (duplicateIds.has(id)) {
        const group = duplicateGroups.find(g => g[0] === id)![1];
        const selectedIndex = duplicateSelections[id];
        return emp === group[selectedIndex];
      }
      return true;
    });
    
    setEmployees(cleanedEmployees);
    const result = await saveToGitHub(cleanedEmployees);
    setIsSaving(false);
    
    if (result.success) {
      showToast(`✅ Duplicates removed. Data cleaned!`, "success");
      setIsDuplicateModalOpen(false);
    } else {
      showToast("❌ Failed to save. Please try again.", "error");
      setEmployees(employees); // Revert
      setIsDuplicateModalOpen(false);
    }
  };

  const handleSaveMember = async () => {
    const errors: Record<string, string> = {};
    if (!formData.id) errors.id = 'ID is required';
    else if (!/^\d+$/.test(formData.id)) errors.id = 'ID must be numeric only';
    else if (!editingMember && employees.some(e => e["Employee Number"] === formData.id)) errors.id = '⚠️ This ID already exists';
    
    if (!formData.name) errors.name = 'Name is required';
    
    const finalDivision = formData.division === 'Other' ? otherFields.division : formData.division;
    if (!finalDivision) errors.division = 'Division is required';
    
    const finalUnit = formData.unit === 'Other' ? otherFields.unit : formData.unit;
    if (!finalUnit) errors.unit = 'Unit is required';
    
    const finalTitle = formData.title === 'Other' ? otherFields.title : formData.title;
    if (!finalTitle) errors.title = 'Title is required';
    
    if (!formData.wave) errors.wave = 'Wave is required';
    if (!formData.kingdom) errors.kingdom = 'Kingdom is required';
    if (!formData.team) errors.team = 'Team is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);
    showToast('Saving to GitHub...', 'loading');

    const newEmp: Employee = {
      "Employee Number": formData.id,
      "Employee Name": formData.name,
      Division: finalDivision,
      Unit: finalUnit,
      Title: finalTitle,
      Job: finalTitle, // duplicate for compatibility
      Wave: formData.wave,
      Kingdom: formData.kingdom,
      Team: formData.team
    };
    
    let updatedList;
    if (editingMember) {
      updatedList = employees.map(e => e["Employee Number"] === editingMember["Employee Number"] ? newEmp : e);
    } else {
      updatedList = [...employees, newEmp];
    }
    
    setEmployees(updatedList);
    
    const result = await saveToGitHub(updatedList);
    setIsSaving(false);
    
    if (result.success) {
      showToast('Member saved to GitHub successfully!', 'success');
      setIsModalOpen(false);
    } else {
      // Revert if failed, but prompt says "Saved locally only", let's keep local state.
      showToast('GitHub sync failed. Saved locally only.', 'error');
      setIsModalOpen(false);
    }
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
                  <Shield className="w-8 h-8 text-black" />
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
                        <button type="submit" className="w-full py-4 bg-[var(--accent-color)] text-black rounded-2xl font-black shadow-lg shadow-[var(--accent-color)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
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
                          <button onClick={confirmLogin} className="py-4 bg-[var(--accent-color)] text-black rounded-2xl font-black flex items-center justify-center gap-2 text-xs hover:bg-opacity-90">
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
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'drill' ? 'bg-[var(--accent-color)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                      >
                        <BarChart3 className="w-4 h-4" /> DRILL-DOWN
                     </button>
                     <button 
                        onClick={() => setActiveTab('search')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'search' ? 'bg-[var(--accent-color)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
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
                    <div className="mb-4 flex gap-3 flex-wrap">
                      <button 
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-[22px] py-[10px] bg-transparent border border-[#ffc000] rounded-full text-[#ffc000] font-display font-semibold text-[14px] hover:bg-[#ffc000]/10 transition-all cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" /> + Add New Member
                      </button>
                      <button 
                        onClick={handleCleanDuplicates}
                        className="flex items-center gap-2 px-[22px] py-[10px] bg-transparent border border-[rgba(239,68,68,0.4)] rounded-full text-[#ef4444] font-display font-semibold text-[14px] hover:bg-[rgba(239,68,68,0.08)] hover:border-[#ef4444] transition-all cursor-pointer"
                      >
                        🧹 Clean Duplicates
                      </button>
                    </div>
                    <AnimatePresence mode="wait">
                      {activeTab === 'drill' ? (
                       <motion.div key="drill" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          <div className="space-y-6">
                             <div className="pl-2">
                                <h3 className="text-xl font-display font-black tracking-tight">Wave Drill-Down</h3>
                                <p className="text-sm text-[var(--text-secondary)]">Browse institutional structure from Wave to individual Teams.</p>
                             </div>
                             <DrillDown data={employees} onEdit={openEditModal} onDelete={openDeleteModal} userRole={user.role} />
                          </div>
                       </motion.div>
                    ) : (
                      <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          <div className="space-y-6">
                             <div className="pl-2">
                                <h3 className="text-xl font-display font-black tracking-tight">Database Search</h3>
                                <p className="text-sm text-[var(--text-secondary)]">Search across all employee records with specific filters.</p>
                             </div>
                             <SearchEngine data={employees} onEdit={openEditModal} onDelete={openDeleteModal} userRole={user.role} />
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

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`fixed top-6 left-1/2 z-[99999] bg-[#1a1a1a] rounded-[12px] px-[22px] py-[14px] font-display text-[13px] text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[280px] text-center border ${
              toast.type === 'success' ? 'border-[#22c55e]' : toast.type === 'error' ? 'border-[#ef4444]' : 'border-[#ffc000]'
            }`}
          >
            {toast.type === 'success' && '✅ '}
            {toast.type === 'error' && '❌ '}
            {toast.type === 'loading' && '⏳ '}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[#ffc000] rounded-2xl p-8 w-full min-w-[300px] max-w-[520px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.5)] custom-scrollbar">
            <h2 className="text-[#ffc000] font-display text-[20px] font-bold mb-6 flex items-center gap-2">
              {editingMember ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </h2>
            
            <div className="space-y-4">
              {/* Field 1 - ID */}
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-black dark:text-[#ffc000] mb-[6px]">
                  Employee ID{editingMember && ' (Read Only)'}
                </label>
                <input 
                  type="text" 
                  value={formData.id}
                  disabled={!!editingMember}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  placeholder="e.g. 12345"
                  className={`w-full text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10 ${editingMember ? 'bg-[#e0e0e0] dark:bg-[#0a0a0a] !text-[#888888] cursor-not-allowed' : 'bg-[var(--input-bg)]'}`}
                />
                {editingMember && <p className="text-[10px] text-[#888888] mt-1">ID cannot be changed</p>}
                {formErrors.id && <p className="text-[#ef4444] text-[11px] mt-1">{formErrors.id}</p>}
              </div>

              {/* Field 2 - Name */}
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-black dark:text-[#ffc000] mb-[6px]">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Employee full name"
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10"
                />
                {formErrors.name && <p className="text-[#ef4444] text-[11px] mt-1">{formErrors.name}</p>}
              </div>

              {/* Field 3 - Division */}
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-black dark:text-[#ffc000] mb-[6px]">
                  Division
                </label>
                <select 
                  value={formData.division}
                  onChange={(e) => setFormData({...formData, division: e.target.value})}
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10"
                >
                  <option value="">Select Division...</option>
                  {uniqueDivisions.map(d => <option key={d} value={d}>{d}</option>)}
                  <option value="Other">✏️ Other (type manually)</option>
                </select>
                {formData.division === 'Other' && (
                  <input type="text" placeholder="Type division name" value={otherFields.division} onChange={e => setOtherFields({...otherFields, division: e.target.value})} className="mt-2 w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10" />
                )}
                {formErrors.division && <p className="text-[#ef4444] text-[11px] mt-1">{formErrors.division}</p>}
              </div>

              {/* Field 4 - Unit */}
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-black dark:text-[#ffc000] mb-[6px]">
                  Unit
                </label>
                <select 
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10"
                >
                  <option value="">Select Unit...</option>
                  {uniqueUnits.map(u => <option key={u} value={u}>{u}</option>)}
                  <option value="Other">✏️ Other (type manually)</option>
                </select>
                {formData.unit === 'Other' && (
                  <input type="text" placeholder="Type unit name" value={otherFields.unit} onChange={e => setOtherFields({...otherFields, unit: e.target.value})} className="mt-2 w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10" />
                )}
                {formErrors.unit && <p className="text-[#ef4444] text-[11px] mt-1">{formErrors.unit}</p>}
              </div>

              {/* Field 5 - Title */}
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-black dark:text-[#ffc000] mb-[6px]">
                  Title / Job Title
                </label>
                <select 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10"
                >
                  <option value="">Select Title...</option>
                  {uniqueTitles.map(t => <option key={t} value={t}>{t}</option>)}
                  <option value="Other">✏️ Other (type manually)</option>
                </select>
                {formData.title === 'Other' && (
                  <input type="text" placeholder="Type job title" value={otherFields.title} onChange={e => setOtherFields({...otherFields, title: e.target.value})} className="mt-2 w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10" />
                )}
                {formErrors.title && <p className="text-[#ef4444] text-[11px] mt-1">{formErrors.title}</p>}
              </div>

              {/* Field 6 - Wave */}
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-black dark:text-[#ffc000] mb-[6px]">
                  Wave
                </label>
                <select 
                  value={formData.wave}
                  onChange={(e) => setFormData({...formData, wave: e.target.value})}
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10"
                >
                  <option value="">Select Wave...</option>
                  {uniqueWaves.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                {formErrors.wave && <p className="text-[#ef4444] text-[11px] mt-1">{formErrors.wave}</p>}
              </div>

              {/* Field 7 - Kingdom */}
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-black dark:text-[#ffc000] mb-[6px]">
                  Kingdom
                </label>
                <select 
                  value={formData.kingdom}
                  onChange={(e) => setFormData({...formData, kingdom: e.target.value})}
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10"
                >
                  <option value="">Select Kingdom...</option>
                  {uniqueKingdoms.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                {formErrors.kingdom && <p className="text-[#ef4444] text-[11px] mt-1">{formErrors.kingdom}</p>}
              </div>

              {/* Field 8 - Team */}
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-black dark:text-[#ffc000] mb-[6px]">
                  Team
                </label>
                <select 
                  value={formData.team}
                  onChange={(e) => setFormData({...formData, team: e.target.value})}
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[#ffc000]/30 rounded-lg px-3.5 py-2.5 font-display text-[14px] focus:border-[#ffc000] focus:outline-none focus:ring-[3px] focus:ring-[#ffc000]/10"
                >
                  <option value="">Select Team...</option>
                  {TEAMS.map(t => <option key={t} value={t}>{getTeamLabel(t)}</option>)}
                </select>
                {formErrors.team && <p className="text-[#ef4444] text-[11px] mt-1">{formErrors.team}</p>}
              </div>
            </div>

            <div className="flex flex-row justify-between mt-7">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-transparent border border-[#ffc000]/40 text-[#ffc000] rounded-lg px-6 py-2.5 hover:bg-[#ffc000]/10 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveMember}
                className="flex items-center gap-2 bg-[#ffc000] text-black font-bold rounded-lg px-6 py-2.5 hover:bg-[#e6ac00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : editingMember ? 'Save Changes' : 'Save Member'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingMember && (
        <div className="fixed inset-0 z-[9999] bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[#ef4444] rounded-2xl p-8 w-full min-w-[300px] max-w-[420px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <Trash2 className="w-12 h-12 text-[#ef4444] mx-auto" />
            <h2 className="text-[#000000] dark:text-[#ffffff] font-display text-[20px] font-bold mt-4">
              Delete Member?
            </h2>
            <div className="my-3">
              <span className="font-bold text-[#ffc000]">{deletingMember["Employee Name"]}</span><br />
              <span className="text-[13px] text-[#888888]">(ID: {deletingMember["Employee Number"]})</span>
            </div>
            <p className="text-[13px] text-[#888888] mb-6 whitespace-pre-line">
              This action cannot be undone.{"\n"}The member will be permanently removed from the system.
            </p>
            <div className="flex flex-row justify-center gap-3">
              <button 
                onClick={closeDeleteModal}
                className="bg-transparent border border-[#ffc000]/40 text-[#ffc000] rounded-lg px-7 py-2.5 hover:bg-[#ffc000]/10 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteMember}
                className="flex items-center justify-center gap-2 bg-[#ef4444] text-[#ffffff] font-bold rounded-lg px-7 py-2.5 hover:bg-[#dc2626] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                <Trash2 className="w-4 h-4" />
                {isSaving ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Review Modal */}
      {isDuplicateModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[#ffc000] rounded-2xl p-8 w-full max-w-[620px] max-h-[85vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.5)] custom-scrollbar">
             <div className="flex items-center gap-2 mb-2">
                 <span className="text-2xl">🧹</span>
                 <h2 className="text-[#ffc000] font-display text-[20px] font-bold">Duplicate Records Found</h2>
             </div>
             <p className="text-[13px] text-[#888888] mb-6">
                {duplicateGroups.length} duplicate IDs detected. Choose which record to KEEP for each.
             </p>
             
             <div className="space-y-4">
               {duplicateGroups.map(([id, group]) => (
                  <div key={id} className="border border-[rgba(255,192,0,0.2)] rounded-xl p-4 bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)]">
                     <h3 className="text-[12px] font-bold text-[#ffc000] mb-3">ID: {id} — {group.length} copies found</h3>
                     <div className="space-y-2">
                        {group.map((emp, idx) => {
                           const isSelected = duplicateSelections[id] === idx;
                           return (
                             <div 
                               key={idx}
                               onClick={() => setDuplicateSelections({ ...duplicateSelections, [id]: idx })}
                               className={`flex items-center gap-3 p-2.5 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-[#ffc000] bg-[rgba(255,192,0,0.12)] dark:bg-[rgba(255,192,0,0.08)]' : 'border-[rgba(255,255,255,0.08)] bg-transparent'}`}
                             >
                               <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#ffc000] bg-[#ffc000]' : 'border-[#888888]'}`}>
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="font-bold text-[14px] text-black dark:text-white truncate">
                                    {emp["Employee Name"]}
                                  </div>
                                  <div className="text-[11px] text-[#888888] truncate mt-0.5">
                                    {emp.Division} • {emp.Unit} • {emp.Title}
                                  </div>
                                  <div className="text-[11px] text-[#888888] truncate">
                                    {emp.Wave} • 🏰 {emp.Kingdom} • Team {emp.Team}
                                  </div>
                               </div>
                               <div className="text-[10px] text-[#888888] bg-[rgba(255,255,255,0.05)] rounded px-2 py-0.5 flex-shrink-0">
                                 Record {idx + 1}
                               </div>
                             </div>
                           );
                        })}
                     </div>
                  </div>
               ))}
             </div>
             
             <div className="flex flex-row justify-between mt-6">
                <button 
                  onClick={() => setIsDuplicateModalOpen(false)}
                  className="bg-transparent border border-[#ffc000]/40 text-[#ffc000] rounded-lg px-6 py-2.5 hover:bg-[#ffc000]/10 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmCleanDuplicates}
                  className="flex items-center gap-2 bg-[#ffc000] text-black font-bold rounded-lg px-6 py-2.5 hover:bg-[#e6ac00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  <Trash2 className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Keep Selected & Remove Duplicates'}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
