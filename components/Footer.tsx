import React from 'react';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-brand-dark text-white pt-12 pb-8 border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => onNavigate('HOME')}
            >
               <div className="w-10 h-10 bg-brand-clay rounded-full flex items-center justify-center text-white font-serif text-xl font-bold group-hover:bg-brand-terra transition-colors">C</div>
               <span className="font-serif text-2xl font-bold">Casa Primavera</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Experience the authentic soul of Sayulita. Luxury comfort meets bohemian vibes in the heart of Riviera Nayarit's most vibrant pueblo.
            </p>
            <div className="flex gap-4 pt-2">
               <a href="https://www.instagram.com/primaverasayulita" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-clay hover:text-white transition-all text-gray-400">
                 <Instagram size={18} />
               </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-white">Explore</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => onNavigate('HOME')} className="hover:text-brand-clay transition-colors flex items-center gap-2">Properties</button></li>
              <li><button onClick={() => onNavigate('RECOMMENDATIONS')} className="hover:text-brand-clay transition-colors flex items-center gap-2">Local Guide</button></li>
              <li><button onClick={() => onNavigate('LOCATION')} className="hover:text-brand-clay transition-colors flex items-center gap-2">Location</button></li>
              <li><button onClick={() => onNavigate('FAQ')} className="hover:text-brand-clay transition-colors flex items-center gap-2">FAQ</button></li>
              <li><button onClick={() => onNavigate('BOOKING')} className="hover:text-brand-clay transition-colors flex items-center gap-2">Booking Request</button></li>
            </ul>
          </div>

          {/* Visit Us */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-white">Visit Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-clay mt-0.5 flex-shrink-0" />
                <span>66 Calle Primavera<br/>Sayulita, Nayarit, Mexico<br/>63734</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-clay flex-shrink-0" />
                <a href="mailto:primaverasayulita@gmail.com" className="hover:text-white transition-colors break-all">primaverasayulita@gmail.com</a>
              </li>
               <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-clay flex-shrink-0" />
                <a href="tel:+523221406649" className="hover:text-white transition-colors">+52 322 140 6649</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Casa Primavera Sayulita. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};