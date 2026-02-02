import { toISODate, addDays } from './dateUtils';

/**
 * Extracts a date from an iCal line (e.g., DTSTART:20250101 or DTSTART;VALUE=DATE:20250101)
 */
const parseIcalDate = (line: string): Date | null => {
  const parts = line.split(':');
  // Get the last part and remove anything that isn't a number
  const dateValue = parts[parts.length - 1]?.replace(/[^0-9]/g, '');
  
  if (!dateValue || dateValue.length < 8) return null;
  
  const year = parseInt(dateValue.substring(0, 4), 10);
  const month = parseInt(dateValue.substring(4, 6), 10) - 1;
  const day = parseInt(dateValue.substring(6, 8), 10);
  
  // Set to noon to avoid any timezone shifting during simple date comparison
  return new Date(year, month, day, 12, 0, 0);
};

export const fetchAndParseIcal = async (url: string): Promise<string[]> => {
  try {
    let response: Response;
    
    // Attempt 1: Internal Netlify Proxy
    // This is the preferred method for production
    try {
      response = await fetch(`/proxy/${url}`);
      // If the proxy returns an error (like 404 in local dev), trigger the fallback
      if (!response.ok) throw new Error('Proxy returned error');
    } catch (e) {
      // Fallback: Public CORS proxy (Reliable for local dev and as a backup)
      const fallbackUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      response = await fetch(fallbackUrl);
    }

    if (!response.ok) {
      throw new Error(`Could not fetch calendar (Status: ${response.status})`);
    }
    
    const data = await response.text();
    
    // Basic validation to ensure we actually got an iCal file
    if (!data.includes('BEGIN:VCALENDAR')) {
      throw new Error('Invalid calendar data received');
    }

    const blockedDates: Set<string> = new Set();
    const lines = data.split(/\r\n|\n|\r/);
    
    let start: string | null = null;
    let end: string | null = null;
    let inEvent = false;

    for (const line of lines) {
      const cleanLine = line.trim().toUpperCase();
      
      if (cleanLine.startsWith('BEGIN:VEVENT')) {
        inEvent = true;
        start = null;
        end = null;
      } else if (cleanLine.startsWith('END:VEVENT')) {
        if (start && end) {
          const startDate = parseIcalDate(start);
          const endDate = parseIcalDate(end);
          if (startDate && endDate) {
            let curr = new Date(startDate);
            // iCal standard: End date is exclusive (checkout day)
            while (curr < endDate) {
              blockedDates.add(toISODate(curr));
              curr = addDays(curr, 1);
            }
          }
        }
        inEvent = false;
      } else if (inEvent) {
        if (cleanLine.startsWith('DTSTART')) start = line;
        if (cleanLine.startsWith('DTEND')) end = line;
      }
    }
    
    return Array.from(blockedDates);
  } catch (error) {
    // Silently log and return empty to avoid breaking the UI
    console.warn(`Sync failed for ${url}:`, error instanceof Error ? error.message : error);
    return [];
  }
};