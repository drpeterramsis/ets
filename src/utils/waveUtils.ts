/**
 * Utility to parse and sort waves.
 * Wave format: "20 April ⏰ 10 AM - 12 PM"
 */

interface ParsedWave {
  original: string;
  day: number;
  month: number;
  startMinutes: number;
}

const MONTHS: Record<string, number> = {
  'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
  'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
};

export const parseWave = (wave: string): ParsedWave => {
  const parts = wave.split('⏰');
  const datePart = parts[0]?.trim() || '';
  const timePart = parts[1]?.trim() || '';

  // Parse Date: "20 April"
  const dateMatch = datePart.match(/(\d+)\s+([a-zA-Z]+)/);
  const day = dateMatch ? parseInt(dateMatch[1]) : 0;
  const month = dateMatch ? (MONTHS[dateMatch[2].toLowerCase()] ?? 0) : 0;

  // Parse Time: "10 AM - 12 PM"
  const timeMatch = timePart.match(/(\d+)\s*(AM|PM)/i);
  let startMinutes = 0;
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const ampm = timeMatch[2].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    startMinutes = hours * 60;
  }

  return { original: wave, day, month, startMinutes };
};

export const sortWaves = (waves: string[]): string[] => {
  const parsed = waves.map(w => parseWave(w));

  return parsed.sort((a, b) => {
    // Sort by month
    if (a.month !== b.month) return a.month - b.month;
    // Sort by day
    if (a.day !== b.day) return a.day - b.day;
    // Sort by start time
    return a.startMinutes - b.startMinutes;
  }).map(p => p.original);
};
