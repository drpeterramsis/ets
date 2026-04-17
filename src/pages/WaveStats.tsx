import React, { useState, useMemo } from 'react';
import { Employee } from '../types';

interface WaveStatsProps {
  employees: Employee[];
}

export const WaveStats: React.FC<WaveStatsProps> = ({ employees }) => {
  const allWaves = useMemo(() => Array.from(new Set(employees.map(e => String(e.Wave)))).sort((a,b)=>a.localeCompare(b)), [employees]);
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

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold text-[#ffc000]">📊 Wave Statistics</h2>
      
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
          {Object.entries(breakdownData).sort().map(([k, teams]) => (
            <div key={k} className="border border-[#ffc000]/30 rounded-lg overflow-hidden">
               <div className="bg-[#ffc000]/10 p-2 font-bold text-[#ffc000] border-b border-[#ffc000]/30">Kingdom {k}</div>
               <table className="w-full text-left">
                  <thead className="text-gray-500 bg-gray-50 dark:bg-gray-800 text-xs uppercase">
                    <tr><th className="p-2">Team</th><th className="p-2">Members</th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(teams).sort().map(([t, members]) => (
                      <tr key={`${k}-${t}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer" onClick={() => setSelectedTeam({kingdom: k, team: t, members})}>
                        <td className="p-2 font-medium flex items-center gap-2">
                           {/* Team Icon (helper function defined in SeatingMap usually, but added inline here for simplicity) */}
                           {t === 'Electricians' ? '⚡' : t === 'Engineering' ? '⚙️' : t === 'Gold' ? '🥇' : t === 'Mushroom' ? '🍄' : t === 'Plumber' ? '🔧' : '👥'} 
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

      {/* Modal - Names Only */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={() => setSelectedTeam(null)}>
          <div className="bg-white dark:bg-[#111111] border-2 border-[#ffc000] rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h4 className="text-[#ffc000] font-bold">Team — Kingdom {selectedTeam.kingdom} — Wave {selectedWaveId}</h4>
            <div className="space-y-1 mb-4 my-4">
              {selectedTeam.members.map((m, i) => <div key={i} className="p-2 rounded text-sm text-gray-800 dark:text-gray-200">👤 {m["Employee Name"]}</div>)}
            </div>
            <button onClick={() => setSelectedTeam(null)} className="w-full py-2 bg-[#ffc000] text-black font-bold rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
