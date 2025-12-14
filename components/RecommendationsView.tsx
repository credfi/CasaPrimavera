import React from 'react';
import { Sun, Waves, Coffee, Utensils, Moon, Music, ShoppingBag, MapPin, Star, Heart } from 'lucide-react';

export const RecommendationsView: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white">
      {/* SEO-friendly Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://raw.githubusercontent.com/credfi/CasaPrimavera/jacob-dev/Images/alice-kotlyarenko-dyDr19bQldc-unsplash.jpg" 
          alt="Sayulita Mexico colorful streets and culture" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-brand-sand uppercase tracking-[0.2em] mb-4 text-sm font-semibold block">Curated by Locals</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            The Ultimate Sayulita Guide
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            From hidden jungle beaches to the best street tacos. Discover the soul of Riviera Nayarit through our personal favorite spots.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-20">
            
            {/* BEACHES SECTION */}
            <section id="beaches">
              <div className="flex items-center gap-3 mb-8">
                <Waves className="text-brand-clay" size={32} />
                <h2 className="text-3xl font-serif font-bold text-brand-dark">Beaches & Surf</h2>
              </div>
              
              <div className="space-y-8">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="bg-brand-dark/5 p-4 border-b border-gray-100 font-bold text-lg flex justify-between items-center">
                    <span>Relaxation & Sunsets</span>
                    <Sun size={20} className="text-orange-400" />
                  </div>
                  <div className="divide-y divide-gray-100">
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">Carricetos</h4>
                      <p className="text-sm text-gray-600 mt-1">Breathtaking sunsets. ~30 min walk south. Take the left fork past the cemetery into the jungle path.</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">Los Muertos</h4>
                      <p className="text-sm text-gray-600 mt-1">~15 min walk south. Pass the cemetery to find this gem. Climb the rocks to the right for a hidden secluded spot.</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">Mal Paso</h4>
                      <p className="text-sm text-gray-600 mt-1">North of main beach. Accessible via jungle path or Gringo Hill road. The rocky path offers the best scenic views.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                   <div className="bg-brand-dark/5 p-4 border-b border-gray-100 font-bold text-lg flex justify-between items-center">
                    <span>Surf Spots</span>
                    <Waves size={20} className="text-blue-500" />
                  </div>
                  <div className="divide-y divide-gray-100">
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">La Lanchas</h4>
                      <p className="text-sm text-gray-600 mt-1">Premier surf beach. ~25 min drive south. Located across the highway from the Wild Mex surf shop.</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">Burros</h4>
                      <p className="text-sm text-gray-600 mt-1">South of La Lanchas. Often accessed by paddling from La Lanchas. Great breaks.</p>
                    </div>
                     <div className="p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-bold text-brand-dark">Anclote (Punta Mita)</h4>
                      <p className="text-sm text-gray-600 mt-1">Small surf break ideal for longboards and beginners.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FOOD SECTION */}
            <section id="food">
              <div className="flex items-center gap-3 mb-8">
                <Utensils className="text-brand-clay" size={32} />
                <h2 className="text-3xl font-serif font-bold text-brand-dark">Culinary Journey</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Authentic Tacos */}
                 <div className="space-y-4">
                    <h3 className="font-bold text-xl text-brand-terra border-b border-brand-terra/20 pb-2">Tacos & Authentic</h3>
                    <ul className="space-y-4">
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Mary’s</span>Famous for shrimp aguachile and tacos. A local staple.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Itacate</span>Delicious Mexican grilled tacos and fresh basil drinks.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Tacos Tonos</span>Best street tacos for a quick bite.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Taco Al Pastor Tal Ivans</span>The go-to spot for Pastor street tacos late at night.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Bichos</span>Huge variety of tacos to choose from.</li>
                    </ul>
                 </div>

                 {/* Dinner & International */}
                 <div className="space-y-4">
                    <h3 className="font-bold text-xl text-brand-terra border-b border-brand-terra/20 pb-2">Dinner Favorites</h3>
                    <ul className="space-y-4">
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Venezia</span>Great pizza located across the bridge.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">El Jackal</span>Fish restaurant beside Venezia. Known for coconut shrimp.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">Carbon</span>Top pick for tuna steaks, burgers, and octopus.</li>
                       <li className="text-gray-600"><span className="font-bold text-gray-900 block">La Rustica</span>A bit of everything: Pizza, pasta, and seafood. High quality.</li>
                    </ul>
                 </div>
              </div>

              <div className="mt-12">
                 <h3 className="font-bold text-xl text-brand-terra border-b border-brand-terra/20 pb-4 mb-6 flex items-center gap-2">
                   <Coffee size={20} /> Breakfast & Cafes
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <span className="font-bold block text-gray-900">Marea Cafe</span>
                      <span className="text-sm text-gray-500">Plaza Nawalli. Great smoothies and lunch.</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <span className="font-bold block text-gray-900">La Baritta de Sayulita</span>
                      <span className="text-sm text-gray-500">Located inside PALU Gallery. The most beautiful cafe setting.</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <span className="font-bold block text-gray-900">The Anchor</span>
                      <span className="text-sm text-gray-500">Trendy breakfast spot.</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <span className="font-bold block text-gray-900">ChocoBanana</span>
                      <span className="text-sm text-gray-500">A classic. Known for frozen bananas and traditional breakfast.</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <span className="font-bold block text-gray-900">Alquimista</span>
                      <span className="text-sm text-gray-500">Traditional Mexican breakfast options.</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <span className="font-bold block text-gray-900">Yah Yah's Cafe</span>
                      <span className="text-sm text-gray-500">Bagels, sandwiches, and smoothies.</span>
                    </div>
                 </div>
              </div>

              <div className="mt-12">
                 <h3 className="font-bold text-xl text-brand-terra border-b border-brand-terra/20 pb-4 mb-6 flex items-center gap-2">
                   <Heart size={20} /> Desserts
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <span className="font-bold block text-gray-900">Rollado Ice Cream</span>
                      <span className="text-sm text-gray-500">Hand-rolled ice cream tacos. North end, across from Chewbacca.</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <span className="font-bold block text-gray-900">Sayu Swirls</span>
                      <span className="text-sm text-gray-500">Real fruit frozen yogurt. Plaza Nawalli & Town Center.</span>
                    </div>
                 </div>
              </div>
            </section>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-12">
             
             {/* NIGHTLIFE */}
             <div className="bg-brand-dark text-white p-8 rounded-2xl shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                 <Moon className="text-brand-clay" size={24} />
                 <h3 className="text-2xl font-serif font-bold">Sayulita Nights</h3>
               </div>
               <ul className="space-y-6 text-sm">
                 <li>
                   <span className="font-bold text-brand-clay block text-base">Don Pedro's</span>
                   Salsa Night every Monday! Beginners lesson at 8pm. Dancing till 11.
                 </li>
                 <li>
                   <span className="font-bold text-brand-clay block text-base">Le Zouave</span>
                   Beside Hafa Hotel. Incredible passion fruit margaritas.
                 </li>
                 <li>
                   <span className="font-bold text-brand-clay block text-base">Don Patos</span>
                   Live music every night in the plaza.
                 </li>
                 <li>
                   <span className="font-bold text-brand-clay block text-base">Yambak</span>
                   Microbrewery in the plaza. Great local beer.
                 </li>
                 <li>
                   <span className="font-bold text-brand-clay block text-base">Cava</span>
                   Specialized in Tequila and Mezcal cocktails.
                 </li>
               </ul>
               <div className="mt-6 pt-6 border-t border-white/10 text-xs text-gray-400">
                 Tip: Follow <a href="https://instagram.com/sayulitasocial" target="_blank" rel="noreferrer" className="text-brand-clay hover:underline">@sayulitasocial</a> for nightly updates.
               </div>
             </div>

             {/* TOURS */}
             <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                 <Music className="text-brand-clay" size={24} />
                 <h3 className="text-2xl font-serif font-bold">Activities</h3>
               </div>
               <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-brand-dark">Chica Loca & Alley Cat</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      All-inclusive boat tours. Booze cruise, lunch, ceviche, and activities. Approx $100 USD.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Friday Farmers Market</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      10am - 2pm (Seasonal). Local artisans, food court, and live music.
                    </p>
                    <a href="https://maps.app.goo.gl/MDoc6bk7suK7yK1A8" target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-bold text-brand-clay mt-2 hover:underline">
                      View Location <MapPin size={12} className="ml-1" />
                    </a>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">San Pancho Day Trip</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      The next surf town north. Take a 20 min bus or a scenic jungle/beach walk.
                    </p>
                  </div>
               </div>
             </div>

             {/* Beach Bars */}
             <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
                <h3 className="font-bold text-lg text-brand-terra mb-4">Day Beach Bars</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><Sun size={14} /> Bar La Isla</li>
                  <li className="flex items-center gap-2"><Sun size={14} /> La Sirenas Beach Bar</li>
                  <li className="flex items-center gap-2"><Sun size={14} /> Frente El Punto</li>
                </ul>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
};