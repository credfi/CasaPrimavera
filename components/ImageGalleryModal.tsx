import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  startIndex?: number;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ images, isOpen, onClose, startIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
      document.body.style.overflow = 'hidden'; // Prevent scrolling background
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, startIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in" onClick={onClose}>
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
        aria-label="Close gallery"
      >
        <X size={24} />
      </button>

      <button 
        onClick={showPrev}
        className="absolute left-6 z-50 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all hidden md:flex hover:scale-110 active:scale-95"
        aria-label="Previous image"
      >
        <ChevronLeft size={32} />
      </button>

      <button 
        onClick={showNext}
        className="absolute right-6 z-50 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all hidden md:flex hover:scale-110 active:scale-95"
        aria-label="Next image"
      >
        <ChevronRight size={32} />
      </button>

      <div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center">
        <img 
          src={images[currentIndex]} 
          alt={`Gallery view ${currentIndex + 1}`}
          onError={handleImageError}
          className="max-w-full max-h-full object-contain shadow-2xl rounded-md cursor-default select-none"
          onClick={(e) => e.stopPropagation()} 
        />
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/90 font-medium text-sm bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};