import React, { useState, useMemo, useRef } from 'react';
import { ChevronRight, Waves, Crown, Users, ArrowLeft, Building, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Employee } from '../types';
import { getTeamIcon } from '../App';

interface DrillDownProps {
  data: Employee[];
  onEdit?: (member: Employee) => void;
  userRole?: string;
}

export const DrillDown = ({ data, onEdit, userRole }: DrillDownProps) => {
  const [wave, setWave] = useState<string | null>(null);
  const [kingdom, setKingdom] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const SWIPE_THRESHOLD = 80; // px
  const VERTICAL_LIMIT = 50; // px

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    touchEndY.current = e.changedTouches[0].clientY;

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = Math.abs(
      touchStartY.current - touchEndY.current
    );

    // diffX POSITIVE = finger moved LEFT = GO BACK
    if (diffX > SWIPE_THRESHOLD && diffY < VERTICAL_LIMIT) {
      handleSwipeBack();
    }
  };

  const handleSwipeBack = () => {
    if (team) {
      setTeam(null);        // Members → Teams
    } else if (kingdom) {
      setKingdom(null);     // Teams → Kingdoms
    } else if (wave) {
      setWave(null);        // Kingdoms → Waves
    }
  };

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

  const getWaveCount = (w: string) => data.filter(e => e.Wave === w).length;
  const getKingdomCount = (k: string) => data.filter(e => e.Wave === wave && e.Kingdom === k).length;
  const getTeamCount = (t: string) => data.filter(e => e.Wave === wave && e.Kingdom === kingdom && e.Team === t).length;

  const Badge = ({ count }: { count: number }) => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,192,0,0.15)] border border-[rgba(0,0,0,0.3)] dark:border-[rgba(255,192,0,0.4)] rounded-full text-black dark:text-[#ffc000] text-[11px] font-semibold">
      {count}
    </span>
  );

  const BackButton = ({ onClick, label }: { onClick: () => void, label: string }) => (
    <div className="flex flex-col gap-2">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 border-2 border-[rgba(0,0,0,0.3)] dark:border-[#ffc000] text-black dark:text-[#ffc000] rounded-full font-bold text-xs hover:bg-[rgba(0,0,0,0.07)] dark:hover:bg-[rgba(255,192,0,0.1)] transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {label}
      </motion.button>
      
      {/* Visual Swipe Hint */}
      <div className="hidden sm:hidden md:hidden lg:hidden" style={{ display: 'contents' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (hover: none) and (pointer: coarse) {
            .swipe-hint { display: block !important; }
          }
        ` }} />
        <p className="swipe-hint hidden text-[11px] text-[rgba(0,0,0,0.4)] dark:text-[rgba(255,192,0,0.4)] text-center font-medium">
          ← Swipe left to go back
        </p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, x: -10 }} 
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="hidden md:flex items-center gap-1 text-[10px] text-[rgba(0,0,0,0.3)] dark:text-[rgba(255,192,0,0.3)] pointer-events-none"
      >
        <ArrowLeft className="w-3 h-3" /> swipe hint text omitted for desktop
      </motion.div>
    </div>
  );

  return (
    <div 
      className="space-y-8"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Non-clickable Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#333333] dark:text-[rgba(255,192,0,0.7)] opacity-80">
        <span className="flex items-center gap-1.5">🌊 Waves</span>
        {wave && (
          <>
            <ChevronRight className="w-3 h-3 text-[#666666] dark:text-[rgba(255,192,0,0.4)]" />
            <span className="flex items-center gap-1.5">{formatWave(wave)}</span>
          </>
        )}
        {kingdom && (
          <>
            <ChevronRight className="w-3 h-3 text-[#666666] dark:text-[rgba(255,192,0,0.4)]" />
            <span className="flex items-center gap-1.5">🏰 Kingdom {kingdom}</span>
          </>
        )}
        {team && (
          <>
            <ChevronRight className="w-3 h-3 text-[#666666] dark:text-[rgba(255,192,0,0.4)]" />
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
                className="group p-6 bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,192,0,0.07)] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,192,0,0.25)] rounded-3xl text-left hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,192,0,0.15)] hover:shadow-xl hover:shadow-[#ffc000]/5 transition-all relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 z-10">
                  <Badge count={getWaveCount(w)} />
                </div>
                <Waves className="absolute -right-4 -bottom-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity" />
                <p className="text-[10px] font-black text-black dark:text-[#ffc000] uppercase tracking-tighter mb-1">Select Wave</p>
                <h4 className="font-display font-bold text-lg leading-tight text-black dark:text-[#ffffff]">{formatWave(w)}</h4>
              </motion.button>
            ))}
          </motion.div>
        ) : !kingdom ? (
          <motion.div key="kingdoms" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <BackButton onClick={resetFromWave} label="Back to Waves" />
            </div>
            <h3 className="text-xl font-display font-bold text-black dark:text-[#ffffff]">Kingdoms in {formatWave(wave)}</h3>
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
                  className="p-5 bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,192,0,0.07)] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,192,0,0.25)] rounded-2xl flex flex-col items-center gap-3 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,192,0,0.15)] transition-all relative"
                >
                  <div className="absolute top-2 right-2">
                    <Badge count={getKingdomCount(k)} />
                  </div>
                  <div className="p-3 bg-[var(--accent-color)]/10 rounded-xl text-[var(--accent-color)]"><Crown className="w-6 h-6" /></div>
                  <span className="font-bold text-black dark:text-[#ffffff]">Kingdom {k}</span>
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
            <h3 className="text-xl font-display font-bold text-black dark:text-[#ffffff]">Teams in Kingdom {kingdom}</h3>
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
                  className="p-5 bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,192,0,0.07)] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,192,0,0.25)] rounded-2xl flex flex-col items-center gap-3 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,192,0,0.15)] transition-all relative"
                >
                  <div className="absolute top-2 right-2">
                    <Badge count={getTeamCount(t)} />
                  </div>
                  <div className="p-3 bg-[var(--accent-color)]/10 rounded-xl text-[var(--accent-color)]">
                    <span className="text-2xl">{getTeamIcon(t)}</span>
                  </div>
                  <span className="font-bold text-center leading-tight text-black dark:text-[#ffffff]">{t}</span>
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
                <h3 className="text-xl font-display font-bold text-black dark:text-[#ffffff]">{getTeamIcon(team)} {team} Members</h3>
                <span className="bg-[var(--accent-color)] text-black text-[10px] font-black px-3 py-1 rounded-full">{filteredMembers.length} Members</span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {filteredMembers.map((m, idx) => (
                 <motion.div 
                   key={m["Employee Number"]} 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: idx * 0.03 }}
                   className="bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,192,0,0.05)] border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,192,0,0.2)] p-5 rounded-3xl flex flex-col gap-3"
                 >
                   <div className="flex items-center gap-4 border-b border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,192,0,0.2)] pb-3 relative">
                     <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[var(--bg-main)] flex items-center justify-center text-black dark:text-[#ffc000] font-black border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,192,0,0.2)]">
                       {m["Employee Name"].charAt(0)}
                     </div>
                     <h4 className="font-black text-lg leading-tight text-black dark:text-white pr-8">{m["Employee Name"]}</h4>
                     {(userRole === 'facilitator' || userRole === 'superuser') && onEdit && (
                       <button
                         onClick={() => onEdit(m)}
                         title="Edit member"
                         className="absolute top-0 right-0 w-[30px] h-[30px] bg-transparent border border-[rgba(255,192,0,0.3)] rounded-md flex items-center justify-center text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,192,0,0.6)] hover:border-[#ffc000] hover:text-[#000000] dark:hover:text-[#ffc000] transition-all duration-200"
                       >
                         <Pencil className="w-4 h-4" />
                       </button>
                     )}
                   </div>
                   <div className="space-y-1 text-xs font-bold leading-relaxed">
                     <p><span className="text-black dark:text-[#ffc000]">Division:</span> <span className="text-[#111111] dark:text-white">{m.Division}</span></p>
                     <p><span className="text-black dark:text-[#ffc000]">Unit:</span> <span className="text-[#111111] dark:text-white">{m.Unit}</span></p>
                     <p><span className="text-black dark:text-[#ffc000]">Title:</span> <span className="text-[#111111] dark:text-white">{m.Title}</span></p>
                     <p><span className="text-black dark:text-[#ffc000]">ID:</span> <span className="text-[#111111] dark:text-white">{m["Employee Number"]}</span></p>
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
