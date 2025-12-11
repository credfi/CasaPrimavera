import React from 'react';
import { HelpCircle, MessageCircle, Calendar, Wifi, MapPin, CreditCard, Key } from 'lucide-react';

export const FAQView: React.FC = () => {
  const faqs = [
    {
      category: "Booking & Payment",
      items: [
        {
          q: "How do I pay?",
          a: "We accept a range of flexible payment options, including PayPal, bank transfer, and cash. If you need a different payment method, feel free to ask—we’re happy to accommodate."
        },
        {
          q: "What is your cancellation policy?",
          a: "We offer a full refund if guests cancel within 48 hours of booking AND at least 14 days before check-in. Otherwise, guests get a 50% refund if they cancel 30 or more days prior to check-in."
        },
        {
          q: "Do you offer weekly or monthly discounts?",
          a: "Yes. For extended stays, please fill out our contact form to inquire about discounted weekly or monthly rates."
        }
      ]
    },
    {
      category: "Check-in & Logistics",
      items: [
        {
          q: "When is check-in and check-out?",
          a: "Check-in is at 3:00 PM and Check-out is at 11:00 AM. If you need early check-in or late check-out, please contact us in advance and we’ll accommodate when possible."
        },
        {
          q: "Is there self-check-in?",
          a: "Yes. Once your reservation is confirmed, our property manager will send you detailed check-in instructions, including your personal access code for the property."
        },
        {
          q: "Is there parking available?",
          a: "We do not have dedicated parking on the property. However, there is nearby street parking on the main road, available on a first-come, first-served basis."
        },
        {
          q: "Who will be my main point of contact?",
          a: "You’ll be supported by our on-site property management team, who are available to assist with any inquiries or needs throughout your stay at Casa Primavera."
        }
      ]
    },
    {
      category: "Amenities & Rules",
      items: [
        {
          q: "Do the studios have a kitchen?",
          a: "No, the studios do not include a kitchen. However, Casa Primavera is surrounded by excellent restaurants, cafés, and local food options just a short walk away."
        },
        {
          q: "Is housekeeping included?",
          a: "Yes. Light housekeeping is provided during your stay. For longer stays, we can arrange additional cleanings upon request."
        },
        {
          q: "Is the WiFi fast enough for remote work?",
          a: "Yes. We offer reliable high-speed WiFi suitable for video calls, remote work, and streaming."
        },
        {
          q: "Are pets allowed?",
          a: "Pets are now allowed at Casa Primavera."
        },
        {
          q: "Is smoking allowed?",
          a: "All rooms are non-smoking. Guests may smoke only in designated outdoor areas."
        },
        {
          q: "Is the property close to the beach and town center?",
          a: "Yes. Casa Primavera is located just a short walk from Sayulita Plaza and the main beach, making it easy to explore shops, restaurants, surf rentals, and local attractions."
        }
      ]
    }
  ];

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-brand-dark">
         <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Peaceful interior" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-brand-sand uppercase tracking-[0.2em] mb-4 text-sm font-semibold block">Need help?</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-16">
          {faqs.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl">
              <h2 className="text-2xl font-serif font-bold text-brand-dark mb-8 border-b border-brand-sand pb-4 flex items-center gap-3">
                {idx === 0 && <CreditCard className="text-brand-clay" />}
                {idx === 1 && <Key className="text-brand-clay" />}
                {idx === 2 && <Wifi className="text-brand-clay" />}
                {section.category}
              </h2>
              
              <div className="grid gap-8">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow border border-transparent hover:border-brand-sand/50">
                    <h3 className="font-bold text-lg text-brand-dark mb-3 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-brand-clay mt-1 flex-shrink-0" />
                      {item.q}
                    </h3>
                    <p className="text-gray-600 leading-relaxed ml-8">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-20 bg-brand-clay/10 rounded-2xl p-8 md:p-12 text-center border border-brand-clay/20">
          <div className="w-16 h-16 bg-brand-clay rounded-full flex items-center justify-center text-white mx-auto mb-6">
            <MessageCircle size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Can't find the answer you're looking for? Please contact our friendly team and we will get back to you as soon as possible.
          </p>
          <a 
            href="#contact" 
            className="inline-block px-8 py-3 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-clay transition-colors shadow-lg shadow-brand-dark/20"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};