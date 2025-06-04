import React from 'react';
import { Goal } from '../../types/app';
import { X } from 'lucide-react';

interface GoalsPopupProps {
  goals: Goal[];
  onClose: () => void;
}

const GoalsPopup: React.FC<GoalsPopupProps> = ({ goals, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div 
        className="absolute inset-0 bg-space-deep/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="cosmic-modal w-full max-w-sm relative">
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-space-gray/70 hover:text-space-gray"
          >
            <X size={20} />
          </button>
          
          <h2 className="font-medium mb-4 text-space-gray">Цели на сегодня:</h2>
          
          <ul className="space-y-3">
            {goals.map((goal, index) => (
              <li key={index} className="flex items-center">
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center mr-2
                  ${goal.completed ? 'bg-space-star/20' : 'bg-space-navy/20'}
                `}>
                  <span className={`text-sm ${goal.completed ? 'text-space-star' : 'text-space-gray/50'}`}>
                    {goal.completed ? '✓' : '○'}
                  </span>
                </div>
                <span className={`${goal.completed ? 'line-through text-space-gray/50' : 'text-space-gray'}`}>
                  {goal.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoalsPopup;