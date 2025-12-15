import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth, isSameDay, toISODate } from '../utils/dateUtils';

interface CalendarProps {
  unavailableDates: string[];
  selectedStart: Date | null;
  selectedEnd: Date | null;
  onSelectDate: (date: Date) => void;
  getNightlyPrice?: (date: Date) => number; // Optional function to get price
}

export const Calendar: React.FC<CalendarProps> = ({ 
  unavailableDates, 
  selectedStart, 
  selectedEnd, 
  onSelectDate,
  getNightlyPrice
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  
  const months = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];

  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isBlocked = (day: number) => {
    const d = new Date(year, month, day);
    
    // Create 'today' date object set to midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Block if date is today or in the past
    if (d <= today) {
      return true;
    }

    // Check specific unavailable dates (from iCal)
    return unavailableDates.includes(toISODate(d));
  };

  const isSelected = (day: number) => {
    const d = new Date(year, month, day);
    if (selectedStart && isSameDay(selectedStart, d)) return true;
    if (selectedEnd && isSameDay(selectedEnd, d)) return true;
    
    if (selectedStart && selectedEnd) {
      return d > selectedStart && d < selectedEnd;
    }
    return false;
  };
  
  const isRangeStart = (day: number) => selectedStart && isSameDay(selectedStart, new Date(year, month, day));
  const isRangeEnd = (day: number) => selectedEnd && isSameDay(selectedEnd, new Date(year, month, day));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-serif font-bold text-gray-800">
          {months[month]} {year}
        </h3>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 uppercase">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="min-h-[50px]"></div>
        ))}
        
        {days.map(day => {
          const blocked = isBlocked(day);
          const selected = isSelected(day);
          const start = isRangeStart(day);
          const end = isRangeEnd(day);
          const d = new Date(year, month, day);
          
          let btnClass = "w-full h-full min-h-[50px] flex flex-col items-center justify-center relative rounded-lg transition-all border border-transparent ";
          
          if (blocked) {
            btnClass += "text-gray-300 cursor-not-allowed decoration-slice bg-gray-50";
          } else if (selected) {
            if (start || end) {
               btnClass += "bg-brand-clay text-white font-bold z-10 hover:bg-brand-terra shadow-md";
            } else {
               btnClass += "bg-brand-clay/10 text-brand-clay font-medium rounded-none";
            }
          } else {
            btnClass += "text-gray-700 hover:bg-gray-50 hover:border-gray-200 font-medium";
          }
          
          const price = !blocked && getNightlyPrice ? getNightlyPrice(d) : null;

          return (
            <div key={day} className="aspect-square relative p-[1px]">
               {selected && !start && !end && !blocked && (
                 <div className="absolute inset-y-[1px] inset-x-0 bg-brand-clay/10 z-0" />
               )}
               {start && selectedEnd && (
                 <div className="absolute inset-y-[1px] right-0 w-1/2 bg-brand-clay/10 z-0" />
               )}
               {end && selectedStart && (
                 <div className="absolute inset-y-[1px] left-0 w-1/2 bg-brand-clay/10 z-0" />
               )}
               
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (!blocked) onSelectDate(d);
                }}
                disabled={blocked}
                className={btnClass}
              >
                {blocked && <span className="absolute w-2/3 h-[1px] bg-gray-300 rotate-45"></span>}
                <span className={`relative z-10 text-sm ${price ? '-mt-1' : ''}`}>{day}</span>
                {price && (
                  <span className={`text-[10px] font-normal mt-0.5 ${selected && (start || end) ? 'text-white/90' : 'text-gray-500'}`}>
                    ${price}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded bg-brand-clay"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded border border-gray-200"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded bg-gray-50 text-gray-300 flex items-center justify-center relative overflow-hidden">
             <div className="w-full h-[1px] bg-gray-300 rotate-45 absolute"></div>
          </div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};