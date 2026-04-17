import React, { useState, useMemo } from 'react';
import { Employee } from '../types';

interface WaveStatsProps {
  employees: Employee[];
}

export const WaveStats: React.FC<WaveStatsProps> = ({ employees }) => {
  const allWaves = useMemo(() => Array.from(new Set(employees.map(e => String(e.Wave)))).sort(), [employees]);
  const [selectedWave, setSelectedWave] = useState(allWaves[0] || '');
  const [selectedTeam, setSelectedTeam] = useState<{kingdom: string, team: string, members: Employee[]} | null>(null);

  const waveData = useMemo(() => employees.filter(e => String(e.Wave) === selectedWave), [employees, selectedWave]);
  
  const stats = useMemo(() => {
    const kingdoms = new Set<string>();
    const teams = new Set<string>();
    const table: Record<string, Record<string, Employee[]>> = {};

    waveData.forEach(e => {
      const k = String(e.Kingdom);
      const t = String(e.Team);
      kingdoms.add(k);
      teams.add(t);
      if (!table[k]) table[k] = {};
      if (!table[k][t]) table[k][t] = [];
      table[k][t].push(e);
    });

    return { total: waveData.length, kingdomCount: kingdoms.size, teamCount: teams.size, table };
  }, [waveData]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-[#ffc000]">📊 Wave Statistics</h2>
      
      <div className="flex gap-2">
        {allWaves.map(w => (
          <button key={w} onClick={() => setSelectedWave(w)} className={`px-4 py-2 rounded ${selectedWave === w ? 'bg-[#ffc000] text-black' : 'bg-gray-200 dark:bg-gray-800'}`}>
            Wave {w}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[ {label: 'Members', val: stats.total}, {label: 'Kingdoms', val: stats.kingdomCount}, {label: 'Teams', val: stats.teamCount} ].map(s => (
          <div key={s.label} className="p-4 border rounded-xl text-center">
            <div className="text-2xl font-bold">{s.val}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Kingdom</th>
            <th className="p-2">Team</th>
            <th className="p-2">Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats.table).sort().map(([k, teams]) => 
            Object.entries(teams).sort().map(([t, members]) => (
              <tr key={`${k}-${t}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer" onClick={() => setSelectedTeam({kingdom: k, team: t, members})}>
                <td className="p-2">{k}</td>
                <td className="p-2">{t}</td>
                <td className="p-2">{members.length}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedTeam && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedTeam(null)}>
          <div className="bg-white dark:bg-[#111111] p-6 rounded-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-4">{selectedTeam.team}</h3>
            {selectedTeam.members.map(m => <div key={m["Employee Number"]} className="p-1 border-b">{m["Employee Name"]}</div>)}
            <button onClick={() => setSelectedTeam(null)} className="w-full mt-4 py-2 bg-[#ffc000] text-black font-bold rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
