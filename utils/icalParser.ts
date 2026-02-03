
import { toISODate, addDays } from './dateUtils';

/**
 * Parses a date string from an ICS file.
 * Handles:
 * 1. Standard (20241225T120000Z)
 * 2. Airbnb Manual Block (20241225)
 */
const parseIcalDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  // Extract just the numbers (e.g., 20241225)
  const match = dateStr.match(/\d{8}/);
  if (!match) return null;
  
  const cleanStr = match[0];
  const year = parseInt(cleanStr.substring(0, 4), 10);
  const month = parseInt(cleanStr.substring(4, 6), 10) - 1;
  const day = parseInt(cleanStr.substring(6, 8), 10);
  
  return new Date(year, month, day, 0, 0, 0);
};

export const fetchAndParseIcal = async (url: string): Promise<string[]> => {
  const buster = `cb=${Date.now()}`;
  const urlWithBuster = url.includes('?') ? `${url}&${buster}` : `${url}?${buster}`;
  
  // Public proxies that generally work well with Airbnb
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(urlWithBuster)}`,
    `https://corsproxy.io/?${encodeURIComponent(urlWithBuster)}`,
  ];

  let data = '';
  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl);
      if (response.ok) {
        data = await response.text();
        if (data.includes('BEGIN:VCALENDAR')) break;
      }
    } catch (e) {
      continue; // Try next proxy
    }
  }

  if (!data || !data.includes('BEGIN:VCALENDAR')) {
    return [];
  }

  try {
    const blockedDates: Set<string> = new Set();
    const lines = data.split(/\r\n|\n|\r/);
    
    let currentEvent: { start: string | null, end: string | null } = { start: null, end: null };
    let inEvent = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('BEGIN:VEVENT')) {
        inEvent = true;
        currentEvent = { start: null, end: null };
      } else if (trimmed.startsWith('END:VEVENT')) {
        inEvent = false;
        if (currentEvent.start && currentEvent.end) {
          const startDate = parseIcalDate(currentEvent.start);
          const endDate = parseIcalDate(currentEvent.end);
          if (startDate && endDate) {
            let curr = new Date(startDate);
            // Treat every VEVENT as a block. 
            // Loop until the day before the end date (standard iCal format)
            while (curr < endDate) {
              blockedDates.add(toISODate(curr));
              curr = addDays(curr, 1);
            }
          }
        }
      } else if (inEvent) {
        // Look for the date strings regardless of parameters like ;VALUE=DATE
        if (trimmed.includes('DTSTART')) currentEvent.start = trimmed;
        if (trimmed.includes('DTEND')) currentEvent.end = trimmed;
      }
    }
    
    return Array.from(blockedDates);
  } catch (error) {
    return [];
  }
};
