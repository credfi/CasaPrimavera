import React from 'react';
import { Property } from '../types';
import { Users, Bed, Home, Star, Sun, Maximize, MinusCircle, ImageOff } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  // Helper to get icon for balcony type
  const getBalconyIcon = (type: string) => {
    if (type.includes('Large')) return <Maximize size={16} />;
    if (type.includes('No')) return <MinusCircle size={16} />;
    return <Sun size={16} />;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image for ${property.name}: ${e.currentTarget.src}`);
    // Fallback to a high-quality tropical placeholder if the custom image fails
    e.currentTarget.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-sand">
      <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
        <img 
          src={property.images[0]} 
          alt={property.name} 
          onError={handleImageError}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-dark z-10">
          {property.type}
        </div>
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
          <div>
            <span className="text-xl font-bold text-brand-terra">${property.pricePerNight}</span>
            <span className="text-gray-400 text-sm"> / night</span>
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