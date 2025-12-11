import React from 'react';
import { MapPin, Plane, Car, Navigation, Sun } from 'lucide-react';

export const LocationView: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-brand-dark overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Sayulita Streets" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center px-4">
          <span className="text-brand-sand uppercase tracking-[0.2em] mb-4 text-sm font-semibold block">Discover Our Neighborhood</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Where Jungle Meets Ocean
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Column */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center space-x-2 text-brand-clay mb-4">
                <MapPin size={24} />
                <span className="font-bold tracking-widest uppercase text-sm">The Address</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Casa Primavera Sayulita</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                66 Calle Primavera<br />
                Sayulita, Nayarit<br />
                Mexico, 63734
              </p>
              <p className="mt-4 text-gray-500">
                Located in the peaceful North End of Sayulita, away from the noise of the town square but just a short stroll to the beach.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-10">
              <h3 className="text-2xl font-serif font-bold text-brand-dark mb-8">Getting Here</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-sand rounded-full flex items-center justify-center text-brand-clay">
                    <Plane size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">Fly to Puerto Vallarta (PVR)</h4>
                    <p className="text-gray-600 mt-1">
                      Our nearest international airport is Puerto Vallarta (PVR). It supports direct flights from many major US and Canadian cities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-sand rounded-full flex items-center justify-center text-brand-clay">
                    <Car size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">The Drive to Sayulita</h4>
                    <p className="text-gray-600 mt-1">
                      Sayulita is a beautiful 1-hour drive through the jungle from the airport. We recommend booking a private SUV transfer or renting a car if you plan to explore surrounding towns.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-sand rounded-full flex items-center justify-center text-brand-clay">
                    <Navigation size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">Getting Around</h4>
                    <p className="text-gray-600 mt-1">
                      Once here, Sayulita is very walkable. For exploring the hills or carrying surfboards, golf carts are the preferred mode of local transport. We can assist with rentals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div className="h-full min-h-[500px] relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src="https://maps.google.com/maps?q=Casa+Primavera+Sayulita&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
              title="Casa Primavera Sayulita Location"
            ></iframe>
            
            {/* Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
               <div className="flex items-center justify-between">
                 <div>
                   <h4 className="font-bold text-brand-dark">Explore the Area</h4>
                   <p className="text-xs text-gray-500 mt-1">Prime location in the Riviera Nayarit</p>
                 </div>
                 <a 
                   href="https://maps.app.goo.gl/yVCofPEqz7cUxfa2A" 
                   target="_blank" 
                   rel="noreferrer"
                   className="px-4 py-2 bg-brand-clay text-white text-sm font-bold rounded-lg hover:bg-brand-terra transition-colors flex items-center gap-2"
                 >
                   Open in Maps <Navigation size={14} />
                 </a>
               </div>
            </div>
          </div>

        </div>

        {/* Nearby Highlights */}
        <div className="mt-20">
          <h3 className="text-2xl font-serif font-bold text-brand-dark mb-8 text-center">Nearby Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { name: 'Sayulita Beach', time: '5 min walk', icon: <Sun size={20} /> },
               { name: 'Town Plaza', time: '10 min walk', icon: <MapPin size={20} /> },
               { name: 'Playa de los Muertos', time: '15 min walk', icon: <Sun size={20} /> },
               { name: 'San Pancho', time: '15 min drive', icon: <Car size={20} /> },
             ].map((item, i) => (
               <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-brand-sand flex flex-col items-center text-center">
                 <div className="text-brand-clay mb-2">{item.icon}</div>
                 <div className="font-bold text-gray-800">{item.name}</div>
                 <div className="text-xs text-gray-400">{item.time}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};