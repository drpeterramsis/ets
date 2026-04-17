import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import { sortWaves } from '../utils/waveUtils';

interface WaveStatsProps {
  employees: Employee[];
}

export const WaveStats: React.FC<WaveStatsProps> = ({ employees }) => {
  const allWaves = useMemo(() => 
    sortWaves(Array.from(new Set(employees.map(e => String(e.Wave))))),
    [employees]
  );
  const [selectedWaveId, setSelectedWaveId] = useState<string | null>(allWaves[0] || null);
  const [selectedTeam, setSelectedTeam] = useState<{kingdom: string, team: string, members: Employee[]} | null>(null);

  // Section A: Waves Summary
  const waveSummary = useMemo(() => {
    return allWaves.map(wave => {
      const wEmployees = employees.filter(e => String(e.Wave) === wave);
      const kingdoms = new Set(wEmployees.map(e => e.Kingdom));
      const teams = new Set(wEmployees.map(e => `${e.Kingdom}-${e.Team}`));
      return { wave, members: wEmployees.length, kingdoms: kingdoms.size, teams: teams.size };
    });
  }, [employees, allWaves]);

  // Section B: Breakdown Analysis
  const breakdownData = useMemo(() => {
    if (!selectedWaveId) return null;
    const wEmployees = employees.filter(e => String(e.Wave) === selectedWaveId);
    
    const table: Record<string, Record<string, Employee[]>> = {};
    wEmployees.forEach(e => {
      const k = String(e.Kingdom || 'Unknown');
      const t = String(e.Team || 'Unassigned');
      if (!table[k]) table[k] = {};
      if (!table[k][t]) table[k][t] = [];
      table[k][t].push(e);
    });

    return table;
  }, [employees, selectedWaveId]);

  const getTeamIcon = (team: string): string => {
    const t = team.toLowerCase();
    if (t.includes('electric')) return '⚡';
    if (t.includes('engineer')) return '⚙️';
    if (t.includes('gold')) return '🥇';
    if (t.includes('mushroom')) return '🍄';
    if (t.includes('plumb')) return '🔧';
    return '👥';
  };

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold text-[#ffc000]">📊 Wave Statistics</h2>
      
      {/* TOTAL EMPLOYEES CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#ffc000]/20 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:border-[#ffc000]/50">
          <div className="absolute top-0 right-0 p-8 bg-[#ffc000]/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125" />
          <p className="text-[#888888] text-[9px] uppercase tracking-[0.3em] font-black mb-1">System Records</p>
          <p className="text-5xl font-black text-black dark:text-white tracking-tighter">
            {employees.length}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[#ffc000]">
            <span className="text-[9px] font-bold uppercase tracking-widest">Registered Employees</span>
          </div>
        </div>
      </div>

      {/* SECTION A */}
      <div>
        <h3 className="font-bold text-lg mb-4">Summary by Wave</h3>
        <table className="w-full text-left border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr><th className="p-2">Wave</th><th className="p-2">Members</th><th className="p-2">Kingdoms</th><th className="p-2">Teams</th></tr>
          </thead>
          <tbody>
            {waveSummary.map(w => (
              <tr key={w.wave} onClick={() => setSelectedWaveId(w.wave)} className={`border-b cursor-pointer ${selectedWaveId === w.wave ? 'bg-[#ffc000]/20' : 'hover:bg-gray-50'}`}>
                <td className="p-2 font-bold">{w.wave}</td>
                <td className="p-2">{w.members}</td>
                <td className="p-2">{w.kingdoms}</td>
                <td className="p-2">{w.teams}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECTION B */}
      {selectedWaveId && breakdownData && (
        <div className="pt-4 border-t space-y-6">
          <h3 className="font-bold text-lg mb-4">Breakdown: Wave {selectedWaveId}</h3>
          {Object.entries(breakdownData).sort((a, b) => a[0].localeCompare(b[0], undefined, {numeric: true})).map(([k, teams]) => (
            <div key={k} className="border border-[#ffc000]/30 rounded-lg overflow-hidden">
               <div className="bg-[#ffc000]/10 p-2 font-bold text-[#ffc000] border-b border-[#ffc000]/30">Kingdom {k}</div>
               <table className="w-full text-left">
                  <thead className="text-gray-500 bg-gray-50 dark:bg-gray-800 text-xs uppercase">
                    <tr><th className="p-2">Team</th><th className="p-2">Members</th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(teams).sort((a, b) => a[0].localeCompare(b[0])).map(([t, members]) => (
                      <tr key={`${k}-${t}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer" onClick={() => setSelectedTeam({kingdom: k, team: t, members})}>
                        <td className="p-2 font-medium flex items-center gap-2">
                           {getTeamIcon(t)} 
                           {t}
                        </td>
                        <td className="p-2">{members.length}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Enhanced with Subtitles (Synced with SeatingMap) */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedTeam(null)}>
          <div className="bg-white dark:bg-[#1a1a1a] border-2 border-[#ffc000] rounded-2xl p-7 w-full max-w-[360px]" onClick={e => e.stopPropagation()}>
            <h4 className="text-[#ffc000] font-bold text-lg mb-1">{getTeamIcon(selectedTeam.team)} {selectedTeam.team}</h4>
            <div className="text-[#888888] text-[11px] mb-4 flex items-center gap-2">
              <span className="bg-[#ffc000]/10 text-[#ffc000] px-1.5 rounded">Kingdom {selectedTeam.kingdom}</span>
              <span>•</span>
              <span>Wave {(selectedWaveId || '').replace(/_/g, ' ⏰ ')}</span>
            </div>
            
            <div className="space-y-3 mb-6 mt-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {selectedTeam.members.map((m, i) => (
                <div key={i} className="flex flex-col py-3 px-3 rounded-xl border border-[rgba(255,192,0,0.1)] transition-all bg-[#f9f9f9] dark:bg-black/40">
                  <div className="flex items-center gap-2 font-bold text-[14px] text-black dark:text-white">
                    👤 {m["Employee Name"]}
                  </div>
                  <div className="text-[11px] font-medium opacity-60 ml-5 text-[#444444] dark:text-[#cccccc] mt-0.5 leading-tight">
                    {m["Title"]}{m["Unit"] ? ` • ${m["Unit"]}` : ''}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setSelectedTeam(null)} 
              className="w-full py-3 bg-[#ffc000] text-black font-black text-sm rounded-xl active:scale-95 transition-transform shadow-[0_5px_15px_rgba(255,192,0,0.3)]"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
