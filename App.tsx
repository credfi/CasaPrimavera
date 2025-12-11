import React, { useState, useEffect, useRef } from 'react';
import { PROPERTIES, AMENITIES_LIST } from './constants';
import { Property, DateRange } from './types';
import { PropertyCard } from './components/PropertyCard';
import { Calendar } from './components/Calendar';
import { LocationView } from './components/LocationView';
import { RecommendationsView } from './components/RecommendationsView';
import { FAQView } from './components/FAQView';
import { ContactView } from './components/ContactView';
import { fetchAndParseIcal } from './utils/icalParser';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Menu, 
  X, 
  Search, 
  ArrowRight, 
  CheckCircle,
  Instagram,
  Facebook,
  Mail,
  Phone,
  ChevronLeft,
  Users,
  Bed,
  Home,
  Sun,
  Maximize,
  MinusCircle
} from 'lucide-react';
import { formatDate, isDateInRange, toISODate } from './utils/dateUtils';

// Simple Router implementation
type View = 'HOME' | 'DETAILS' | 'LOCATION' | 'RECOMMENDATIONS' | 'FAQ' | 'CONTACT';

function App() {
  const [view, setView] = useState<View>('HOME');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Initialize with static data, but update with fetched availability
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  
  // Search Input State (What the user types)
  const [searchDateRange, setSearchDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  // Active Filter State (What controls the list)
  const [activeFilters, setActiveFilters] = useState({
    dateRange: { startDate: null, endDate: null } as DateRange,
    isApplied: false
  });

  const [filteredProperties, setFilteredProperties] = useState<Property[]>(PROPERTIES);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Handle click outside to close date picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
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
      
      // Also update selectedProperty if it exists and was updated
      if (selectedProperty) {
         const updatedSelected = updatedProperties.find(p => p.id === selectedProperty.id);
         if (updatedSelected) setSelectedProperty(updatedSelected);
      }
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
     if (!searchDateRange.startDate || (searchDateRange.startDate && searchDateRange.endDate)) {
      setSearchDateRange({ startDate: date, endDate: null });
    } else {
      if (date < searchDateRange.startDate) {
        setSearchDateRange({ startDate: date, endDate: searchDateRange.startDate });
      } else {
        setSearchDateRange({ ...searchDateRange, endDate: date });
      }
    }
  };

  const clearFilters = () => {
    setSearchDateRange({ startDate: null, endDate: null });
    setActiveFilters({
      dateRange: { startDate: null, endDate: null },
      isApplied: false
    });
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setView('DETAILS');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setView('HOME');
    setSelectedProperty(null);
    setBookingSuccess(false);
    window.scrollTo(0, 0);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setBookingSuccess(true);
    }, 1000);
  };

  const getBalconyIcon = (type: string) => {
    if (type.includes('Large')) return <Maximize className="text-brand-clay" />;
    if (type.includes('No')) return <MinusCircle className="text-brand-clay" />;
    return <Sun className="text-brand-clay" />;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
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
                onClick={() => { setView('RECOMMENDATIONS'); window.scrollTo(0, 0); }} 
                className={`text-sm font-medium transition-colors ${view === 'RECOMMENDATIONS' ? 'text-brand-clay' : 'hover:text-brand-clay'}`}
              >
                Local Guide
              </button>
              <button 
                onClick={() => { setView('LOCATION'); window.scrollTo(0, 0); }} 
                className={`text-sm font-medium transition-colors ${view === 'LOCATION' ? 'text-brand-clay' : 'hover:text-brand-clay'}`}
              >
                Location
              </button>
               <button 
                onClick={() => { setView('FAQ'); window.scrollTo(0, 0); }} 
                className={`text-sm font-medium transition-colors ${view === 'FAQ' ? 'text-brand-clay' : 'hover:text-brand-clay'}`}
              >
                FAQ
              </button>
              <button className="px-5 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-clay transition-colors shadow-lg shadow-brand-dark/20">
                Book Now
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
             <button onClick={() => { setView('RECOMMENDATIONS'); setIsMenuOpen(false); }} className="block w-full text-left font-medium py-2">Local Guide</button>
             <button onClick={() => { setView('LOCATION'); setIsMenuOpen(false); }} className="block w-full text-left font-medium py-2">Location</button>
             <button onClick={() => { setView('FAQ'); setIsMenuOpen(false); }} className="block w-full text-left font-medium py-2">FAQ</button>
             <button onClick={() => { setView('CONTACT'); setIsMenuOpen(false); }} className="block w-full text-left font-medium py-2">Contact</button>
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
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="Tropical resort pool" 
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
                             className="text-sm bg-brand-dark text-white px-6 py-2 rounded-xl font-medium hover:bg-brand-clay transition-colors shadow-lg shadow-brand-dark/20"
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
                    Discover our ten unique properties, from intimate garden casitas to expansive ocean-view villas. 
                    Direct booking guarantees the best rates.
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
          </>
        )}

        {view === 'LOCATION' && (
          <LocationView />
        )}

        {view === 'RECOMMENDATIONS' && (
          <RecommendationsView />
        )}

        {view === 'FAQ' && (
          <FAQView />
        )}

        {view === 'CONTACT' && (
          <ContactView />
        )}

        {view === 'DETAILS' && selectedProperty && (
          <div className="animate-fade-in pb-20">
            {/* Property Hero */}
            <div className="relative h-[60vh]">
              <img 
                src={selectedProperty.images[0]} 
                alt={selectedProperty.name} 
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <button 
                onClick={handleBackToHome}
                className="absolute top-24 left-4 md:left-8 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="mr-2" size={20} /> Back to Properties
              </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
              <div className="flex flex-col lg:flex-row gap-12">
                
                {/* Left Column: Info */}
                <div className="flex-1">
                  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                         <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">{selectedProperty.name}</h1>
                         <div className="flex items-center text-gray-500">
                           <MapPin size={16} className="mr-1" />
                           <span>Sayulita, Mexico</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-3xl font-bold text-brand-clay">${selectedProperty.pricePerNight}</div>
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

                  {/* Calendar Widget */}
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                      <span>Availability</span>
                      <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                         Synced with Airbnb
                      </span>
                    </h3>
                    <Calendar 
                      unavailableDates={selectedProperty.unavailableDates}
                      selectedStart={searchDateRange.startDate}
                      selectedEnd={searchDateRange.endDate}
                      onSelectDate={handleDetailsDateSelect}
                    />
                  </div>
                </div>

                {/* Right Column: Sticky Booking Form */}
                <div className="lg:w-[400px]">
                  <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24 border border-brand-sand">
                    {bookingSuccess ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Request Sent!</h3>
                        <p className="text-gray-600 mb-6">
                          Thank you for choosing Casa Primavera. We have received your request for <strong>{selectedProperty.name}</strong> and will contact you shortly to confirm.
                        </p>
                        <button 
                          onClick={() => setBookingSuccess(false)}
                          className="text-brand-clay font-bold hover:underline"
                        >
                          Book another stay
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleBookingSubmit}>
                        <h3 className="text-2xl font-serif font-bold mb-6 text-brand-dark">Book your stay</h3>
                        
                        <div className="space-y-4 mb-6">
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dates</label>
                             <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm font-medium">
                               {searchDateRange.startDate ? formatDate(searchDateRange.startDate) : 'Check-in'} 
                               {' → '} 
                               {searchDateRange.endDate ? formatDate(searchDateRange.endDate) : 'Check-out'}
                             </div>
                           </div>
                           
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                             <input required type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                           </div>
                           
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                             <input required type="email" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                           </div>

                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Message (Optional)</label>
                             <textarea className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all h-24 resize-none" placeholder="Special requests, arrival time..."></textarea>
                           </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-2">
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-600">${selectedProperty.pricePerNight} x 5 nights</span>
                             <span className="font-medium">${selectedProperty.pricePerNight * 5}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-600">Cleaning Fee</span>
                             <span className="font-medium">$100</span>
                           </div>
                           <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg text-brand-dark">
                             <span>Total</span>
                             <span>${selectedProperty.pricePerNight * 5 + 100}</span>
                           </div>
                        </div>
                        
                        <button 
                          type="submit"
                          className="w-full bg-brand-clay text-white font-bold py-4 rounded-xl hover:bg-brand-terra transition-colors shadow-lg shadow-brand-clay/20 flex items-center justify-center"
                        >
                          Request to Book <ArrowRight size={18} className="ml-2" />
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-4">You won't be charged yet.</p>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image Grid (More photos) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
               <h3 className="text-2xl font-serif font-bold mb-6">Gallery</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProperty.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt="Property detail" 
                      onError={handleImageError}
                      className="w-full h-80 object-cover rounded-xl" 
                    />
                  ))}
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-brand-dark text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-1 md:col-span-5">
             <div className="w-12 h-12 bg-brand-clay rounded-full flex items-center justify-center text-white font-serif text-2xl mb-6">
                C
             </div>
             <h2 className="font-serif text-3xl font-bold mb-4">Casa Primavera</h2>
             <p className="text-gray-400 max-w-sm mb-6">
               A collection of luxury properties in the heart of Sayulita, Mexico. 
               Experience the perfect blend of modern comfort and Mexican tradition.
             </p>
             <div className="flex space-x-4">
               <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-clay transition-colors"><Instagram size={20} /></a>
               <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-clay transition-colors"><Facebook size={20} /></a>
             </div>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={handleBackToHome} className="hover:text-brand-clay">Our Properties</button></li>
              <li><button onClick={() => { setView('RECOMMENDATIONS'); window.scrollTo(0, 0); }} className="hover:text-brand-clay">Local Guide</button></li>
              <li><button onClick={() => { setView('LOCATION'); window.scrollTo(0, 0); }} className="hover:text-brand-clay">About Sayulita</button></li>
              <li><button onClick={() => { setView('FAQ'); window.scrollTo(0, 0); }} className="hover:text-brand-clay">FAQ</button></li>
              <li><button onClick={() => { setView('CONTACT'); window.scrollTo(0, 0); }} className="hover:text-brand-clay">Contact Us</button></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-4">
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <MapPin className="mr-3 text-brand-clay flex-shrink-0" size={20} />
                <span>66 Calle Primavera,<br/>Sayulita, Mexico</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-brand-clay flex-shrink-0" size={20} />
                <a href="mailto:primaverasayulita@gmail.com" className="hover:text-brand-clay transition-colors break-all">primaverasayulita@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-brand-clay flex-shrink-0" size={20} />
                <a href="tel:+523221406649" className="hover:text-brand-clay transition-colors">+52 322 140 6649</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
           © {new Date().getFullYear()} Casa Primavera Sayulita. All rights reserved.
        </div>
      </footer>
      
      {/* Import chevron left for the back button in details view */}
      <div className="hidden">
        <ChevronLeft />
      </div>
    </div>
  );
}

export default App;