import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import { sortWaves } from '../utils/waveUtils';
import { Pencil, Trash2 } from 'lucide-react';

interface SeatingMapProps {
  employees: Employee[];
  loggedInEmployee: Employee | null;
  userRole: string;
  onEdit?: (member: Employee) => void;
  onDelete?: (member: Employee) => void;
}

const getTeamIcon = (team: string): string => {
  const t = team.toLowerCase();
  if (t.includes('electric')) return '⚡';
  if (t.includes('engineer')) return '⚙️';
  if (t.includes('gold')) return '🥇';
  if (t.includes('mushroom')) return '🍄';
  if (t.includes('plumb')) return '🔧';
  return '👥';
};

export const SeatingMap: React.FC<SeatingMapProps> = ({ employees, loggedInEmployee, userRole, onEdit, onDelete }) => {
  const allWaves = useMemo(() => 
    sortWaves(Array.from(new Set(employees.map(e => String(e.Wave))))),
    [employees]
  );

  // Role-based logic for wave selection
  const isFacilitator = userRole === 'facilitator';
  const [selectedWave, setSelectedWave] = useState<string>(
    isFacilitator ? allWaves[0] || '' : String(loggedInEmployee?.Wave || '')
  );

  const [selectedTeam, setSelectedTeam] = useState<{kingdom: string, team: string, members: Employee[]} | null>(null);

  const waveEmployees = useMemo(() => 
    employees.filter(e => String(e.Wave) === selectedWave), 
    [employees, selectedWave]
  );

  const groupedData = useMemo(() => {
    const groups: Record<string, Record<string, Employee[]>> = {};
    waveEmployees.forEach(emp => {
      const k = String(emp.Kingdom || 'Unknown');
      const t = String(emp.Team || 'Unassigned');
      if (!groups[k]) groups[k] = {};
      if (!groups[k][t]) groups[k][t] = [];
      groups[k][t].push(emp);
    });
    return groups;
  }, [waveEmployees]);

  const kingdomNames = Object.keys(groupedData).sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));

  if (!loggedInEmployee) {
    return <div className="p-4 text-center text-gray-500">Your seating assignment is not available yet</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-[#ffc000]">🗺️ Visual Seating Map</h2>

      {isFacilitator && (
         <div className="flex flex-wrap gap-2 mb-4">
           {allWaves.map(wave => (
             <button
               key={wave}
               onClick={() => setSelectedWave(wave)}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedWave === wave ? 'bg-[#ffc000] text-black shadow-[0_0_15px_rgba(255,192,0,0.3)]' : 'bg-black/10 dark:bg-white/5 border border-[#ffc000]/20 text-[#ffc000] hover:bg-[#ffc000]/10'}`}
             >
               {wave.replace(/_/g, ' ⏰ ')}
             </button>
           ))}
         </div>
      )}

      {/* Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kingdomNames.map(kingdom => (
          <div key={kingdom} className="border-2 border-[#ffc000]/20 rounded-xl p-3 bg-gray-50 dark:bg-black/20">
            <h3 className="font-bold text-[#ffc000] mb-2 text-sm">Kingdom {kingdom}</h3>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(groupedData[kingdom]).sort((a,b) => a[0].localeCompare(b[0])).map(([team, rawMembers]) => {
                const members = rawMembers as Employee[];
                const isUserTable = loggedInEmployee && members.some(m => m["Employee Number"] === loggedInEmployee["Employee Number"]);
                
                // Click rules: Facilitator clicks ALL. Employee/Superuser click ONLY YOUR TABLE.
                const isClickable = isFacilitator || isUserTable;
                
                return (
                  <div
                    key={team}
                    onClick={() => isClickable && setSelectedTeam({ kingdom, team, members })}
                    className={`p-3 rounded-lg border-2 text-center text-xs relative flex flex-col items-center justify-center ${isUserTable ? 'border-[#ffc000] shadow-[0_0_20px_rgba(255,192,0,0.18)] bg-white dark:bg-gray-800' : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900'} ${isClickable ? 'cursor-pointer hover:border-[#ffc000]/50' : 'cursor-default'}`}
                  >
                    {isUserTable && <div className="absolute top-0 right-0 bg-[#ffc000] text-black text-[9px] font-bold px-1 rounded-bl">YOU</div>}
                    <div className="text-xl mb-1">{getTeamIcon(team)}</div>
                    <div className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-[10px] font-bold">{(members as Employee[]).length}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Enhanced with Subtitles */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedTeam(null)}>
          <div className="bg-white dark:bg-[#1a1a1a] border-2 border-[#ffc000] rounded-2xl p-7 w-full max-w-[360px]" onClick={e => e.stopPropagation()}>
            <h4 className="text-[#ffc000] font-bold text-lg mb-1">{getTeamIcon(selectedTeam.team)} {selectedTeam.team}</h4>
            <div className="text-[#888888] text-[11px] mb-4 flex items-center gap-2">
              <span className="bg-[#ffc000]/10 text-[#ffc000] px-1.5 rounded">Kingdom {selectedTeam.kingdom}</span>
              <span>•</span>
              <span>Wave {selectedWave.replace(/_/g, ' ⏰ ')}</span>
            </div>
            
            <div className="space-y-3 mb-6 mt-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {selectedTeam.members.map((m, i) => {
                const isLevel2 = String(m.Level) === '2';
                return (
                  <div key={i} className={`flex flex-col py-3 px-3 rounded-xl border border-[rgba(255,192,0,0.1)] transition-all ${loggedInEmployee && m["Employee Number"] === loggedInEmployee["Employee Number"] ? 'bg-[#ffc000]/10 border-[#ffc000]/30 ring-1 ring-[#ffc000]/20' : 'bg-[#f9f9f9] dark:bg-black/40'} relative group/member`}>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 font-bold text-[14px] ${loggedInEmployee && m["Employee Number"] === loggedInEmployee["Employee Number"] ? 'text-[#ffc000]' : isLevel2 ? 'text-blue-500 dark:text-blue-400' : 'text-black dark:text-white'}`}>
                        {loggedInEmployee && m["Employee Number"] === loggedInEmployee["Employee Number"] ? '★' : '👤'} {m["Employee Name"]}
                      </div>
                      
                      {/* Facilitator actions */}
                      {userRole === 'facilitator' && onEdit && onDelete && (
                        <div className="flex gap-1 opacity-0 group-hover/member:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(m); }}
                            className="p-1 hover:bg-[#ffc000]/10 rounded text-[#ffc000] transition-colors"
                            title="Edit Member"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(m); }}
                            className="p-1 hover:bg-red-500/10 rounded text-red-500 transition-colors"
                            title="Delete Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={`text-[11px] font-medium opacity-60 ml-5 ${isLevel2 ? 'text-blue-600 dark:text-blue-300' : 'text-[#444444] dark:text-[#cccccc]'} mt-0.5 leading-tight`}>
                      {m["Title"]}{m["Unit"] ? ` • ${m["Unit"]}` : ''}
                      {isLevel2 && <span className="ml-2 px-1 bg-blue-500/10 rounded text-[9px] font-black uppercase tracking-tighter">Level 2</span>}
                    </div>
                  </div>
                );
              })}
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
