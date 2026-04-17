import { useState, useMemo } from 'react';
import { ChevronRight, Waves, Crown, Users, User, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Employee } from '../types';

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

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
        <button onClick={resetFromWave} className={`hover:text-[var(--accent-color)] ${!wave ? 'text-[var(--accent-color)]' : ''}`}>Waves</button>
        {wave && (
          <>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <button onClick={resetFromKingdom} className={`hover:text-[var(--accent-color)] ${!kingdom ? 'text-[var(--accent-color)]' : ''}`}>{formatWave(wave)}</button>
          </>
        )}
        {kingdom && (
          <>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <button onClick={() => setTeam(null)} className={`hover:text-[var(--accent-color)] ${!team ? 'text-[var(--accent-color)]' : ''}`}>Kingdom {kingdom}</button>
          </>
        )}
        {team && (
          <>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span className="text-[var(--accent-color)]">{team}</span>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!wave ? (
          <motion.div key="waves" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {uniqueWaves.map(w => (
              <button key={w} onClick={() => setWave(w)} className="group p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-left hover:border-[var(--accent-color)] hover:shadow-xl hover:shadow-[var(--accent-color)]/5 transition-all relative overflow-hidden">
                <Waves className="absolute -right-4 -bottom-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity" />
                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-tighter mb-1">Select Wave</p>
                <h4 className="font-display font-bold text-lg leading-tight">{formatWave(w)}</h4>
              </button>
            ))}
          </motion.div>
        ) : !kingdom ? (
          <motion.div key="kingdoms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <h3 className="text-xl font-display font-bold">Kingdoms in {formatWave(wave)}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredKingdoms.map(k => (
                <button key={k} onClick={() => setKingdom(k)} className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center gap-3 hover:border-[var(--accent-color)] hover:scale-[1.02] transition-all">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><Crown className="w-6 h-6" /></div>
                  <span className="font-bold">Kingdom {k}</span>
                </button>
              ))}
            </div>
            <button onClick={resetFromWave} className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><ArrowLeft className="w-4 h-4" /> Go back to Waves</button>
          </motion.div>
        ) : !team ? (
          <motion.div key="teams" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <h3 className="text-xl font-display font-bold">Teams in Kingdom {kingdom}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredTeams.map(t => (
                <button key={t} onClick={() => setTeam(t)} className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center gap-3 hover:border-[var(--accent-color)] hover:scale-[1.02] transition-all">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users className="w-6 h-6" /></div>
                  <span className="font-bold text-center leading-tight">{t}</span>
                </button>
              ))}
            </div>
            <button onClick={resetFromKingdom} className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Kingdoms</button>
          </motion.div>
        ) : (
          <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold">{team} Members</h3>
                <span className="bg-[var(--accent-color)] text-white text-[10px] font-black px-3 py-1 rounded-full">{filteredMembers.length} Members</span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {filteredMembers.map(m => (
                 <div key={m["Employee Number"]} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-3xl flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-[var(--input-bg)] flex items-center justify-center text-[var(--accent-color)] font-black">
                     {m["Employee Name"].charAt(0)}
                   </div>
                   <div>
                     <p className="font-bold leading-none mb-1">{m["Employee Name"]}</p>
                     <p className="text-[10px] text-[var(--text-secondary)] mb-1">{m.Title}</p>
                     <p className="text-[9px] font-black text-[var(--accent-color)]">ID: {m["Employee Number"]}</p>
                   </div>
                 </div>
               ))}
             </div>
             <button onClick={() => setTeam(null)} className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Teams</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
