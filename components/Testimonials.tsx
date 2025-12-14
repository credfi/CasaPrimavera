import React from 'react';
import { Star, Quote, MapPin } from 'lucide-react';

const REVIEWS = [
  {
    name: "Mark",
    location: "Vancouver, Canada",
    date: "April 2025",
    rating: 5,
    text: "We had an amazing time staying here! The location was perfect—just a short walk to the beach, restaurants, and all the action, but still quiet enough at night to relax and sleep well. The space was clean, cozy, and had everything we needed for a comfortable stay."
  },
  {
    name: "Luke",
    location: "La Vista, Nebraska",
    date: "January 2025",
    rating: 5,
    text: "I loved this place! It was the perfect amount of space for just me. It also had a really nice balcony for viewing Sayulita."
  },
  {
    name: "Michele",
    location: "Kinnelon, New Jersey",
    date: "March 2024",
    rating: 5,
    text: "This was the perfect Airbnb for a solo female traveler! I stayed for almost two weeks and genuinely felt like it became my little home. The patio was stellar too to have my morning coffee on and work from."
  },
  {
    name: "Steph",
    location: "New York, New York",
    date: "May 2025",
    rating: 5,
    text: "If it's your first time coming to Sayulita, this is a great spot. It's 5 minutes from the center, 5 minutes from the beach, yet quiet enough to sleep at night. If you're on a budget it's great. Recommend going for one of the units with a balcony!"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-brand-clay font-bold tracking-widest uppercase text-sm">Guest Love</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 text-brand-dark">Stories from our Stays</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Don't just take our word for it. Here is what travelers from around the world have to say about their time at Casa Primavera.
          </p>
        </div>

        {/* Grid adjusted for 4 items: 1 col on mobile, 2 cols on tablet/desktop (2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {REVIEWS.map((review, idx) => (
            <div 
              key={idx} 
              className="bg-gray-50 p-8 rounded-2xl relative group hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1"
            >
              <Quote className="absolute top-6 right-6 text-brand-clay/10 w-12 h-12 transform -scale-x-100 transition-colors group-hover:text-brand-clay/20" />
              
              <div className="flex gap-1 mb-6 text-brand-clay">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-gray-600 italic mb-8 flex-grow leading-relaxed relative z-10">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto border-t border-gray-200/60 pt-6">
                <div className="w-12 h-12 bg-brand-sand rounded-full flex items-center justify-center font-serif font-bold text-brand-clay text-lg shadow-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-brand-dark">{review.name}</div>
                  <div className="text-xs text-gray-400 flex flex-wrap items-center gap-x-2">
                    {review.location && (
                      <span className="flex items-center gap-1">
                         <MapPin size={10} /> {review.location}
                      </span>
                    )}
                    {review.location && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
                    <span className="font-medium text-brand-clay/80 uppercase tracking-wide text-[10px]">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};