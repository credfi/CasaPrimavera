import React from 'react';
import { Sun, Waves, Coffee, Utensils, Moon, Music, ShoppingBag, MapPin, Star, Heart } from 'lucide-react';

export const RecommendationsView: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white">
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src="https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/alice-kotlyarenko-dyDr19bQldc-unsplash.jpg" alt="Traditional Sayulita Mexico guide colorful flags and vibe" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-brand-sand uppercase tracking-[0.2em] mb-4 text-sm font-semibold block">Curated by locals at Casa Primavera</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Ultimate Sayulita Local Guide</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">Explore the best of Sayulita, Mexico. From secret jungle beaches to authentic street tacos, discover why boho rentals here are so special.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-20">
            <section id="beaches">
              <div className="flex items-center gap-3 mb-8"><Waves className="text-brand-clay" size={32} /><h2 className="text-3xl font-serif font-bold text-brand-dark">Sayulita Beaches & Best Surf Spots</h2></div>
              <div className="space-y-8">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="bg-brand-dark/5 p-4 border-b border-gray-100 font-bold text-lg flex justify-between items-center"><span>Relaxation & Sunsets</span><Sun size={20} className="text-orange-400" /></div>
                  <div className="divide-y divide-gray-100">
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">Carricetos Beach</h4>
                      <p className="text-sm text-gray-600 mt-1">The best sunset spot in Sayulita. A beautiful 30-minute jungle walk south from Casa Primavera.</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">Playa de los Muertos</h4>
                      <p className="text-sm text-gray-600 mt-1">A quiet alternative to the main beach. Only a 15-minute stroll through the iconic cemetery path.</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">Mal Paso</h4>
                      <p className="text-sm text-gray-600 mt-1">A secluded beach north of town center. Perfect for a day trip from your boho rental.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                   <div className="bg-brand-dark/5 p-4 border-b border-gray-100 font-bold text-lg flex justify-between items-center"><span>Surf Locations near Sayulita</span><Waves size={20} className="text-blue-500" /></div>
                  <div className="divide-y divide-gray-100">
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">La Lanchas</h4>
                      <p className="text-sm text-gray-600 mt-1">Premier surf break. A short drive south from Casa Primavera's South Side location.</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">Punta Mita Anclote</h4>
                      <p className="text-sm text-gray-600 mt-1">Great for longboards and beginners visiting the Riviera Nayarit.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="food">
              <div className="flex items-center gap-3 mb-8"><Utensils className="text-brand-clay" size={32} /><h2 className="text-3xl font-serif font-bold text-brand-dark">Sayulita Dining & Best Tacos</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <h3 className="font-bold text-xl text-brand-terra border-b border-brand-terra/20 pb-2">Authentic Street Tacos</h3>
                    <ul className="space-y-4">
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Mary’s Tacos</span>Famous for shrimp aguachile. A must-visit during your Sayulita stay.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Itacate</span>Gourmet grilled tacos with a unique boho vibe.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Tacos Tonos</span>High-quality street food for an affordable price.</li>
                    </ul>
                 </div>
                 <div className="space-y-4">
                    <h3 className="font-bold text-xl text-brand-terra border-b border-brand-terra/20 pb-2">Fine Dining Favorites</h3>
                    <ul className="space-y-4">
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">La Rustica</span>Vibrant dinner spot offering high-quality Italian and seafood.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Carbon</span>Perfect for tuna steaks and grilled octopus near the plaza.</li>
                    </ul>
                 </div>
              </div>
            </section>
          </div>
          <div className="space-y-12">
             <div className="bg-brand-dark text-white p-8 rounded-2xl shadow-xl">
               <div className="flex items-center gap-3 mb-6"><Moon className="text-brand-clay" size={24} /><h3 className="text-2xl font-serif font-bold">Sayulita Nightlife</h3></div>
               <ul className="space-y-6 text-sm">
                 <li><span className="font-bold text-brand-clay block text-base">Don Pedro's</span>Salsa Night every Monday! A staple of the local lifestyle.</li>
                 <li><span className="font-bold text-brand-clay block text-base">Le Zouave</span>Best margaritas for a quiet bohemian evening.</li>
                 <li><span className="font-bold text-brand-clay block text-base">Yambak</span>Craft brewery for beer enthusiasts staying in Sayulita.</li>
               </ul>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6"><Music className="text-brand-clay" size={24} /><h3 className="text-2xl font-serif font-bold">Local Activities</h3></div>
               <div className="space-y-6">
                  <div><h4 className="font-bold text-brand-dark">Boat Tours & Islands</h4><p className="text-sm text-gray-600 mt-2">Book an all-inclusive boat trip to the Marietas Islands.</p></div>
                  <div><h4 className="font-bold text-brand-dark">Friday Farmers Market</h4><p className="text-sm text-gray-600 mt-2">Discover local artisans and handmade goods just 10 mins from the property.</p></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};