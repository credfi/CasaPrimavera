import { Property } from './types';

// Helper to generate some fake blocked dates
const getFutureDate = (daysToAdd: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

const INTRO_DESCRIPTION = `Primavera - A hip new accommodation offering guests an unforgettable Sayulita experience! Only a few blocks to The Sayulita Plaza & Main Beach, Primavera was strategically built with proximity in mind. Offering guests a premier location close to all the hotspots, yet tucked away to encompass a peaceful nights slumber. 

If your heart desires a great location close to local hotspots, tasty restaurants, and Sayulita's main beach... This might be the place for you!

You'll love it here!! 

A Boutique Airbnb Stay, Encompassing the Boho Sayulita Vibe and Lifestyle.`;

const CORE_FEATURES = [
  'King Size Pillow-Top Mattress with Cotton Bedding',
  'Lux rain shower head with water pressure management system',
  'In room mini fridge',
  'Air Conditioning',
  'Wireless Internet',
  'Natural Soap, Shampoos, and Towels for Guests',
  'Desk and Closet for your belongings',
  'Room Safe',
  'Bohemian Art and Decor from the best Local Artists: @curtbarter',
  'Parota hardwood furnishings used throughout',
  'Custom locally handmade polished concrete tile floors'
];

// Features for rooms with Large Terrace (1-3)
const FEATURES_LARGE_TERRACE = [
  'Dual Sliding patio doors with screens',
  'Private Large Terrace with lush backdrop',
  ...CORE_FEATURES
];

// Features for rooms with Small Balcony (5,6,7,8,10)
const FEATURES_SMALL_BALCONY = [
  'Sliding patio doors with screens',
  'Small Balcony with lush backdrop',
  ...CORE_FEATURES
];

// Features for rooms with No Balcony (4,9)
const FEATURES_NO_BALCONY = [
  'Large windows with jungle views', // Replaced patio doors
  ...CORE_FEATURES
];

const BASE_AMENITIES = [
  'King Bed', 'Rain Shower', 'Mini Fridge', 
  'Air Conditioning', 'WiFi', 'Workspace', 'Room Safe'
];

export const AMENITIES_LIST = [
  'King Bed', 'Large Terrace', 'Small Balcony', 'Rain Shower', 'Mini Fridge', 
  'Air Conditioning', 'WiFi', 'Workspace', 'Room Safe'
];

// Shared images for Suites 1-3
// These match the 8 specific photos provided by the user
const SUITE_1_3_IMAGES = [
  '/suite_balcony_view.jpg',      // Hero: Bedroom looking out to patio
  '/suite_bed_front.jpg',         // Front view with dreamcatcher
  '/suite_desk_side.jpg',         // Side view with desk area
  '/suite_bed_detail.jpg',        // Angled/closer view of bed
  '/suite_decor_skull.jpg',       // Skull decor detail
  '/suite_art_wave.jpg',          // Wave art frame
  '/suite_pillow_detail.jpg',     // Pillow textile detail
  '/suite_toiletries.jpg'         // Shampoo bottles
];

export const PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Boho Suite 1',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 64,
    description: INTRO_DESCRIPTION,
    features: FEATURES_LARGE_TERRACE,
    balconyType: 'Large Terrace',
    amenities: ['Large Terrace', ...BASE_AMENITIES],
    images: SUITE_1_3_IMAGES,
    rating: 4.95,
    reviews: 12,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/39541559.ics?s=1f4393e66deb44c64fd910a649f8275e',
    unavailableDates: [] 
  },
  {
    id: '2',
    name: 'Boho Suite 2',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 64,
    description: INTRO_DESCRIPTION,
    features: FEATURES_LARGE_TERRACE,
    balconyType: 'Large Terrace',
    amenities: ['Large Terrace', ...BASE_AMENITIES],
    images: SUITE_1_3_IMAGES,
    rating: 4.90,
    reviews: 8,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38484428.ics?s=9ee93fa9481e3a8630a1d67d3376964c',
    unavailableDates: []
  },
  {
    id: '3',
    name: 'Boho Suite 3',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 64,
    description: INTRO_DESCRIPTION,
    features: FEATURES_LARGE_TERRACE,
    balconyType: 'Large Terrace',
    amenities: ['Large Terrace', ...BASE_AMENITIES],
    images: SUITE_1_3_IMAGES,
    rating: 5.0,
    reviews: 4,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38516161.ics?s=2934fe1bd0626cff75c78c2f59aae124',
    unavailableDates: []
  },
  {
    id: '4',
    name: 'Boho Suite 4',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 48,
    description: INTRO_DESCRIPTION,
    features: FEATURES_NO_BALCONY,
    balconyType: 'No Balcony',
    amenities: BASE_AMENITIES,
    images: [
      'https://picsum.photos/800/600?random=4',
      'https://picsum.photos/800/600?random=41'
    ],
    rating: 4.85,
    reviews: 15,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38516577.ics?s=805824db88bb3c2a0c711e184059d06b',
    unavailableDates: []
  },
  {
    id: '5',
    name: 'Boho Suite 5',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 56,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: [
      'https://picsum.photos/800/600?random=5',
      'https://picsum.photos/800/600?random=51'
    ],
    rating: 4.92,
    reviews: 22,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38516937.ics?s=1d730feadf05faac3edd34f10e14181d',
    unavailableDates: []
  },
  {
    id: '6',
    name: 'Boho Suite 6',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 56,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: [
      'https://picsum.photos/800/600?random=6',
      'https://picsum.photos/800/600?random=61'
    ],
    rating: 4.88,
    reviews: 9,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38517569.ics?s=8fe10f0adca2ffe3ab09ac32c848dc40',
    unavailableDates: []
  },
  {
    id: '7',
    name: 'Boho Suite 7',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 56,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: [
      'https://picsum.photos/800/600?random=7',
      'https://picsum.photos/800/600?random=71'
    ],
    rating: 4.96,
    reviews: 18,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38518119.ics?s=50b08aef271e43d46852ae15f98924ae',
    unavailableDates: []
  },
  {
    id: '8',
    name: 'Boho Suite 8',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 56,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: [
      'https://picsum.photos/800/600?random=8',
      'https://picsum.photos/800/600?random=81'
    ],
    rating: 4.91,
    reviews: 7,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38518414.ics?s=d5af6b89e2b22c4a4a0d85b63201ce8e',
    unavailableDates: []
  },
  {
    id: '9',
    name: 'Boho Suite 9',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 48,
    description: INTRO_DESCRIPTION,
    features: FEATURES_NO_BALCONY,
    balconyType: 'No Balcony',
    amenities: BASE_AMENITIES,
    images: [
      'https://picsum.photos/800/600?random=9',
      'https://picsum.photos/800/600?random=91'
    ],
    rating: 4.80,
    reviews: 14,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38518848.ics?s=12be704d97f18a894bcbf82149d2b770',
    unavailableDates: []
  },
  {
    id: '10',
    name: 'Boho Suite 10',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 56,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: [
      'https://picsum.photos/800/600?random=10',
      'https://picsum.photos/800/600?random=101'
    ],
    rating: 5.0,
    reviews: 6,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38551936.ics?s=b56811b3474a46263b1ad21058db9417',
    unavailableDates: []
  }
];