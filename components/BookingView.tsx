import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, ArrowRight, MessageCircle, Calendar as CalendarIcon, X, Loader2 } from 'lucide-react';
import { Calendar } from './Calendar';
import { formatDate } from '../utils/dateUtils';

interface BookingViewProps {
  onNavigateToGuide: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({ onNavigateToGuide }) => {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Date Picker State
  const [dateRange, setDateRange] = useState<{startDate: Date | null, endDate: Date | null}>({ startDate: null, endDate: null });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '1',
    roomPreference: '',
    message: ''
  });

  // WhatsApp logic matching the widget
  const phoneNumber = '523221406649';
  const message = encodeURIComponent("Hello! I'm interested in staying at Casa Primavera.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  // Close date picker when clicking outside
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

  const handleDateSelect = (date: Date) => {
    let newRange = { ...dateRange };
    let isSelectionComplete = false;
    
    if (dateRange.startDate && !dateRange.endDate) {
      if (date >= dateRange.startDate) {
        newRange = { ...dateRange, endDate: date };
        isSelectionComplete = true;
      } else {
        // Clicked before start date, treat as new start date
        newRange = { startDate: date, endDate: null };
      }
    } else {
      // No start date OR both dates exist (reset)
      newRange = { startDate: date, endDate: null };
    }

    setDateRange(newRange);

    if (isSelectionComplete) {
      setShowDatePicker(false);
    }
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDateRange({ startDate: null, endDate: null });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Standardized Payload
    const payload = {
      formType: 'General Booking Request',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      // CRITICAL FIX: Ensure guests is numeric (strip '+') to prevent 500 errors if column is Number type
      guests: formData.guests.replace('+', ''), 
      checkIn: dateRange.startDate ? formatDate(dateRange.startDate) : 'Not specified',
      checkOut: dateRange.endDate ? formatDate(dateRange.endDate) : 'Not specified',
      interest: formData.roomPreference || 'No Preference',
      // CRITICAL FIX: Send '0' instead of text 'Pending Quote' to strictly satisfy Numeric column types
      estimatedTotal: '0',
      message: formData.message
    };

    try {
      // NOTE: Standard application/json request.
      // This requires the 'Webhook Response' module in Make to handle CORS.
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
        // Reset form
        setFormData({ name: '', email: '', phone: '', guests: '1', roomPreference: '', message: '' });
        setDateRange({ startDate: null, endDate: null });
      } else {
        // Explicit error handling for Make.com states
        if (response.status === 404 || response.status === 500) {
          throw new Error("Make.com Scenario Error: The scenario is likely stopped/offline. Please go to Make.com and turn the scenario 'ON' (or click Run Once).");
        }
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown Error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in bg-white min-h-screen">
       {/* Hero Section */}
       <div className="bg-brand-dark py-20 text-center text-white relative overflow-hidden h-[40vh] flex items-center justify-center">
          <img 
            src="https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/49-skull2.jpg" 
            alt="Casa Primavera Artistic Detail"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent"></div>
          <div className="relative z-10 max-w-2xl mx-auto px-4">
              <span className="text-brand-sand uppercase tracking-[0.2em] mb-4 text-sm font-semibold block">Plan Your Stay</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Booking Request</h1>
              <p className="text-lg text-gray-200">Submit an inquiry and we'll help you find the perfect suite for your Sayulita getaway.</p>
          </div>
       </div>

       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* The Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-brand-sand p-8 md:p-12 relative">
               {bookingSuccess ? (
                  <div className="text-center py-12">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">Request Sent Successfully!</h3>
                      <p className="text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
                        Thank you for choosing Casa Primavera. We have received your details and our team will contact you shortly to confirm availability and finalize your reservation.
                        <br /><br />
                        In the meantime, check out our local guide for more information on Sayulita and what it has to offer.
                      </p>
                      <button 
                        onClick={onNavigateToGuide}
                        className="inline-flex items-center gap-2 text-brand-clay font-bold hover:text-brand-terra transition-colors border-b-2 border-transparent hover:border-brand-terra pb-1"
                      >
                        View Local Guide <ArrowRight size={18} />
                      </button>
                  </div>
              ) : (
                  <form onSubmit={handleBookingSubmit}>
                      <div className="text-center mb-10">
                        <h3 className="text-3xl font-serif font-bold text-brand-dark mb-3">Send a Request</h3>
                        <p className="text-gray-500">Tell us what you're looking for and we'll be in touch.</p>
                      </div>
                      
                      <div className="space-y-6 mb-8">
                          {/* Custom Date Picker Section */}
                          <div className="relative" ref={datePickerRef}>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dates</label>
                            <div 
                              className="grid grid-cols-2 gap-0 border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-brand-clay transition-colors bg-gray-50"
                              onClick={() => setShowDatePicker(true)}
                            >
                              <div className="p-4 border-r border-gray-200 flex flex-col justify-center relative group">
                                <div className="flex items-center gap-2 mb-1">
                                  <CalendarIcon className="text-brand-clay" size={16} />
                                  <span className="text-xs font-bold text-gray-400 uppercase">Check In</span>
                                </div>
                                <div className={`font-medium ${dateRange.startDate ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {dateRange.startDate ? formatDate(dateRange.startDate) : 'Select Date'}
                                </div>
                              </div>
                              
                              <div className="p-4 flex flex-col justify-center relative">
                                <div className="flex items-center gap-2 mb-1">
                                  <CalendarIcon className="text-brand-clay" size={16} />
                                  <span className="text-xs font-bold text-gray-400 uppercase">Check Out</span>
                                </div>
                                <div className={`font-medium ${dateRange.endDate ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {dateRange.endDate ? formatDate(dateRange.endDate) : 'Select Date'}
                                </div>

                                {/* Clear Button */}
                                {(dateRange.startDate || dateRange.endDate) && (
                                  <button 
                                    onClick={clearDates}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-full transition-all"
                                    title="Clear Dates"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Calendar Popup */}
                            {showDatePicker && (
                              <div className="absolute top-full left-0 right-0 mt-2 z-20 flex justify-center">
                                <div className="bg-white rounded-xl shadow-2xl p-2 border border-gray-100 w-full md:w-auto">
                                  <Calendar 
                                    unavailableDates={[]} 
                                    selectedStart={dateRange.startDate}
                                    selectedEnd={dateRange.endDate}
                                    onSelectDate={handleDateSelect}
                                  />
                                  <div className="p-3 border-t border-gray-50 flex justify-end bg-gray-50/50 rounded-b-lg">
                                     <button 
                                       type="button"
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         setShowDatePicker(false);
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
                                  value={formData.name}
                                  onChange={handleInputChange}
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
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  required 
                                  type="email" 
                                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all" 
                                  placeholder="john@example.com" 
                                />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                <input 
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
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
                                  value={formData.guests}
                                  onChange={handleInputChange}
                                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-gray-700"
                                >
                                    <option value="1">1 Guest</option>
                                    <option value="2">2 Guests</option>
                                    <option value="3">3 Guests</option>
                                    <option value="4">4 Guests</option>
                                    <option value="5">5+ Guests</option>
                                </select>
                            </div>
                          </div>

                          <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Room Preference</label>
                                <div className="relative">
                                  <select 
                                    name="roomPreference"
                                    value={formData.roomPreference}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-gray-700"
                                  >
                                      <option value="No Preference">No Preference</option>
                                      <option value="Large Terrace">Large Terrace</option>
                                      <option value="Small Balcony">Small Balcony</option>
                                      <option value="No Balcony">No Balcony</option>
                                  </select>
                                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                  </div>
                                </div>
                            </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message (Optional)</label>
                              <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all h-32 resize-none" 
                                placeholder="Tell us about your trip..."
                              ></textarea>
                          </div>
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-clay transition-colors shadow-lg shadow-brand-dark/20 flex items-center justify-center group text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="animate-spin mr-2" /> Sending Request...</>
                        ) : (
                          <>Submit Booking Request <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </button>
                      
                      {/* WhatsApp Integration */}
                      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                          <p className="text-sm text-gray-500 mb-3 font-medium">Want to contact us via WhatsApp? Please do so here.</p>
                          <a 
                              href={whatsappUrl}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 text-[#25D366] font-bold hover:bg-[#25D366]/10 px-4 py-2 rounded-lg transition-colors"
                          >
                              <MessageCircle size={20} />
                              Chat on WhatsApp
                          </a>
                      </div>
                  </form>
              )}
          </div>
       </div>
    </div>
  )
}