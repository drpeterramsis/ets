import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'lucide-react';
import { Employee } from '../types';

interface SeatingMapProps {
  employees: Employee[];
  loggedInEmployee: Employee;
  userRole: string;
}

const getTeamIcon = (team: string): string => {
  const map: Record<string, string> = {
    'Electricians': '⚡',
    'Engineering': '⚙️',
    'Gold': '🥇',
    'Mushroom': '🍄',
    'Plumber': '🔧'
  };
  return map[team] || '👥';
};

export const SeatingMap: React.FC<SeatingMapProps> = ({ employees, loggedInEmployee, userRole }) => {
  const allWaves = useMemo(() => Array.from(new Set(employees.map(e => String(e.Wave)))).sort(), [employees]);
  const [selectedWave, setSelectedWave] = useState(String(loggedInEmployee.Wave));
  const [selectedTeam, setSelectedTeam] = useState<{kingdom: string, team: string, members: Employee[]} | null>(null);

  const waveEmployees = useMemo(() => 
    employees.filter(e => String(e.Wave) === selectedWave), 
    [employees, selectedWave]
  );

  const groupedData = useMemo(() => {
    const groups: Record<string, Record<string, Employee[]>> = {};
    waveEmployees.forEach(emp => {
      const k = String(emp.Kingdom);
      const t = String(emp.Team);
      if (!groups[k]) groups[k] = {};
      if (!groups[k][t]) groups[k][t] = [];
      groups[k][t].push(emp);
    });
    return groups;
  }, [waveEmployees]);

  const kingdomNames = Object.keys(groupedData).sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-[#ffc000]">🗺️ Visual Seating Map</h2>
      
      {/* Facilitator Wave Selector */}
      {(userRole === 'facilitator' || userRole === 'superuser') && (
        <div className="flex gap-2">
          {allWaves.map(wave => (
            <button
              key={wave}
              onClick={() => setSelectedWave(wave)}
              className={`px-4 py-2 rounded-lg text-sm font-bold ${selectedWave === wave ? 'bg-[#ffc000] text-black' : 'bg-transparent border border-[#ffc000]/30 text-[#ffc000]'}`}
            >
              Wave {wave}
            </button>
          ))}
        </div>
      )}

      {/* Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kingdomNames.map(kingdom => (
          <div key={kingdom} className="border-2 border-[#ffc000]/20 rounded-xl p-4 bg-gray-50 dark:bg-black/20">
            <h3 className="font-bold text-[#ffc000] mb-3">Kingdom {kingdom}</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(groupedData[kingdom]).sort((a,b) => a[0].localeCompare(b[0])).map(([team, members]) => {
                const isUserTable = members.some(m => m["Employee Number"] === loggedInEmployee["Employee Number"]);
                const isClickable = (userRole === 'facilitator' || userRole === 'superuser' || isUserTable);
                
                return (
                  <div
                    key={team}
                    onClick={() => isClickable && setSelectedTeam({ kingdom, team, members })}
                    className={`p-3 rounded-lg border-2 text-center text-xs relative ${isUserTable ? 'border-[#ffc000] shadow-[0_0_20px_rgba(255,192,0,0.18)] bg-white dark:bg-gray-800' : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900'} ${isClickable ? 'cursor-pointer hover:border-[#ffc000]/50' : 'cursor-default'}`}
                  >
                    {isUserTable && <div className="absolute top-0 right-0 bg-[#ffc000] text-black text-[9px] font-bold px-1 rounded-bl">YOU</div>}
                    <div className="text-lg">{getTeamIcon(team)}</div>
                    <div className="font-bold">{team}</div>
                    <div className="text-[10px] text-gray-500">{members.length}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111111] border-2 border-[#ffc000] rounded-xl p-6 w-full max-w-sm">
            <h4 className="text-[#ffc000] font-bold">{getTeamIcon(selectedTeam.team)} {selectedTeam.team}</h4>
            <p className="text-gray-500 text-xs mb-4">Kingdom {selectedTeam.kingdom} — Wave {selectedWave}</p>
            <div className="space-y-1 mb-4">
              {selectedTeam.members.map((m, i) => (
                <div key={i} className={`p-2 rounded text-sm ${m["Employee Number"] === loggedInEmployee["Employee Number"] ? 'bg-[#ffc000]/20 text-[#ffc000] font-bold' : ''}`}>
                  {m["Employee Number"] === loggedInEmployee["Employee Number"] ? '★ ' : '👤 '} {m["Employee Name"]}
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedTeam(null)} className="w-full py-2 bg-[#ffc000] text-black font-bold rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
