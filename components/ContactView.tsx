import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Loader2, ArrowRight } from 'lucide-react';

interface ContactViewProps {
  onNavigateToGuide: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigateToGuide }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Booking Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Standardized Payload to match BookingView and App forms
    // FIXED: Changed 'N/A' values to match the formats used in BookingView
    // to prevents 500 errors in Make.com caused by data type mismatches (e.g. text in a number column).
    const payload = {
      formType: 'Contact Form',
      name: formData.name,
      email: formData.email,
      phone: 'Not Provided', 
      guests: '1', // Default to '1' instead of 'N/A' to ensure compatibility with Number columns in Sheets
      checkIn: 'Not specified', // Match BookingView format
      checkOut: 'Not specified', // Match BookingView format
      interest: formData.category, 
      // CRITICAL FIX: Send '0' instead of text 'Pending Inquiry' to strictly satisfy Numeric column types
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
        setSubmitted(true);
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

  const categories = [
    "Booking Inquiry",
    "General Questions",
    "Partnership Inquiry",
    "Long-Term Stay / Monthly Rates",
    "Feedback"
  ];

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-brand-dark">
         <img 
          src="https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80" 
          alt="Contact us desk concept" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-brand-sand uppercase tracking-[0.2em] mb-4 text-sm font-semibold block">We'd love to hear from you</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Get in Touch
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">Let's start a conversation</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                Whether you're planning your dream vacation, interested in a long-term stay, or just have a question about Sayulita, our team is here to help.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 p-6 bg-brand-sand/20 rounded-xl border border-brand-sand">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-clay shadow-sm flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-dark mb-1">Email Us</h3>
                  <p className="text-gray-600 mb-2">For general inquiries and booking questions.</p>
                  <a href="mailto:primaverasayulita@gmail.com" className="text-brand-clay font-semibold hover:underline break-all">primaverasayulita@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 bg-brand-sand/20 rounded-xl border border-brand-sand">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-clay shadow-sm flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-dark mb-1">Call Us</h3>
                  <p className="text-gray-600 mb-2">Mon-Fri from 9am to 6pm CST.</p>
                  <a href="tel:+523221406649" className="text-brand-clay font-semibold hover:underline">+52 322 140 6649</a>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 bg-brand-sand/20 rounded-xl border border-brand-sand">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-clay shadow-sm flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-dark mb-1">Visit Us</h3>
                  <p className="text-gray-600 mb-2">66 Calle Primavera, Sayulita, Mexico</p>
                  <button 
                    onClick={() => document.getElementById('map-frame')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-brand-clay font-semibold hover:underline"
                  >
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-brand-dark mb-4">Message Sent!</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Thank you for reaching out to Casa Primavera. We've received your inquiry and will get back to you within 24 hours.
                  <br /><br />
                  While you wait, explore our curated guide to Sayulita's best spots.
                </p>
                <button 
                  onClick={onNavigateToGuide}
                  className="px-8 py-3 bg-brand-clay text-white font-bold rounded-lg hover:bg-brand-clay transition-colors inline-flex items-center gap-2"
                >
                  View Local Guide <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">Send a Message</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      required
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Topic</label>
                  <div className="relative">
                    <select 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <MessageSquare size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                  <textarea 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-clay focus:border-transparent outline-none transition-all h-40 resize-none"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-clay transition-all shadow-lg shadow-brand-dark/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin mr-2" /> Sending...</>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};