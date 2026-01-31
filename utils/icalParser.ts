
import { toISODate, addDays } from './dateUtils';

// Parse a single date string from ICS format (YYYYMMDD)
// Handles both YYYYMMDD and YYYYMMDDTHHMMSSZ formats
const parseIcalDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  // Clean up the string - keep only digits for the initial YYYYMMDD check
  const cleanStr = dateStr.replace(/[^0-9T]/g, '');
  if (cleanStr.length < 8) return null;
  
  const year = parseInt(cleanStr.substring(0, 4), 10);
  const month = parseInt(cleanStr.substring(4, 6), 10) - 1; // JS months are 0-indexed
  const day = parseInt(cleanStr.substring(6, 8), 10);
  
  // Return a Date object at local midnight to ensure consistent comparison
  return new Date(year, month, day, 0, 0, 0);
};

const fetchWithProxy = async (url: string, proxyUrlBuilder: (url: string) => string): Promise<string> => {
  const proxyUrl = proxyUrlBuilder(url);
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await response.text();
};

export const fetchAndParseIcal = async (url: string): Promise<string[]> => {
  let data = '';
  
  // Cache Buster: Appends a unique timestamp to the Airbnb URL
  // This forces proxies like corsproxy.io to fetch a fresh version instead of a stale cached one.
  const buster = `cacheBust=${Date.now()}`;
  const urlWithBuster = url.includes('?') ? `${url}&${buster}` : `${url}?${buster}`;
  
  try {
    // Strategy 1: corsproxy.io (Primary)
    data = await fetchWithProxy(urlWithBuster, (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`);
  } catch (err1) {
    try {
      // Strategy 2: allorigins.win (Backup)
      data = await fetchWithProxy(urlWithBuster, (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`);
    } catch (err2) {
      console.error('All calendar fetch proxies failed:', err2);
      return [];
    }
  }

  try {
    const blockedDates: Set<string> = new Set();
    
    // Normalize line endings
    const lines = data.split(/\r\n|\n|\r/);
    let inEvent = false;
    let startStr: string | null = null;
    let endStr: string | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('BEGIN:VEVENT')) {
        inEvent = true;
        startStr = null;
        endStr = null;
      } else if (trimmedLine.startsWith('END:VEVENT')) {
        inEvent = false;
        
        if (startStr && endStr) {
          const startDate = parseIcalDate(startStr);
          const endDate = parseIcalDate(endStr);
          
          if (startDate && endDate) {
            let current = new Date(startDate);
            // Iterate from start date up to (but not including) end date
            // This is the standard iCal behavior: end date is the checkout day
            while (current < endDate) {
              blockedDates.add(toISODate(current));
              current = addDays(current, 1);
            }
          }
        }
      } else if (inEvent) {
        // Robust Regex Parsing:
        // Handles variations like DTSTART:20250101 and DTSTART;VALUE=DATE:20250101
        // which Airbnb uses interchangeably for Reserved vs Blocked dates.
        const startMatch = trimmedLine.match(/^DTSTART.*:(.*)$/);
        if (startMatch) startStr = startMatch[1].trim();
        
        const endMatch = trimmedLine.match(/^DTEND.*:(.*)$/);
        if (endMatch) endStr = endMatch[1].trim();
      }
    }
    
    return Array.from(blockedDates);
  } catch (error) {
    console.error('Error parsing calendar data:', error);
    return [];
  }
};
