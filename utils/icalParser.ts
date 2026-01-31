
import { toISODate, addDays } from './dateUtils';

/**
 * Parses a date string from an ICS file.
 * Handles both standard YYYYMMDDTHHMMSSZ and manual block YYYYMMDD formats.
 */
const parseIcalDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  // Strip all non-numeric characters to get YYYYMMDD
  const cleanStr = dateStr.replace(/[^0-9]/g, '');
  if (cleanStr.length < 8) return null;
  
  const year = parseInt(cleanStr.substring(0, 4), 10);
  const month = parseInt(cleanStr.substring(4, 6), 10) - 1;
  const day = parseInt(cleanStr.substring(6, 8), 10);
  
  return new Date(year, month, day, 0, 0, 0);
};

const fetchWithProxy = async (url: string, proxyUrlBuilder: (url: string) => string): Promise<string> => {
  const proxyUrl = proxyUrlBuilder(url);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(proxyUrl, { 
      signal: controller.signal,
      headers: { 'Accept': 'text/calendar, text/plain, */*' }
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return await response.text();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

export const fetchAndParseIcal = async (url: string): Promise<string[]> => {
  let data = '';
  const buster = `cb=${Date.now()}`;
  const urlWithBuster = url.includes('?') ? `${url}&${buster}` : `${url}?${buster}`;
  
  // Rotating proxies to avoid domain blocks on production
  const proxies = [
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`
  ];

  let success = false;
  for (const proxyBuilder of proxies) {
    try {
      data = await fetchWithProxy(urlWithBuster, proxyBuilder);
      if (data && data.includes('BEGIN:VCALENDAR')) {
        success = true;
        break;
      }
    } catch (err) {
      console.warn(`Proxy attempt failed, trying next...`);
    }
  }

  if (!success) {
    console.error('All proxies failed to fetch calendar data.');
    return [];
  }

  try {
    const blockedDates: Set<string> = new Set();
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
            // iCal end dates are exclusive, so we loop up to but not including the end date
            while (current < endDate) {
              blockedDates.add(toISODate(current));
              current = addDays(current, 1);
            }
          }
        }
      } else if (inEvent) {
        // Robust regex to capture dates even with parameters like ;VALUE=DATE
        const startMatch = trimmedLine.match(/^DTSTART.*:(.*)$/);
        if (startMatch) startStr = startMatch[1].trim();
        
        const endMatch = trimmedLine.match(/^DTEND.*:(.*)$/);
        if (endMatch) endStr = endMatch[1].trim();
      }
    }
    return Array.from(blockedDates);
  } catch (error) {
    console.error('Error parsing iCal:', error);
    return [];
  }
};
