import { Property } from '../types';

// Updated Pricing Rules (2026-2027 Season)
const HIGH_SEASON_START_MONTH = 9; // October (0-indexed)
const HIGH_SEASON_START_DAY = 27;
const HIGH_SEASON_END_MONTH = 3; // April (0-indexed)
const HIGH_SEASON_END_DAY = 30;

// Mexican Holidays (Fixed dates for simplicity, can be expanded)
// Format: MM-DD
const HOLIDAYS = [
  '01-01', // New Year's
  '02-05', // Constitution Day
  '03-21', // Benito Juarez
  '05-01', // Labor Day
  '09-16', // Independence Day
  '11-20', // Revolution Day
  '12-25', // Christmas
];

// Room Tiers
const TIER_1_IDS = ['1', '2', '3'];
const TIER_2_IDS = ['4', '9'];
const TIER_3_IDS = ['5', '6', '7', '8', '10'];

// Specific holiday fixed pricing
// Dec 22–23, Dec 24–30, Dec 31, Jan 1
const getSpecificHolidayPrice = (propertyId: string, date: Date): number | null => {
  const month = date.getMonth(); // 0-indexed: 0 = Jan, 11 = Dec
  const day = date.getDate();

  const isTier1 = TIER_1_IDS.includes(propertyId);
  const isTier2 = TIER_2_IDS.includes(propertyId);

  // Dec 22–23
  if (month === 11 && (day === 22 || day === 23)) {
    if (isTier1) return 84;
    if (isTier2) return 57;
    return 79;
  }

  // Dec 24–30
  if (month === 11 && day >= 24 && day <= 30) {
    if (isTier1) return 84;
    if (isTier2) return 61;
    return 79;
  }

  // Dec 31
  if (month === 11 && day === 31) {
    if (isTier1) return 127;
    if (isTier2) return 110;
    return 127;
  }

  // Jan 1
  if (month === 0 && day === 1) {
    if (isTier1) return 84;
    if (isTier2) return 61;
    return 79;
  }

  return null;
};

const getBasePrice = (propertyId: string, date: Date): number => {
  const month = date.getMonth();
  const day = date.getDate();

  // Determine Season
  // High Season: Oct 27 - Apr 30
  // Low Season: May 1 - Oct 26
  
  let isHighSeason = false;
  
  // Check if we are in the months firmly within High Season (Nov, Dec, Jan, Feb, Mar)
  if (month > 9 || month < 3) {
    isHighSeason = true;
  }
  // Check boundary month: October
  else if (month === 9 && day >= 27) {
    isHighSeason = true;
  }
  // Check boundary month: April
  else if (month === 3 && day <= 30) {
    isHighSeason = true;
  }

  if (isHighSeason) {
    // Increased by $18/night in high season
    if (TIER_1_IDS.includes(propertyId)) return 68;
    if (TIER_2_IDS.includes(propertyId)) return 58; // Rooms 4 & 9
    return 62; // Rooms 5–8 & 10
  } else {
    // Low Season
    if (TIER_1_IDS.includes(propertyId)) return 34;
    if (TIER_2_IDS.includes(propertyId)) return 30; // Rooms 4 & 9
    return 32; // Rooms 5–8 & 10
  }
};

export const getNightlyPrice = (propertyId: string, date: Date): number => {
  // Check for specific holiday pricing overrides first
  const specificHolidayPrice = getSpecificHolidayPrice(propertyId, date);
  if (specificHolidayPrice !== null) {
    return specificHolidayPrice;
  }

  let price = getBasePrice(propertyId, date);
  const now = new Date();

  // 1. Holiday Modifier (+10%)
  const dateString = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  if (HOLIDAYS.includes(dateString)) {
    price = price * 1.10;
  }

  // 3. Last Minute Discount (-10%)
  // Within 7 days of arrival (now)
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays >= 0 && diffDays <= 7) {
    price = price * 0.90;
  }

  // Round to nearest whole number for clean display
  return Math.ceil(price);
};

export const calculateTripPricing = (propertyId: string, startDate: Date, endDate: Date) => {
  let subtotal = 0;
  let currentDate = new Date(startDate);
  // Normalize dates to midnight to ensure loop works correctly
  currentDate.setHours(0,0,0,0);
  const end = new Date(endDate);
  end.setHours(0,0,0,0);

  let nights = 0;

  // Loop through each night
  while (currentDate < end) {
    subtotal += getNightlyPrice(propertyId, currentDate);
    
    // Add 1 day
    currentDate.setDate(currentDate.getDate() + 1);
    nights++;
  }

  // Length of Stay Discounts
  // 7–27 nights: –10%
  // 28+ nights: –40%
  let discountMultiplier = 1;
  let discountLabel = '';

  if (nights >= 28) {
    discountMultiplier = 0.60;
    discountLabel = 'Monthly Discount (40%)';
  } else if (nights >= 7) {
    discountMultiplier = 0.90;
    discountLabel = 'Weekly Discount (10%)';
  }

  const finalTotal = subtotal * discountMultiplier;
  const discountAmount = subtotal - finalTotal;

  return {
    subtotal,
    discountAmount,
    discountLabel,
    total: finalTotal,
    nights
  };
};