import React, { useState, useEffect, useRef } from 'react';
import { PROPERTIES, AMENITIES_LIST } from './constants';
import { Property, DateRange, View } from './types';
import { PropertyCard } from './components/PropertyCard';
import { Calendar } from './components/Calendar';
import { LocationView } from './components/LocationView';
import { RecommendationsView } from './components/RecommendationsView';
import { FAQView } from './components/FAQView';
import { BookingView } from './components/BookingView';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { ImageGalleryModal } from './components/ImageGalleryModal';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { fetchAndParseIcal } from './utils/icalParser';
import { getNightlyPrice, calculateTripPricing } from './utils/pricing';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  Bed,
  Home,
  Sun,
  Maximize,
  MinusCircle,
  Loader2,
  Info
} from 'lucide-react';
import { formatDate } from './utils/dateUtils';

function App() {
  const [view, setView] = useState<View>('HOME');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Initialize with static data, but update with fetched availability
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  
  // Search Input State (What the user types)
  const [searchDateRange, setSearchDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Booking Form Date Picker State
  const [showBookingDatePicker, setShowBookingDatePicker] = useState(false);
  const bookingDatePickerRef = useRef<HTMLDivElement>(null);
  
  // Active Filter State (What controls the list)
  const [activeFilters, setActiveFilters] = useState({
    dateRange: { startDate: null, endDate: null } as DateRange,
    isApplied: false
  });

  const [filteredProperties, setFilteredProperties] = useState<Property[]>(PROPERTIES);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  
  // Property Specific Form Data
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '1',
    message: ''
  });

  // Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  // Hero Carousel State
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [heroTouchStart, setHeroTouchStart] = useState<number | null>(null);
  const [heroTouchEnd, setHeroTouchEnd] = useState<number | null>(null);

  // --- ROUTING LOGIC ---

  // Helper to determine view based on path
  const getRouteFromPath = (path: string, allProperties: Property[]) => {
    // Normalize path by removing trailing slash if it exists (unless root)
    const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;

    if (normalizedPath.startsWith('/property/')) {
      const id = normalizedPath.split('/property/')[1];
      const prop = allProperties.find(p => p.id === id);
      return { view: 'DETAILS' as View, property: prop || null };
    }
    if (normalizedPath === '/guide') return { view: 'RECOMMENDATIONS' as View, property: null };
    if (normalizedPath === '/location') return { view: 'LOCATION' as View, property: null };
    if (normalizedPath === '/faq') return { view: 'FAQ' as View, property: null };
    if (normalizedPath === '/booking') return { view: 'BOOKING' as View, property: null };
    return { view: 'HOME' as View, property: null };
  };

  // Internal navigation helper to use History API
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    const { view: newView, property: newProp } = getRouteFromPath(path, properties);
    
    setView(newView);
    
    if (newView === 'DETAILS' && newProp) {
        setSelectedProperty(newProp);
        // Reset specific states if changing property
        setHeroImageIndex(0);
        setBookingSuccess(false);
        setBookingFormData({ name: '', email: '', phone: '', guests: '1', message: '' });
    } else {
        setSelectedProperty(null);
    }
    
    window.scrollTo(0, 0);
  };

  // Effect to listen to PopState (Back/Forward button)
  useEffect(() => {
    const handlePopState = () => {
      const { view: newView, property: newProp } = getRouteFromPath(window.location.pathname, properties);
      
      // Update View
      setView(newView);
      
      // Update Property Selection if needed
      if (newView === 'DETAILS' && newProp) {
        setSelectedProperty(newProp);
      } else {
        setSelectedProperty(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Check initial URL on mount/update to sync state
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, [properties]); // Re-run when properties update


  // Handle click outside to close date pickers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (bookingDatePickerRef.current && !bookingDatePickerRef.current.contains(event.target as Node)) {
        setShowBookingDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch Calendar Data on Mount
  useEffect(() => {
    const syncCalendars = async () => {
      const updatedProperties = await Promise.all(
        PROPERTIES.map(async (p) => {
          if (p.calendarUrl) {
            const unavailableDates = await fetchAndParseIcal(p.calendarUrl);
            if (unavailableDates.length > 0) {
              return { ...p, unavailableDates: [...p.unavailableDates, ...unavailableDates] };
            }
          }
          return p;
        })
      );
      setProperties(updatedProperties);
    };

    syncCalendars();
  }, []); // Run once on mount

  // Filter Logic
  useEffect(() => {
    let result = properties;
    
    // Filter by date availability
    if (activeFilters.dateRange.startDate && activeFilters.dateRange.endDate) {
       const start = activeFilters.dateRange.startDate;
       const end = activeFilters.dateRange.endDate;

       // Normalize to midnight for comparison timestamps
       const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
       const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();

       result = result.filter(p => {
         // Check if property has any unavailable dates within the selected range
         const hasConflict = p.unavailableDates.some(blockedIso => {
            const blockedDate = new Date(blockedIso);
            const blockedTime = new Date(blockedDate.getFullYear(), blockedDate.getMonth(), blockedDate.getDate()).getTime();
            
            // Check if blocked date is >= start AND < end
            // We use < end because if the blocked date is the checkout date, it's not a conflict for the previous night stay.
            return blockedTime >= startTime && blockedTime < endTime;
         });
         return !hasConflict;
       });
    }

    setFilteredProperties(result);
  }, [activeFilters, properties]);

  const handleDateSelect = (date: Date) => {
    let newRange = { ...searchDateRange };
    let isSelectionComplete = false;

    // Logic: 
    // If we have a start date and no end date, and the clicked date is after start date -> Complete range.
    // If we have start and end date -> Reset and start new range with clicked date.
    // If we have no start date -> Start new range.
    
    if (searchDateRange.startDate && !searchDateRange.endDate) {
      if (date >= searchDateRange.startDate) {
        newRange = { ...searchDateRange, endDate: date };
        isSelectionComplete = true;
      } else {
        // Clicked before start date, treat as new start date
        newRange = { startDate: date, endDate: null };
      }
    } else {
      // No start date OR both dates exist (reset)
      newRange = { startDate: date, endDate: null };
      // Clear filters when starting new search to indicate we are searching again
      setActiveFilters({
        dateRange: { startDate: null, endDate: null },
        isApplied: false
      });
    }

    setSearchDateRange(newRange);

    if (isSelectionComplete) {
      setShowDatePicker(false);
      
      // Auto-apply filter
      setActiveFilters({
        dateRange: newRange,
        isApplied: true
      });

      // Smooth scroll to properties
      setTimeout(() => {
        const element = document.getElementById('properties-grid');
        if (element) {
          const yOffset = -100; // Offset for sticky header
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 300);
    }
  };

  const handleDetailsDateSelect = (date: Date) => {
    let newRange = { ...searchDateRange };
    let isComplete = false;

     if (!searchDateRange.startDate || (searchDateRange.startDate && searchDateRange.endDate)) {
      newRange = { startDate: date, endDate: null };
    } else {
      if (date < searchDateRange.startDate) {
        newRange = { startDate: date, endDate: searchDateRange.startDate };
        isComplete = true;
      } else {
        newRange = { ...searchDateRange, endDate: date };
        isComplete = true;
      }
    }
    setSearchDateRange(newRange);
    
    if (isComplete) {
      setShowBookingDatePicker(false);
    }
  };

  const clearFilters = () => {
    setSearchDateRange({ startDate: null, endDate: null });
    setActiveFilters({
      dateRange: { startDate: null, endDate: null },
      isApplied: false
    });
  };

  // --- NAVIGATION HANDLERS ---
  
  const handlePropertySelect = (property: Property) => {
    navigateTo(`/property/${property.id}`);
  };

  const handleBackToHome = () => {
    navigateTo('/');
  };

  const handleNavigate = (targetView: View) => {
    switch(targetView) {
      case 'HOME':
        navigateTo('/');
        break;
      case 'RECOMMENDATIONS':
        navigateTo('/guide');
        break;
      case 'LOCATION':
        navigateTo('/location');
        break;
      case 'FAQ':
        navigateTo('/faq');
        break;
      case 'BOOKING':
        navigateTo('/booking');
        break;
      case 'DETAILS':
        // No generic path for DETAILS without ID, handled via property selection
        break;
    }
    // Mobile menu closing is handled in UI render logic
  };

  const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
     setBookingFormData({...bookingFormData, [e.target.name]: e.target.value});
  }

  // Pricing Calculation
  const getPricing = () => {
    if (!selectedProperty) return { nights: 0, subtotal: 0, total: 0, discountAmount: 0, discountLabel: '' };
    
    if (searchDateRange.startDate && searchDateRange.endDate) {
      return calculateTripPricing(
        selectedProperty.id, 
        searchDateRange.startDate, 
        searchDateRange.endDate
      );
    }
    
    return {
      nights: 0,
      subtotal: 0,
      discountAmount: 0,
      discountLabel: '',
      total: 0
    };
  };

  // Helper to generate display price props for cards
  const getCardPriceDisplay = (propertyId: string) => {
    // If dates are selected and valid range
    if (searchDateRange.startDate && searchDateRange.endDate && searchDateRange.startDate < searchDateRange.endDate) {
      const pricing = calculateTripPricing(propertyId, searchDateRange.startDate, searchDateRange.endDate);
      if (pricing.nights > 0) {
        return {
          amount: `$${Math.ceil(pricing.total)}`,
          label: 'total',
          subLabel: `${pricing.nights} nights`,
          isTotal: true
        };
      }
    }
    
    // Default / No dates selected: Show "From $X / night"
    const todayPrice = getNightlyPrice(propertyId, new Date());
    return {
      amount: `$${todayPrice}`,
      label: '/ night',
      subLabel: 'From',
      isTotal: false
    };
  };

  const pricing = getPricing();

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBooking(true);

    // Ensure we have a valid total string or '0'
    const totalValue = pricing.total > 0 ? pricing.total : 0;
    const estimatedTotalStr = totalValue > 0 ? Math.ceil(totalValue).toString() : '0';

    // Standardized Payload to match BookingView
    const payload = {
      formType: 'Property Specific Booking',
      name: bookingFormData.name,
      email: bookingFormData.email,
      phone: bookingFormData.phone,
      guests: bookingFormData.guests,
      checkIn: searchDateRange.startDate ? formatDate(searchDateRange.startDate) : 'Not specified',
      checkOut: searchDateRange.endDate ? formatDate(searchDateRange.endDate) : 'Not specified',
      interest: selectedProperty?.name || 'Unknown Property',
      // CRITICAL: Send stringified integer or '0' to satisfy Numeric column types in Sheets/Make
      estimatedTotal: estimatedTotalStr, 
      message: bookingFormData.message
    };

    try {
       const response = await fetch('https://hook.us2.make.com/v1j91fq2snhxiwzi5dxcgibvyu4xyjgg', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setBookingSuccess(true);
      } else {
        // Explicit error handling for Make.com states
        if (response.status === 404 || response.status === 500) {
          throw new Error("Make.com Scenario Error: The scenario is likely stopped/offline. Please go to Make.com and turn the scenario 'ON' (or click Run Once).");
        }
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch(err) {
      console.error('Error submitting form:', err);
      alert(`Failed to send request: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const getBalconyIcon = (type: string) => {
    if (type.includes('Large')) return <Maximize className="text-brand-clay" />;
    if (type.includes('No')) return <MinusCircle className="text-brand-clay" />;
    return <Sun className="text-brand-clay" />;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  };

  const openGallery = (index: number = 0) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  // Hero Carousel Logic
  const nextHeroImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedProperty) {
      setHeroImageIndex((prev) => (prev + 1) % selectedProperty.images.length);
    }
  };

  const prevHeroImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedProperty) {
      setHeroImageIndex((prev) => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length);
    }
  };

  const onHeroTouchStart = (e: React.TouchEvent) => {
    setHeroTouchEnd(null);
    setHeroTouchStart(e.targetTouches[0].clientX);
  };

  const onHeroTouchMove = (e: React.TouchEvent) => {
    setHeroTouchEnd(e.targetTouches[0].clientX);
  };

  const onHeroTouchEnd = () => {
    if (!heroTouchStart || !heroTouchEnd || !selectedProperty) return;
    const distance = heroTouchStart - heroTouchEnd;
    const minSwipeDistance = 50;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setHeroImageIndex((prev) => (prev + 1) % selectedProperty.images.length);
    }
    if (isRightSwipe) {
      setHeroImageIndex((prev) => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={handleBackToHome}
            >
              <div className="w-10 h-10 bg-brand-clay rounded-full flex items-center justify-center text-white font-serif text-xl mr-3 group-hover:bg-brand-terra transition-colors">
                C
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-gray-900 leading-none">Casa Primavera</h1>
                <span className="text-xs text-gray-500 tracking-widest uppercase">Sayulita, Mexico</span>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={handleBackToHome} 
                className={`text-sm font-medium transition-colors ${view === 'HOME' ? 'text-brand-clay' : 'hover:text-brand-clay'}`}
              >
                Properties
              </button>
              <button 
                onClick={() => handleNavigate('RECOMMENDATIONS')} 
                className={`text-sm font-medium transition-colors ${view === 'RECOMMENDATIONS' ? 'text-brand-clay' : 'hover:text-brand-clay'}`}
              >
                Local Guide
              </button>
              <button 
                onClick={() => handleNavigate('LOCATION')} 
                className={`text-sm font-medium transition-colors ${view === 'LOCATION' ? 'text-brand-clay' : 'hover:text-brand-clay'}`}
              >
                Location
              </button>
               <button 
                onClick={() => handleNavigate('FAQ')} 
                className={`text-sm font-medium transition-colors ${view === 'FAQ' ? 'text-brand-clay' : 'hover:text-brand-clay'}`}
              >
                FAQ
              </button>
              <button 
                onClick={() => handleNavigate('BOOKING')}
                className="px-5 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-clay transition-colors shadow-lg shadow-brand-dark/20"
              >
                Booking Request
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4">
             <button onClick={() => { handleBackToHome(); setIsMenuOpen(false); }} className="block w-full text-left font-medium py-2">Properties</button>
             <button onClick={() => { handleNavigate('RECOMMENDATIONS'); setIsMenuOpen(false); }} className="block w-full text-left font-medium py-2">Local Guide</button>
             <button onClick={() => { handleNavigate('LOCATION'); setIsMenuOpen(false); }} className="block w-full text-left font-medium py-2">Location</button>
             <button onClick={() => { handleNavigate('FAQ'); setIsMenuOpen(false); }} className="block w-full text-left font-medium py-2">FAQ</button>
             <button onClick={() => { handleNavigate('BOOKING'); setIsMenuOpen(false); }} className="block w-full text-left font-medium py-2">Booking Request</button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {view === 'HOME' && (
          <>
            {/* Hero Section */}
            <div className="relative h-[80vh] bg-gray-900 z-10">
              {/* Background Container */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/devon-hawkins-vpYjzLfzTIU-unsplash.jpg" 
                  alt="Casa Primavera Sayulita" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
              
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center items-center text-center">
                <span className="text-brand-sand uppercase tracking-[0.2em] mb-4 text-sm font-semibold animate-fade-in-up">Welcome to Paradise</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 max-w-4xl leading-tight">
                  Experience the Soul of <span className="text-brand-clay italic">Sayulita</span>
                </h2>
                
                {/* Search Bar */}
                <div 
                  className="w-full max-w-3xl bg-white rounded-3xl p-3 shadow-2xl flex flex-col md:flex-row relative animate-fade-in-up delay-100"
                  ref={datePickerRef}
                >
                  {/* Check In Input */}
                  <div 
                    className="flex-1 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer relative group flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100"
                    onClick={() => setShowDatePicker(true)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="text-brand-clay" size={18} />
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check In</label>
                    </div>
                    <div className={`font-serif text-2xl font-medium ${searchDateRange.startDate ? 'text-brand-dark' : 'text-gray-300'}`}>
                      {searchDateRange.startDate ? formatDate(searchDateRange.startDate) : 'Add Date'}
                    </div>
                  </div>
                  
                  {/* Check Out Input */}
                  <div 
                    className="flex-1 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer flex flex-col justify-center relative"
                    onClick={() => setShowDatePicker(true)}
                  >
                     <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="text-brand-clay" size={18} />
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check Out</label>
                    </div>
                     <div className={`font-serif text-2xl font-medium ${searchDateRange.endDate ? 'text-brand-dark' : 'text-gray-300'}`}>
                      {searchDateRange.endDate ? formatDate(searchDateRange.endDate) : 'Add Date'}
                    </div>

                     {/* Clear Button */}
                    {(searchDateRange.startDate || searchDateRange.endDate) && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFilters();
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-brand-clay rounded-full transition-all"
                        title="Clear Dates"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  {/* Date Picker Popup */}
                  {showDatePicker && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-xl p-2 z-[60] w-full md:w-auto animate-fade-in border border-gray-100 mx-auto flex justify-center">
                      <div className="w-full max-w-md">
                        <Calendar 
                          unavailableDates={[]} 
                          selectedStart={searchDateRange.startDate}
                          selectedEnd={searchDateRange.endDate}
                          onSelectDate={handleDateSelect}
                        />
                        <div className="p-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-b-xl">
                          <span className="text-xs text-gray-400 font-medium italic">
                            Select check-in and check-out dates
                          </span>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setShowDatePicker(false);
                             }}
                             className="text-sm bg-brand-dark text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-clay transition-colors shadow-lg shadow-brand-dark/20"
                           >
                             Close
                           </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div id="properties-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-0">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-brand-dark mb-3">Our Collection</h3>
                  <p className="text-gray-500 max-w-xl">
                    Explore our 10 unique properties across three distinct room types, ranging from different balcony sizes to unique room layouts. 
                    All properties feature our signature boho style and are ideally located on the peaceful south side of town.
                  </p>
                </div>
                <div className="hidden md:block text-sm text-gray-400">
                  Showing {filteredProperties.length} properties
                </div>
              </div>

              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProperties.map(property => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      onViewDetails={handlePropertySelect} 
                      priceDisplay={getCardPriceDisplay(property.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                  <p className="text-xl text-gray-500">No properties available for these dates.</p>
                  <button onClick={clearFilters} className="mt-4 text-brand-clay font-semibold hover:underline">Clear Filters</button>
                </div>
              )}
            </div>
            
            {/* Amenities Section */}
            <div id="amenities" className="bg-brand-sand/30 py-20">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-16">
                    <span className="text-brand-clay font-bold tracking-widest uppercase text-sm">Everything you need</span>
                    <h2 className="text-4xl font-serif font-bold mt-2 text-brand-dark">Curated Amenities</h2>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {AMENITIES_LIST.map((amenity, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-sand hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-brand-sand rounded-full flex items-center justify-center text-brand-clay mb-4">
                          <CheckCircle size={24} />
                        </div>
                        <span className="font-semibold text-gray-800">{amenity}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* Testimonials Section */}
            <Testimonials />
          </>
        )}

        {view === 'LOCATION' && (
          <LocationView />
        )}

        {view === 'RECOMMENDATIONS' && (
          <RecommendationsView />
        )}

        {view === 'FAQ' && (
          <FAQView onContactClick={() => handleNavigate('BOOKING')} />
        )}
        
        {view === 'BOOKING' && (
          <BookingView onNavigateToGuide={() => handleNavigate('RECOMMENDATIONS')} />
        )}

        {view === 'DETAILS' && selectedProperty && (
          <div className="animate-fade-in pb-20">
            {/* Property Hero */}
            <div 
              className="relative h-[60vh] cursor-pointer group overflow-hidden touch-pan-y"
              onClick={() => openGallery(heroImageIndex)}
              onTouchStart={onHeroTouchStart}
              onTouchMove={onHeroTouchMove}
              onTouchEnd={onHeroTouchEnd}
            >
              <img 
                src={selectedProperty.images[heroImageIndex]} 
                alt={selectedProperty.name} 
                onError={handleImageError}
                className="w-full h-full object-cover transition-transform duration-700 select-none"
              />
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/20"></div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleBackToHome(); }}
                className="absolute top-24 left-4 md:left-8 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center hover:bg-white/30 transition-colors z-20"
              >
                <ChevronLeft className="mr-2" size={20} /> Back to Properties
              </button>

              {/* Carousel Controls - Only show if more than 1 image */}
              {selectedProperty.images.length > 1 && (
                <>
                  <button 
                    onClick={prevHeroImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextHeroImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                     {selectedProperty.images.slice(0, 5).map((_, idx) => (
                        <div 
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all ${idx === heroImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                        />
                     ))}
                     {selectedProperty.images.length > 5 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white/50 self-center" />
                     )}
                  </div>
                </>
              )}
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
              
                  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                      <div>
                         <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">{selectedProperty.name}</h1>
                         <div className="flex items-center text-gray-500">
                           <MapPin size={16} className="mr-1" />
                           <span>Sayulita, Mexico</span>
                         </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-left md:text-right">
                         <div className="text-3xl font-bold text-brand-clay">
                            From ${getNightlyPrice(selectedProperty.id, new Date())}
                         </div>
                         <div className="text-sm text-gray-400">per night</div>
                      </div>
                    </div>
                    
                    {/* Stats Bar */}
                    <div className="flex flex-wrap gap-4 md:gap-8 border-y border-gray-100 py-6 mb-8">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-gray-50 rounded-full">
                            <Users className="text-brand-clay" size={20} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Guests</p>
                            <p className="font-medium text-gray-800">{selectedProperty.guests} Max</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-gray-50 rounded-full">
                            <Bed className="text-brand-clay" size={20} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bedrooms</p>
                            <p className="font-medium text-gray-800">{selectedProperty.bedrooms} King</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-gray-50 rounded-full">
                            <Home className="text-brand-clay" size={20} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bathrooms</p>
                            <p className="font-medium text-gray-800">{selectedProperty.bathrooms} Full</p>
                         </div>
                       </div>

                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-gray-50 rounded-full">
                            {getBalconyIcon(selectedProperty.balconyType)}
                         </div>
                         <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Outdoor Space</p>
                            <p className="font-medium text-brand-clay">{selectedProperty.balconyType}</p>
                         </div>
                       </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4">About this space</h3>
                    <div className="text-gray-600 leading-relaxed mb-8">
                      <p className="mb-4 whitespace-pre-line">{selectedProperty.description}</p>
                      
                      <ul className="space-y-3 mt-6">
                        {selectedProperty.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                             <span className="mr-3 text-brand-clay flex-shrink-0">•</span>
                             <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-6 italic text-gray-500">
                        Experience the ultimate in relaxation. This property is professionally managed by the Casa Primavera team, ensuring high standards of cleanliness and comfort.
                      </p>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProperty.amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-clay mr-3"></div>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability Calendar Section - Restored/Added Inline */}
                  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-brand-sand">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h3 className="text-2xl font-serif font-bold text-brand-dark">Availability & Rates</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 md:mt-0">
                           <Info size={16} />
                           <span>Prices may vary by date</span>
                        </div>
                     </div>
                     <div className="max-w-xl mx-auto">
                        <Calendar 
                          unavailableDates={selectedProperty.unavailableDates} 
                          selectedStart={searchDateRange.startDate}
                          selectedEnd={searchDateRange.endDate}
                          onSelectDate={handleDetailsDateSelect}
                          getNightlyPrice={(date) => getNightlyPrice(selectedProperty.id, date)}
                        />
                        <div className="mt-6 flex flex-col items-center justify-center space-y-1 text-sm bg-brand-sand/30 p-4 rounded-xl border border-brand-sand/50">
                           <div className="font-bold text-brand-dark flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-brand-clay"></span>
                              Long Stay Discounts Available
                           </div>
                           <div className="text-gray-600 flex gap-4">
                              <span>7+ Nights: <span className="text-brand-clay font-bold">15% OFF</span></span>
                              <span>28+ Nights: <span className="text-brand-clay font-bold">30% OFF</span></span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Booking Form */}
                  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-brand-sand">
                    {bookingSuccess ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Request Sent!</h3>
                        <p className="text-gray-600 mb-6">
                          Thank you for choosing Casa Primavera. We have received your request for <strong>{selectedProperty.name}</strong> and will contact you shortly to confirm.
                          <br/><br/>
                          In the meantime, check out our local guide for more information on Sayulita and what it has to offer.
                        </p>
                        <button 
                          onClick={() => handleNavigate('RECOMMENDATIONS')}
                          className="text-brand-clay font-bold hover:underline inline-flex items-center gap-1"
                        >
                          View Local Guide <ArrowRight size={16} />
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleBookingSubmit}>
                        <h3 className="text-2xl font-serif font-bold mb-6 text-brand-dark">Book your stay</h3>
                        
                        <div className="space-y-6 mb-8">
                           {/* Interactive Date Picker */}
                           <div className="relative" ref={bookingDatePickerRef}>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dates</label>
                             <div 
                               className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-base font-medium flex items-center gap-3 cursor-pointer hover:border-brand-clay transition-colors"
                               onClick={() => setShowBookingDatePicker(!showBookingDatePicker)}
                             >
                               <CalendarIcon className="text-brand-clay" size={20} />
                               <span className={searchDateRange.startDate ? 'text-gray-900' : 'text-gray-400'}>
                               {searchDateRange.startDate ? formatDate(searchDateRange.startDate) : 'Check-in'} 
                               {' — '} 
                               {searchDateRange.endDate ? formatDate(searchDateRange.endDate) : 'Check-out'}
                               </span>
                             </div>
                             
                             {/* Popup Calendar */}
                             {showBookingDatePicker && (
                                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-xl shadow-2xl p-2 border border-gray-100 w-full sm:w-auto flex justify-center">
                                  <div className="w-full max-w-sm">
                                    <Calendar 
                                      unavailableDates={selectedProperty.unavailableDates} 
                                      selectedStart={searchDateRange.startDate}
                                      selectedEnd={searchDateRange.endDate}
                                      onSelectDate={handleDetailsDateSelect}
                                      getNightlyPrice={(date) => getNightlyPrice(selectedProperty.id, date)}
                                    />
                                    <div className="p-3 border-t border-gray-50 flex justify-end bg-gray-50/50 rounded-b-lg">
                                       <button 
                                         type="button"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           setShowBookingDatePicker(false);
                                         }}
                                         className="text-xs bg-brand-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-clay transition-colors"
                                       >
                                         Done
                                       </button>
                                    </div>
                                  </div>
                                </div>
                             )}
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                               <input 
                                 name="name" 
                                 value={bookingFormData.name} 
                                 onChange={handleBookingFormChange} 
                                 required 
                                 type="text" 
                                 className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all" 
                                 placeholder="John Doe" 
                               />
                             </div>
                             
                             <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                               <input 
                                 name="email" 
                                 value={bookingFormData.email} 
                                 onChange={handleBookingFormChange} 
                                 required 
                                 type="email" 
                                 className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all" 
                                 placeholder="john@example.com" 
                               />
                             </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                                 <input 
                                   name="phone" 
                                   value={bookingFormData.phone} 
                                   onChange={handleBookingFormChange} 
                                   required 
                                   type="tel" 
                                   className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all" 
                                   placeholder="+1 (555) 000-0000" 
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Number of Guests</label>
                                 <select 
                                   name="guests" 
                                   value={bookingFormData.guests} 
                                   onChange={handleBookingFormChange} 
                                   className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all"
                                 >
                                    <option value="1">1 Guest</option>
                                    <option value="2">2 Guests</option>
                                 </select>
                              </div>
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message (Optional)</label>
                              <textarea 
                                name="message" 
                                value={bookingFormData.message} 
                                onChange={handleBookingFormChange} 
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all h-32 resize-none" 
                                placeholder="Special requests, arrival time, etc..."
                              ></textarea>
                           </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100">
                          <div className="text-center md:text-left w-full md:w-auto">
                            <div className="text-sm text-gray-500 mb-1">Total Estimation</div>
                            <div className="text-2xl font-serif font-bold text-brand-dark">
                               ${pricing.total > 0 ? Math.ceil(pricing.total) : getNightlyPrice(selectedProperty.id, new Date())} 
                               <span className="text-base font-normal text-gray-400">
                                 {pricing.nights > 0 ? ` for ${pricing.nights} nights` : ' / night'}
                               </span>
                            </div>
                            {pricing.discountAmount > 0 && (
                              <div className="text-xs text-green-600 font-medium mt-1">
                                Saved ${Math.ceil(pricing.discountAmount)} ({pricing.discountLabel})
                              </div>
                            )}
                          </div>
                          <button 
                            type="submit"
                            disabled={isSubmittingBooking}
                            className="w-full md:w-auto px-8 py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-clay transition-colors shadow-lg shadow-brand-dark/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSubmittingBooking ? (
                              <><Loader2 className="animate-spin mr-2" /> Sending...</>
                            ) : (
                              <>Send Request <ArrowRight size={20} /></>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Global Modals/Widgets */}
      {selectedProperty && (
        <ImageGalleryModal 
          images={selectedProperty.images} 
          isOpen={isGalleryOpen} 
          onClose={() => setIsGalleryOpen(false)} 
          startIndex={galleryStartIndex} 
        />
      )}
      
      <WhatsAppWidget />

    </div>
  );
}

export default App;