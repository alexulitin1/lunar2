import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import Button from '../../shared/Button';
import { Goal } from '../../../types/app';
import { Check } from 'lucide-react';
import { saveDailyGoals } from '../../../lib/supabase';

const CheckTasks: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [goalNotes, setGoalNotes] = useState<Record<number, string>>({});
  
  if (state.userGoals.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#E2E8F0]">
          Подведем итоги дня
        </h1>
        
        <p className="text-[#E2E8F0]/70 text-center mb-8">
          У вас не было поставлено целей на сегодня. 
          Завтра обязательно запланируйте несколько важных задач.
        </p>
        
        <Button 
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
          fullWidth
        >
          Далее
        </Button>
      </div>
    );
  }
  
  const handleToggleGoal = (index: number) => {
    dispatch({ 
      type: 'UPDATE_GOAL_STATUS', 
      payload: { 
        index, 
        completed: !state.userGoals[index].completed 
      } 
    });
  };
  
  const handleNoteChange = (index: number, note: string) => {
    setGoalNotes({
      ...goalNotes,
      [index]: note
    });
  };
  
  const handleSubmit = async () => {
    const updatedGoals = state.userGoals.map((goal, index) => {
      if (goalNotes[index]) {
        return { ...goal, note: goalNotes[index] };
      }
      return goal;
    });
    
    // Save goals to local state
    dispatch({ type: 'SET_USER_GOALS', payload: updatedGoals as Goal[] });
    
    // Only save to Supabase if we have a valid userId
    if (state.userId && state.userId.trim() !== '') {
      try {
        const today = new Date().toISOString().split('T')[0];
        await saveDailyGoals(state.userId, today, updatedGoals);
      } catch (error) {
        console.error('Error saving daily goals:', error);
        // Continue to next step even if saving fails
      }
    }
    
    dispatch({ type: 'NEXT_STEP' });
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-[#E2E8F0]">
        Подведем итоги дня
      </h1>
      
      <div className="space-y-4 mb-8">
        {state.userGoals.map((goal, index) => (
          <div key={index} className="bg-[#0F172A] rounded-xl border border-[#475569]/20 p-4">
            <div className="flex items-start mb-2">
              <button
                onClick={() => handleToggleGoal(index)}
                className={`
                  flex-shrink-0 w-6 h-6 rounded-md mr-3 flex items-center justify-center
                  ${goal.completed ? 'bg-[#10B981] text-white' : 'border border-[#475569]'}
                `}
              >
                {goal.completed && <Check size={16} />}
              </button>
              <span className={`text-[#E2E8F0] ${goal.completed ? 'line-through opacity-70' : ''}`}>
                {goal.text}
              </span>
            </div>
            
            <div className="pl-9">
              <input
                type="text"
                value={goalNotes[index] || goal.note || ''}
                onChange={(e) => handleNoteChange(index, e.target.value)}
                placeholder="Добавить заметку (необязательно)"
                maxLength={100}
                className="w-full p-2 text-sm bg-[#1E293B] border border-[#475569]/20 rounded-lg text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
              />
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={handleSubmit}
        fullWidth
      >
        Далее
      </Button>
    </div>
  );
};

export default CheckTasks;