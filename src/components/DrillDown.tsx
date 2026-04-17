import { useState, useMemo } from 'react';
import { ChevronRight, Waves, Crown, Users, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Employee } from '../types';
import { getTeamIcon } from '../App';

interface DrillDownProps {
  data: Employee[];
}

export const DrillDown = ({ data }: DrillDownProps) => {
  const [wave, setWave] = useState<string | null>(null);
  const [kingdom, setKingdom] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);

  const uniqueWaves = useMemo(() => Array.from(new Set(data.map(e => e.Wave))), [data]);
  
  const filteredKingdoms = useMemo(() => {
    if (!wave) return [];
    return Array.from(new Set(data.filter(e => e.Wave === wave).map(e => e.Kingdom)));
  }, [wave, data]);

  const filteredTeams = useMemo(() => {
    if (!wave || !kingdom) return [];
    return Array.from(new Set(data.filter(e => e.Wave === wave && e.Kingdom === kingdom).map(e => e.Team)));
  }, [wave, kingdom, data]);

  const filteredMembers = useMemo(() => {
    if (!wave || !kingdom || !team) return [];
    return data.filter(e => e.Wave === wave && e.Kingdom === kingdom && e.Team === team);
  }, [wave, kingdom, team, data]);

  const formatWave = (w: string) => w.replace(/_/g, '⏰');

  const resetFromWave = () => { setWave(null); setKingdom(null); setTeam(null); };
  const resetFromKingdom = () => { setKingdom(null); setTeam(null); };

  const BackButton = ({ onClick, label }: { onClick: () => void, label: string }) => (
    <motion.button 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--accent-color)] text-[var(--accent-color)] rounded-full font-bold text-xs hover:bg-[var(--accent-color)] hover:text-black transition-all"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> {label}
    </motion.button>
  );

  return (
    <div className="space-y-8">
      {/* Non-clickable Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[var(--accent-color)] opacity-80">
        <span className="flex items-center gap-1.5">🌊 Waves</span>
        {wave && (
          <>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span className="flex items-center gap-1.5">{formatWave(wave)}</span>
          </>
        )}
        {kingdom && (
          <>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span className="flex items-center gap-1.5">🏰 Kingdom {kingdom}</span>
          </>
        )}
        {team && (
          <>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span className="flex items-center gap-1.5">{getTeamIcon(team)} {team}</span>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!wave ? (
          <motion.div 
            key="waves" 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {uniqueWaves.map((w, idx) => (
              <motion.button 
                key={w} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setWave(w)} 
                className="group p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-left hover:border-[var(--accent-color)] hover:shadow-xl hover:shadow-[var(--accent-color)]/5 transition-all relative overflow-hidden"
              >
                <Waves className="absolute -right-4 -bottom-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity" />
                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-tighter mb-1">Select Wave</p>
                <h4 className="font-display font-bold text-lg leading-tight">{formatWave(w)}</h4>
              </motion.button>
            ))}
          </motion.div>
        ) : !kingdom ? (
          <motion.div key="kingdoms" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <BackButton onClick={resetFromWave} label="Back to Waves" />
            </div>
            <h3 className="text-xl font-display font-bold">Kingdoms in {formatWave(wave)}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredKingdoms.map((k, idx) => (
                <motion.button 
                  key={k} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setKingdom(k)} 
                  className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center gap-3 hover:border-[var(--accent-color)] transition-all"
                >
                  <div className="p-3 bg-[var(--accent-color)]/10 rounded-xl text-[var(--accent-color)]"><Crown className="w-6 h-6" /></div>
                  <span className="font-bold">Kingdom {k}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : !team ? (
          <motion.div key="teams" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <BackButton onClick={resetFromWave} label="Back to Waves" />
              <BackButton onClick={resetFromKingdom} label="Back to Kingdoms" />
            </div>
            <h3 className="text-xl font-display font-bold">Teams in Kingdom {kingdom}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredTeams.map((t, idx) => (
                <motion.button 
                  key={t} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTeam(t)} 
                  className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center gap-3 hover:border-[var(--accent-color)] transition-all"
                >
                  <div className="p-3 bg-[var(--accent-color)]/10 rounded-xl text-[var(--accent-color)]">
                    <span className="text-2xl">{getTeamIcon(t)}</span>
                  </div>
                  <span className="font-bold text-center leading-tight">{t}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
             <div className="flex flex-wrap gap-2 mb-4">
                <BackButton onClick={resetFromWave} label="Back to Waves" />
                <BackButton onClick={resetFromKingdom} label="Back to Kingdoms" />
                <BackButton onClick={() => setTeam(null)} label="Back to Teams" />
             </div>
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold">{getTeamIcon(team)} {team} Members</h3>
                <span className="bg-[var(--accent-color)] text-black text-[10px] font-black px-3 py-1 rounded-full">{filteredMembers.length} Members</span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {filteredMembers.map((m, idx) => (
                 <motion.div 
                   key={m["Employee Number"]} 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: idx * 0.03 }}
                   className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-3xl flex flex-col gap-3"
                 >
                   <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-3">
                     <div className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] flex items-center justify-center text-[var(--accent-color)] font-black border border-[var(--border-color)]">
                       {m["Employee Name"].charAt(0)}
                     </div>
                     <h4 className="font-black text-lg leading-tight text-[var(--text-primary)]">{m["Employee Name"]}</h4>
                   </div>
                   <div className="space-y-1 text-xs font-bold leading-relaxed">
                     <p><span className="text-[var(--accent-color)]">Unit:</span> <span className="text-[var(--text-primary)] dark:text-white">{m.Unit}</span></p>
                     <p><span className="text-[var(--accent-color)]">Title:</span> <span className="text-[var(--text-primary)] dark:text-white">{m.Title}</span></p>
                     <p><span className="text-[var(--accent-color)]">ID:</span> <span className="text-[var(--text-primary)] dark:text-white">{m["Employee Number"]}</span></p>
                   </div>
                 </motion.div>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
