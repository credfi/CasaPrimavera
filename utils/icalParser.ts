import { toISODate, addDays } from './dateUtils';

// Parse a single date string from ICS format (YYYYMMDD)
const parseIcalDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.length < 8) return null;
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10) - 1; // JS months are 0-indexed
  const day = parseInt(dateStr.substring(6, 8), 10);
  return new Date(year, month, day);
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
  
  try {
    // Strategy 1: corsproxy.io (Primary)
    // Generally faster and more reliable
    data = await fetchWithProxy(url, (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`);
  } catch (err1) {
    // console.warn('Primary proxy failed, trying backup...', err1);
    try {
      // Strategy 2: allorigins.win (Backup)
      data = await fetchWithProxy(url, (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`);
    } catch (err2) {
      console.error('All calendar fetch proxies failed:', err2);
      // Return empty array so the app doesn't crash, just shows as available
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
      if (line.startsWith('BEGIN:VEVENT')) {
        inEvent = true;
        startStr = null;
        endStr = null;
      } else if (line.startsWith('END:VEVENT')) {
        inEvent = false;
        
        // Process the event
        if (startStr && endStr) {
          const startDate = parseIcalDate(startStr);
          const endDate = parseIcalDate(endStr);
          
          if (startDate && endDate) {
            let current = startDate;
            // Iterate from start date up to (but not including) end date
            while (current < endDate) {
              blockedDates.add(toISODate(current));
              current = addDays(current, 1);
            }
          }
        }
      } else if (inEvent) {
        // Extract Start Date
        if (line.startsWith('DTSTART')) {
            // Handle DTSTART;VALUE=DATE:20231025 or DTSTART:20231025
            const parts = line.split(':');
            if (parts.length > 1) startStr = parts[1];
        }
        // Extract End Date
        if (line.startsWith('DTEND')) {
            const parts = line.split(':');
            if (parts.length > 1) endStr = parts[1];
        }
      }
    }
    
    return Array.from(blockedDates);
  } catch (error) {
    console.error('Error parsing calendar data:', error);
    return [];
  }
};