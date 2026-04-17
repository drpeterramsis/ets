import { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import type { Employee } from '../types';

interface SearchEngineProps {
  data: Employee[];
}

export const SearchEngine = ({ data }: SearchEngineProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('All Fields');

  const fields = [
    'All Fields',
    'Employee Number',
    'Employee Name',
    'Division',
    'Unit',
    'Job',
    'Title',
    'Wave',
    'Kingdom',
    'Team'
  ];

  const results = useMemo(() => {
    if (searchTerm.length < 2) return [];
    
    return data.filter(emp => {
      const targetValue = filterField === 'All Fields' 
        ? Object.values(emp).join(' ').toLowerCase()
        : String(emp[filterField as keyof Employee] || '').toLowerCase();
        
      return targetValue.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, filterField, data]);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-color)] transition-colors" />
            <input
              type="text"
              placeholder="Start typing to search (min 2 characters)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl focus:ring-2 focus:ring-[var(--accent-color)] transition-all outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--border-color)] rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="relative inline-flex items-center">
            <Filter className="absolute left-4 w-4 h-4 text-[var(--accent-color)]" />
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="pl-11 pr-8 py-3.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl appearance-none focus:ring-2 focus:ring-[var(--accent-color)] font-medium outline-none cursor-pointer"
            >
              {fields.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      {searchTerm.length >= 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              Search Results ({results.length})
            </h3>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((emp, idx) => (
                <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-3xl hover:border-[var(--accent-color)] transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg leading-tight">{emp["Employee Name"]}</h4>
                    <span className="text-[10px] font-black bg-[var(--input-bg)] px-2 py-1 rounded-md text-[var(--accent-color)]">
                      {emp["Employee Number"]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <div><span className="text-[var(--text-secondary)]">Division:</span> <p className="font-semibold">{emp.Division}</p></div>
                    <div><span className="text-[var(--text-secondary)]">Unit:</span> <p className="font-semibold">{emp.Unit}</p></div>
                    <div><span className="text-[var(--text-secondary)]">Level/Job:</span> <p className="font-semibold">{emp.Job || emp.Title}</p></div>
                    <div><span className="text-[var(--text-secondary)]">Kingdom:</span> <p className="font-semibold">{emp.Kingdom}</p></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                     <span className="text-[9px] font-bold px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">{emp.Wave.replace(/_/g, '⏰')}</span>
                     <span className="text-[9px] font-bold px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">{emp.Team}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem]">
              <SearchIcon className="w-12 h-12 text-[var(--text-secondary)] opacity-20 mx-auto mb-4" />
              <p className="text-[var(--text-secondary)] font-medium">No employees found matching your search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
