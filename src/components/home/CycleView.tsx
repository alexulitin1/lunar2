import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayStatistics from './DayStatistics';
import BottomNavigation from './BottomNavigation';

const CycleView: React.FC = () => {
  const { state } = useAppState();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Always initialize with today's date
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };
  
  const handleCloseModal = () => {
    setSelectedDate(null);
  };
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const days = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: null, isCurrentMonth: false });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, month, i);
    const dateStr = dateObj.toISOString().split('T')[0];
    const isCompleted = state.completedDays.includes(dateStr);
    
    const isToday = dateObj.getDate() === today.getDate() && 
                    dateObj.getMonth() === today.getMonth() && 
                    dateObj.getFullYear() === today.getFullYear();
    
    days.push({
      day: i,
      isCurrentMonth: true,
      isCompleted,
      isToday,
      dateStr,
    });
  }
  
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  const currentMonthName = monthNames[month];
  
  return (
    <div className="min-h-screen flex flex-col bg-space-deep pb-16">
      <div className="flex-1">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="text-space-gray hover:text-space-gray/70 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <h2 className="text-lg font-medium text-space-gray">
              {currentMonthName} {year}
            </h2>
            
            <button
              onClick={handleNextMonth}
              className="text-space-gray hover:text-space-gray/70 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-space-gray/70 py-2">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => (
              <div 
                key={index}
                onClick={() => day.day && day.dateStr && handleDayClick(day.dateStr)}
                className={`
                  aspect-square flex items-center justify-center rounded-lg
                  ${day.isCurrentMonth ? 'cursor-pointer' : ''}
                  ${day.isToday ? 'border border-space-star' : ''}
                  ${day.isCompleted ? 'bg-space-star/30' : ''}
                  hover:bg-space-star/20 transition-colors
                `}
              >
                {day.day && (
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <span className={`text-space-gray ${day.isCompleted ? 'opacity-100' : 'opacity-70'}`}>
                      {day.day}
                    </span>
                    {day.isCompleted && (
                      <div className="absolute bottom-0 w-4 h-1 rounded-full bg-space-star"></div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center space-x-6 mb-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm bg-space-star/30 mr-2"></div>
            <span className="text-sm text-space-gray/70">Завершено</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm border border-space-star mr-2"></div>
            <span className="text-sm text-space-gray/70">Сегодня</span>
          </div>
        </div>
      </div>

      <BottomNavigation />

      {selectedDate && (
        <DayStatistics date={selectedDate} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CycleView;