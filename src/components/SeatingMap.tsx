import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, ChevronDown, X } from 'lucide-react';
import { Employee } from '../types';

interface SeatingMapProps {
  employees: Employee[];
  loggedInEmployee: Employee | null;
  userRole: string;
}

const getTeamIcon = (team: string) => {
  const t = team.toLowerCase();
  if (t.includes('electric')) return '⚡';
  if (t.includes('engineer')) return '⚙️';
  if (t.includes('gold')) return '🥇';
  if (t.includes('mushroom')) return '🍄';
  if (t.includes('plumb')) return '🔧';
  return '👥';
};

export const SeatingMap: React.FC<SeatingMapProps> = ({ employees, loggedInEmployee, userRole }) => {
  const allWaves = useMemo(() => Array.from(new Set(employees.map(e => e.Wave.replace(/_/g, ' ⏰ ')))), [employees]);
  const [selectedWave, setSelectedWave] = useState(loggedInEmployee?.Wave.replace(/_/g, ' ⏰ ') || allWaves[0] || '');
  const [selectedTeam, setSelectedTeam] = useState<{kingdom: string, team: string, members: Employee[]} | null>(null);

  const waveEmployees = useMemo(() => 
    employees.filter(e => e.Wave.replace(/_/g, ' ⏰ ') === selectedWave), 
    [employees, selectedWave]
  );

  const groupedData = useMemo(() => {
    const groups: Record<string, Record<string, Employee[]>> = {};
    waveEmployees.forEach(emp => {
      if (!groups[emp.Kingdom]) groups[emp.Kingdom] = {};
      if (!groups[emp.Kingdom][emp.Team]) groups[emp.Kingdom][emp.Team] = [];
      groups[emp.Kingdom][emp.Team].push(emp);
    });
    return groups;
  }, [waveEmployees]);

  const kingdomNames = Object.keys(groupedData).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[22px] font-bold text-[#ffc000] font-display">🗺️ Wave {selectedWave} — Seating Map</h2>
        <p className="text-[13px] text-[#888888] mb-6">Your table is highlighted in gold</p>
      </div>

      {/* Facilitator Wave Selector */}
      {(userRole === 'facilitator' || userRole === 'superuser') && (
        <div className="flex gap-2 mb-4">
          {allWaves.map(wave => (
            <button
              key={wave}
              onClick={() => setSelectedWave(wave)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedWave === wave ? 'bg-[#ffc000] text-black' : 'bg-transparent border border-[#ffc000]/30 text-[#ffc000]'}`}
            >
              Wave {wave}
            </button>
          ))}
        </div>
      )}

      {waveEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#888888]">
          <MapPin className="w-12 h-12 mb-4 opacity-50" />
          <p>No seating data available</p>
        </div>
      ) : (
        kingdomNames.map(kingdom => (
          <div key={kingdom} className="w-full">
            <h3 className="text-[#ffc000] font-bold text-lg mb-4 border-b border-[#ffc000]/20 pb-2">Kingdom {kingdom}</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(groupedData[kingdom] as Record<string, Employee[]>).sort((a,b) => a[0].localeCompare(b[0])).map(([team, members]) => {
                const teamMembers = members as Employee[];
                const isUserTable = teamMembers.some(m => m["Employee Number"] === loggedInEmployee["Employee Number"]);
                const isClickable = (userRole === 'facilitator' || userRole === 'superuser' || isUserTable);
                
                return (
                  <div
                    key={team}
                    onClick={() => isClickable && setSelectedTeam({ kingdom, team, members: teamMembers })}
                    className={`min-w-[220px] bg-[#f5f5f5] dark:bg-[#111111] border rounded-xl p-4 relative ${isUserTable ? 'border-2 border-[#ffc000] shadow-[0_0_20px_rgba(255,192,0,0.15)] cursor-pointer' : 'border border-[rgba(255,255,255,0.08)]'}`}
                  >
                    {isUserTable && <div className="absolute top-0 right-0 bg-[#ffc000] text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg">Your Table</div>}
                    {(userRole === 'facilitator' || userRole === 'superuser') && (
                      <div className="absolute -top-2 -left-2 bg-[#ffc000]/20 text-[#ffc000] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{teamMembers.length}</div>
                    )}
                    <h4 className="font-bold text-[#000000] dark:text-[#ffffff] mb-2 text-sm">{getTeamIcon(team)} {team}</h4>
                    <div className="border-t border-[rgba(255,255,255,0.08)] my-2" />
                    <div className="space-y-1.5 pt-1">
                      {teamMembers.map((m, i) => (
                        <div key={i} className={`flex flex-col mb-1 ${loggedInEmployee && m["Employee Number"] === loggedInEmployee["Employee Number"] ? 'text-[#ffc000]' : ''}`}>
                          <div className={`flex items-center gap-1.5 font-bold text-[13px] ${loggedInEmployee && m["Employee Number"] === loggedInEmployee["Employee Number"] ? 'text-[#ffc000]' : 'text-[#1a1a1a] dark:text-[#f0f0f0]'}`}>
                            {loggedInEmployee && m["Employee Number"] === loggedInEmployee["Employee Number"] && '★ '}
                            {m["Employee Name"]}
                          </div>
                          <div className="text-[10px] pl-[18px] opacity-70 text-[#666666] dark:text-[#aaaaaa] font-medium leading-[1.2]">
                            {m["Title"]}{m["Unit"] ? ` • ${m["Unit"]}` : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Popup */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 z-[9999] flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-[#1a1a1a] border-2 border-[#ffc000] rounded-2xl p-7 w-full max-w-[360px]">
              <h4 className="text-[#ffc000] font-bold text-lg">{getTeamIcon(selectedTeam.team)} {selectedTeam.team}</h4>
              <p className="text-[#888888] text-[12px] mb-4">Kingdom {selectedTeam.kingdom} • Wave {selectedWave}</p>
              <div className="space-y-3 mb-6 mt-4">
                {selectedTeam.members.map((m, i) => (
                  <div key={i} className={`flex flex-col py-3 px-3 rounded-xl border border-[rgba(255,255,255,0.06)] dark:bg-white/[0.02] ${loggedInEmployee && m["Employee Number"] === loggedInEmployee["Employee Number"] ? 'bg-[#ffc000]/10 border-[#ffc000]/30' : 'bg-[#f9f9f9] dark:bg-black/20'}`}>
                    <div className={`flex items-center gap-2 font-bold text-[15px] ${loggedInEmployee && m["Employee Number"] === loggedInEmployee["Employee Number"] ? 'text-[#ffc000]' : 'text-black dark:text-white'}`}>
                      👤 {loggedInEmployee && m["Employee Number"] === loggedInEmployee["Employee Number"] && '★ '} {m["Employee Name"]}
                    </div>
                    <div className="text-[12px] font-medium opacity-60 ml-7 text-[#444444] dark:text-[#cccccc] mt-0.5">
                      {m["Title"]}{m["Unit"] ? ` • ${m["Unit"]}` : ''}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setSelectedTeam(null)} className="w-full border border-[#ffc000]/40 text-[#ffc000] rounded-lg py-2 hover:bg-[#ffc000]/10">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
