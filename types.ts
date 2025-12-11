export interface Property {
  id: string;
  name: string;
  type: 'Suite' | 'Casita' | 'Villa';
  guests: number;
  bedrooms: number;
  bathrooms: number;
  pricePerNight: number;
  description: string;
  features: string[]; // New field for bullet points
  balconyType: string; // New field for the specific differentiator
  amenities: string[];
  images: string[];
  rating: number;
  reviews: number;
  unavailableDates: string[]; // ISO date strings 'YYYY-MM-DD'
  calendarUrl?: string; // Airbnb iCal URL placeholder
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface BookingRequest {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
}