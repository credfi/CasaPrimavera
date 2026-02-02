import { toISODate, addDays } from './dateUtils';

/**
 * Extracts a date from an iCal line.
 * Handles formats like:
 * DTSTART:20250101
 * DTSTART;VALUE=DATE:20250101
 * DTSTART:20250101T120000Z
 */
const parseIcalDate = (line: string): Date | null => {
  try {
    const parts = line.split(':');
    const dateValue = parts[parts.length - 1]?.trim();
    
    if (!dateValue || dateValue.length < 8) return null;
    
    // Extract YYYYMMDD (first 8 digits)
    const cleanDate = dateValue.replace(/[^0-9]/g, '').substring(0, 8);
    if (cleanDate.length < 8) return null;

    const year = parseInt(cleanDate.substring(0, 4), 10);
    const month = parseInt(cleanDate.substring(4, 6), 10) - 1;
    const day = parseInt(cleanDate.substring(6, 8), 10);
    
    // Use noon to avoid timezone issues during simple date arithmetic
    return new Date(year, month, day, 12, 0, 0);
  } catch (e) {
    return null;
  }
};

/**
 * Unfolds iCal lines (removes CRLF followed by space/tab)
 */
const unfoldIcal = (data: string): string => {
  return data.replace(/\r?\n[ \t]/g, '');
};

/**
 * Main parser logic that takes raw iCal text and returns blocked ISO dates
 */
const parseIcalText = (data: string): string[] => {
  if (!data || !data.includes('BEGIN:VCALENDAR')) {
    return [];
  }

  const blockedDates: Set<string> = new Set();
  const unfoldedData = unfoldIcal(data);
  const lines = unfoldedData.split(/\r\n|\n|\r/);
  
  let startLine: string | null = null;
  let endLine: string | null = null;
  let inEvent = false;

  for (const line of lines) {
    const cleanLine = line.trim().toUpperCase();
    
    if (cleanLine.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      startLine = null;
      endLine = null;
    } else if (cleanLine.startsWith('END:VEVENT')) {
      if (startLine && endLine) {
        const startDate = parseIcalDate(startLine);
        const endDate = parseIcalDate(endLine);
        
        if (startDate && endDate) {
          let curr = new Date(startDate);
          // iCal standard: End date is exclusive (checkout day is free)
          while (curr < endDate) {
            blockedDates.add(toISODate(curr));
            curr = addDays(curr, 1);
          }
        }
      }
      inEvent = false;
    } else if (inEvent) {
      if (cleanLine.startsWith('DTSTART')) startLine = line;
      if (cleanLine.startsWith('DTEND')) endLine = line;
    }
  }
  
  return Array.from(blockedDates);
};

/**
 * Enhanced fetcher to navigate Airbnb's bot protection via multiple failover stages
 */
export const fetchAndParseIcal = async (url: string): Promise<string[]> => {
  // Common headers to look less like a generic script
  const standardHeaders = {
    'Accept': 'text/calendar,text/plain,*/*',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  try {
    // Stage 1: Try the internal Netlify proxy (cleanest path for production)
    try {
      const response = await fetch(`/proxy/${url}`, { headers: standardHeaders });
      if (response.ok) {
        const text = await response.text();
        const dates = parseIcalText(text);
        if (dates.length > 0) return dates;
      }
    } catch (e) {
      // Primary proxy failed
    }

    // Stage 2: Try AllOrigins (Raw mode is more reliable than JSON mode)
    // We add a cache buster to the URL to prevent the proxy from serving a cached 403
    const cacheBuster = `cb=${Date.now()}`;
    const separator = url.includes('?') ? '&' : '?';
    const finalUrl = `${url}${separator}${cacheBuster}`;
    
    const allOriginsUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(finalUrl)}`;
    
    try {
      const aoResponse = await fetch(allOriginsUrl);
      if (aoResponse.ok) {
        const text = await aoResponse.text();
        const dates = parseIcalText(text);
        if (dates.length > 0) return dates;
      }
    } catch (e) {
      // AllOrigins failed
    }

    // Stage 3: Third Proxy Fallback (Codetabs - often handles Airbnb well)
    const codetabsUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
    try {
      const ctResponse = await fetch(codetabsUrl);
      if (ctResponse.ok) {
        const text = await ctResponse.text();
        const dates = parseIcalText(text);
        if (dates.length > 0) return dates;
      }
    } catch (e) {
      // Codetabs failed
    }

    return [];
  } catch (error) {
    // Return empty array on failure so UI remains functional
    console.warn(`Sync unavailable for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
};