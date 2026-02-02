import { toISODate, addDays } from './dateUtils';

/**
 * Robustly parses a date string from an iCal file.
 * Handles YYYYMMDD, YYYYMMDDTHHMMSSZ, and lines with parameters (VALUE=DATE, TZID).
 */
const parseIcalDate = (line: string): Date | null => {
  if (!line) return null;
  
  // Extract the part after the colon
  const parts = line.split(':');
  if (parts.length < 2) return null;
  
  const dateValue = parts[parts.length - 1].trim();
  // Extract just the numeric part (e.g., 20241225 from 20241225T120000Z)
  const cleanStr = dateValue.replace(/[^0-9]/g, '');
  if (cleanStr.length < 8) return null;
  
  const year = parseInt(cleanStr.substring(0, 4), 10);
  const month = parseInt(cleanStr.substring(4, 6), 10) - 1;
  const day = parseInt(cleanStr.substring(6, 8), 10);
  
  return new Date(year, month, day, 0, 0, 0);
};

/**
 * Handles iCal line folding where lines starting with a space are continuations.
 */
const unwindIcal = (data: string): string[] => {
  const lines = data.split(/\r\n|\n|\r/);
  const unwound: string[] = [];
  for (const line of lines) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (unwound.length > 0) {
        unwound[unwound.length - 1] += line.substring(1);
      }
    } else {
      unwound.push(line);
    }
  }
  return unwound;
};

const fetchCalendarData = async (url: string): Promise<string> => {
  const buster = `t=${Date.now()}`;
  const urlWithBuster = url.includes('?') ? `${url}&${buster}` : `${url}?${buster}`;
  
  // Header often required by some proxies
  const headers = { 'X-Requested-With': 'XMLHttpRequest' };

  const strategies = [
    // Strategy 1: Internal Proxy (Netlify) - Try without buster first to avoid signature issues
    async () => {
      const response = await fetch(`/proxy/${url}`, { headers });
      if (!response.ok) throw new Error(`Netlify Proxy failed: ${response.status}`);
      return await response.text();
    },
    // Strategy 2: Internal Proxy (Netlify) - With buster if needed
    async () => {
      const response = await fetch(`/proxy/${urlWithBuster}`, { headers });
      if (!response.ok) throw new Error(`Netlify Proxy (Buster) failed: ${response.status}`);
      return await response.text();
    },
    // Strategy 3: CORSProxy.io (Reliable for Airbnb)
    async () => {
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, { headers });
      if (!response.ok) throw new Error('CORSProxy failed');
      return await response.text();
    },
    // Strategy 4: AllOrigins
    async () => {
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, { headers });
      if (!response.ok) throw new Error('AllOrigins failed');
      return await response.text();
    },
    // Strategy 5: CodeTabs (Good fallback)
    async () => {
      const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, { headers });
      if (!response.ok) throw new Error('CodeTabs failed');
      return await response.text();
    }
  ];

  let lastError = null;
  for (const strategy of strategies) {
    try {
      const text = await strategy();
      if (text && (text.includes('BEGIN:VCALENDAR') || text.includes('BEGIN:VEVENT'))) {
        return text;
      }
    } catch (e) {
      lastError = e;
      console.warn(`Calendar fetch strategy failed:`, e);
    }
  }
  
  throw lastError || new Error('All calendar fetch strategies failed');
};

export const fetchAndParseIcal = async (url: string): Promise<string[]> => {
  try {
    const data = await fetchCalendarData(url);
    const blockedDates: Set<string> = new Set();
    const lines = unwindIcal(data);
    
    let currentEvent: { start: string | null; end: string | null } = { start: null, end: null };
    let inEvent = false;

    for (const line of lines) {
      const upperLine = line.trim().toUpperCase();
      
      if (upperLine.startsWith('BEGIN:VEVENT')) {
        inEvent = true;
        currentEvent = { start: null, end: null };
      } else if (upperLine.startsWith('END:VEVENT')) {
        inEvent = false;
        if (currentEvent.start && currentEvent.end) {
          const startDate = parseIcalDate(currentEvent.start);
          const endDate = parseIcalDate(currentEvent.end);
          if (startDate && endDate) {
            let curr = new Date(startDate);
            // End date is exclusive in iCal (checkout day)
            while (curr < endDate) {
              blockedDates.add(toISODate(curr));
              curr = addDays(curr, 1);
            }
          }
        }
      } else if (inEvent) {
        // Broad matches to catch DTSTART;VALUE=DATE:20241225 etc.
        if (upperLine.startsWith('DTSTART')) {
          currentEvent.start = line.trim();
        } else if (upperLine.startsWith('DTEND')) {
          currentEvent.end = line.trim();
        }
      }
    }
    
    return Array.from(blockedDates);
  } catch (error) {
    console.error(`Final attempt calendar sync failed for ${url}:`, error);
    return [];
  }
};