import React, { useEffect, useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CheckSquare, X } from 'lucide-react';
import { Goal } from '../../types/app';

interface DayStats {
  date: string;
  isCompleted: boolean;
  goals: Goal[];
}

interface DayStatisticsProps {
  date: string;
  onClose: () => void;
}

const DayStatistics: React.FC<DayStatisticsProps> = ({ date, onClose }) => {
  const { state } = useAppState();
  const [dayStats, setDayStats] = useState<DayStats | null>(null);
  
  useEffect(() => {
    const isCompleted = state.completedDays.includes(date);
    
    // Get goals for this specific date
    const goalsForDate = state.userGoals.filter(goal => {
      return goal.date === date;
    });
    
    setDayStats({
      date,
      isCompleted,
      goals: goalsForDate
    });
  }, [date, state.completedDays, state.userGoals]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const day = date.getDate();
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };
  
  if (!dayStats) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="bg-space-deep rounded-xl border border-space-star/20 p-6 max-w-sm w-full relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-space-gray">
            {formatDate(dayStats.date)}
          </h2>
          <button 
            onClick={onClose}
            className="text-space-gray/70 hover:text-space-gray transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-space-star/20">
              <span className="text-space-gray/70">День пройден</span>
              <div className={`
                flex items-center
                ${dayStats.isCompleted ? 'text-green-500' : 'text-red-500'}
              `}>
                {dayStats.isCompleted ? (
                  <>
                    <CheckSquare size={18} className="mr-1" />
                    <span>Да</span>
                  </>
                ) : (
                  <>
                    <X size={18} className="mr-1" />
                    <span>Нет</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {dayStats.goals.length > 0 && (
            <div>
              <h3 className="font-medium text-space-gray mb-4">Цели дня:</h3>
              <div className="space-y-3">
                {dayStats.goals.map((goal, index) => (
                  <div 
                    key={index}
                    className="flex items-start"
                  >
                    <div className={`
                      w-5 h-5 rounded-md flex items-center justify-center mr-2 mt-0.5
                      ${goal.completed ? 'bg-green-500/20 text-green-500' : 'border border-space-star text-space-star'}
                    `}>
                      {goal.completed && <CheckSquare size={14} />}
                    </div>
                    <div>
                      <p className={`text-space-gray ${goal.completed ? 'line-through opacity-70' : ''}`}>
                        {goal.text}
                      </p>
                      {goal.note && (
                        <p className="text-sm text-space-gray/50 mt-1">
                          {goal.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayStatistics;