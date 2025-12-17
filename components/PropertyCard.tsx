import React, { useState } from 'react';
import { Property } from '../types';
import { Users, Bed, Home, Star, Sun, Maximize, MinusCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  priceDisplay?: {
    amount: string;
    label: string;
    subLabel?: string;
    isTotal?: boolean;
  };
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails, priceDisplay }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Helper to get icon for balcony type
  const getBalconyIcon = (type: string) => {
    if (type.includes('Large')) return <Maximize size={16} />;
    if (type.includes('No')) return <MinusCircle size={16} />;
    return <Sun size={16} />;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback to a high-quality tropical placeholder if the custom image fails
    e.currentTarget.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Touch handlers for swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swiped left -> Next image
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
    
    if (isRightSwipe) {
      // Swiped right -> Previous image
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-sand">
      {/* Image Carousel Container */}
      <div 
        className="relative h-64 bg-gray-100 flex items-center justify-center group/image cursor-pointer touch-pan-y"
        onClick={() => onViewDetails(property)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img 
          src={property.images[currentImageIndex]} 
          alt={`${property.name} - View ${currentImageIndex + 1}`}
          onError={handleImageError}
          className="w-full h-full object-cover transition-opacity duration-300 select-none"
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-dark z-10">
          {property.type}
        </div>

        {/* Carousel Controls */}
        {property.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md opacity-0 group-hover/image:opacity-100 transition-all duration-200 z-20 text-brand-dark hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md opacity-0 group-hover/image:opacity-100 transition-all duration-200 z-20 text-brand-dark hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/10 backdrop-blur-[2px] px-2 py-1 rounded-full pointer-events-none">
              {property.images.slice(0, 5).map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 ${
                    idx === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50'
                  }`}
                />
              ))}
              {property.images.length > 5 && (
                <div className="w-1 h-1 rounded-full bg-white/50 self-center" />
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-brand-dark">{property.name}</h3>
          <div className="flex items-center space-x-1 text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-medium text-gray-700">{property.rating}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{property.guests}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bed size={16} />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Home size={16} />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center space-x-1 text-brand-clay font-medium">
            {getBalconyIcon(property.balconyType)}
            <span>{property.balconyType}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {priceDisplay ? (
               <>
                 {priceDisplay.subLabel && (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                      {priceDisplay.subLabel}
                    </span>
                 )}
                 <div>
                   <span className="text-xl font-bold text-brand-terra">{priceDisplay.amount}</span>
                   <span className={`text-sm ${priceDisplay.isTotal ? 'text-gray-700 font-medium' : 'text-gray-400'}`}> {priceDisplay.label}</span>
                 </div>
               </>
            ) : (
               /* Fallback if no prop provided */
               <div>
                  <span className="text-xl font-bold text-brand-terra">${property.pricePerNight} USD</span>
                  <span className="text-gray-400 text-sm"> / night</span>
               </div>
            )}
          </div>
          <button 
            onClick={() => onViewDetails(property)}
            className="px-5 py-2 bg-brand-dark text-white text-sm font-medium rounded-lg hover:bg-brand-clay transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};