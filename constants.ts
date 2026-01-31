
import { Property } from './types';

const INTRO_DESCRIPTION = `Casa Primavera - A hip boutique stay offering an unforgettable direct-booking experience in the heart of Sayulita! 

Located on the peaceful South Side, Primavera was strategically built for those seeking proximity to local hotspots while enjoying a tranquil jungle backdrop. We are just a short walk to the Sayulita Plaza and Main Beach, making us one of the best-located boho rentals in town.

If you are looking for long-term rentals in Sayulita or affordable monthly stays, Casa Primavera offers the perfect blend of style, comfort, and community. 

A Boutique Airbnb-style stay, encompassing the authentic Boho Sayulita lifestyle. Book directly with us for the best rates on weekly and monthly rentals.`;

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

const CORE_FEATURES_QUEEN = [
  'Queen Size Pillow-Top Mattress with Cotton Bedding',
  ...CORE_FEATURES.slice(1)
];

const FEATURES_LARGE_TERRACE = [
  'Dual Sliding patio doors with screens',
  'Private Large Terrace with lush backdrop',
  ...CORE_FEATURES
];

const FEATURES_SMALL_BALCONY = [
  'Sliding patio doors with screens',
  'Small Balcony with lush backdrop',
  ...CORE_FEATURES
];

const FEATURES_NO_BALCONY_QUEEN = [
  'Large windows with jungle views',
  ...CORE_FEATURES_QUEEN
];

const BASE_AMENITIES = [
  'King Bed', 'Rain Shower', 'Mini Fridge', 
  'Air Conditioning', 'WiFi', 'Workspace', 'Room Safe'
];

const BASE_AMENITIES_QUEEN = [
  'Queen Bed', 'Rain Shower', 'Mini Fridge', 
  'Air Conditioning', 'WiFi', 'Workspace', 'Room Safe'
];

export const AMENITIES_LIST = [
  'King / Queen Bed', 'Large Terrace', 'Small Balcony', 'Rain Shower', 'Mini Fridge', 
  'Air Conditioning', 'WiFi', 'Workspace', 'Room Safe'
];

const SHARED_BATHROOM_IMAGES = [
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/bathroom-high%20res-0780.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/bathroom-high%20res-0783.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/bathroom-high%20res-2.jpg'
];

const SUITE_1_3_IMAGES = [
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-header.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-2.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-4.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-5.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-cactus.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-pillow.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-skull.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-towel.jpg',
  ...SHARED_BATHROOM_IMAGES
];

const SUITE_4_9_IMAGES = [
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/49-header.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/49-2.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/49-3.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/49-4.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/49-pillow.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/49-skull2.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/49-towels.jpg',
  ...SHARED_BATHROOM_IMAGES
];

const SUITE_5_10_IMAGES = [
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/5-10-header-5-10.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/5-10-med%20res--2.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/5-10-med%20res-.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/5-10-med%20res-1715.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/5-10-med%20res-1716.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/5-10-med%20res-1861.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/5-10-med%20res-1868.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/5-10-med%20res-2.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/5-10-med%20res-3.jpg',
  ...SHARED_BATHROOM_IMAGES
];

const SUITE_6_7_8_IMAGES = [
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/header-7-8-9.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/789-2.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-4.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-5.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-cactus.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-pillow.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-skull.jpg',
  'https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/123-towel.jpg',
  ...SHARED_BATHROOM_IMAGES
];

export const PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Boho Suite 1',
    type: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 56,
    description: INTRO_DESCRIPTION,
    features: FEATURES_LARGE_TERRACE,
    balconyType: 'Large Terrace',
    amenities: ['Large Terrace', ...BASE_AMENITIES],
    images: SUITE_1_3_IMAGES,
    rating: 4.5,
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
    pricePerNight: 56,
    description: INTRO_DESCRIPTION,
    features: FEATURES_LARGE_TERRACE,
    balconyType: 'Large Terrace',
    amenities: ['Large Terrace', ...BASE_AMENITIES],
    images: SUITE_1_3_IMAGES,
    rating: 4.52,
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
    pricePerNight: 56,
    description: INTRO_DESCRIPTION,
    features: FEATURES_LARGE_TERRACE,
    balconyType: 'Large Terrace',
    amenities: ['Large Terrace', ...BASE_AMENITIES],
    images: SUITE_1_3_IMAGES,
    rating: 4.54,
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
    features: FEATURES_NO_BALCONY_QUEEN,
    balconyType: 'No Balcony',
    amenities: BASE_AMENITIES_QUEEN,
    images: SUITE_4_9_IMAGES,
    rating: 4.47,
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
    pricePerNight: 52,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: SUITE_5_10_IMAGES,
    rating: 4.45,
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
    pricePerNight: 52,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: SUITE_6_7_8_IMAGES,
    rating: 4.47,
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
    pricePerNight: 52,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: SUITE_6_7_8_IMAGES,
    rating: 4.5,
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
    pricePerNight: 52,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: SUITE_6_7_8_IMAGES,
    rating: 4.58,
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
    features: FEATURES_NO_BALCONY_QUEEN,
    balconyType: 'No Balcony',
    amenities: BASE_AMENITIES_QUEEN,
    images: SUITE_4_9_IMAGES,
    rating: 4.63,
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
    pricePerNight: 52,
    description: INTRO_DESCRIPTION,
    features: FEATURES_SMALL_BALCONY,
    balconyType: 'Small Balcony',
    amenities: ['Small Balcony', ...BASE_AMENITIES],
    images: SUITE_5_10_IMAGES,
    rating: 4.68,
    reviews: 6,
    calendarUrl: 'https://www.airbnb.com/calendar/ical/38551936.ics?s=b56811b3474a46263b1ad21058db9417',
    unavailableDates: []
  }
];
