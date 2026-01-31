
import { toISODate, addDays } from './dateUtils';

// Parse a single date string from ICS format (YYYYMMDD)
const parseIcalDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const cleanStr = dateStr.replace(/[^0-9T]/g, '');
  if (cleanStr.length < 8) return null;
  
  const year = parseInt(cleanStr.substring(0, 4), 10);
  const month = parseInt(cleanStr.substring(4, 6), 10) - 1;
  const day = parseInt(cleanStr.substring(6, 8), 10);
  
  return new Date(year, month, day, 0, 0, 0);
};

const fetchWithProxy = async (url: string, proxyUrlBuilder: (url: string) => string): Promise<string> => {
  const proxyUrl = proxyUrlBuilder(url);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout per proxy

  try {
    const response = await fetch(proxyUrl, { signal: controller.signal });
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
  const buster = `cacheBust=${Date.now()}`;
  const urlWithBuster = url.includes('?') ? `${url}&${buster}` : `${url}?${buster}`;
  
  const proxies = [
    (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://thingproxy.freeboard.io/fetch/${u}` // Third fallback
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
      console.warn(`Proxy failed, trying next...`, err);
    }
  }

  if (!success) {
    console.error('All proxies failed to fetch calendar for:', url);
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
            while (current < endDate) {
              blockedDates.add(toISODate(current));
              current = addDays(current, 1);
            }
          }
        }
      } else if (inEvent) {
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
