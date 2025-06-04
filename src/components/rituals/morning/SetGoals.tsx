import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import Button from '../../shared/Button';
import { Goal } from '../../../types/app';
import { PlusCircle, X } from 'lucide-react';
import { saveDailyGoals } from '../../../lib/supabase';

const SetGoals: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [goals, setGoals] = useState<string[]>(['']);
  
  const handleGoalChange = (index: number, value: string) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = value;
    setGoals(updatedGoals);
  };
  
  const addGoal = () => {
    if (goals.length < 5) {
      setGoals([...goals, '']);
    }
  };
  
  const removeGoal = (index: number) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };
  
  const handleSubmit = async () => {
    // Filter out empty goals and create goal objects
    const filteredGoals = goals
      .filter(goal => goal.trim() !== '')
      .map(goal => ({ text: goal, completed: false }));
    
    // Save goals to local state
    dispatch({ 
      type: 'SET_USER_GOALS', 
      payload: filteredGoals as Goal[]
    });
    
    try {
      // Only save to Supabase if we have a valid userId
      if (state.userId && state.userId.trim() !== '') {
        const today = new Date().toISOString().split('T')[0];
        await saveDailyGoals(state.userId, today, filteredGoals);
      }
      
      // Move to next step
      dispatch({ type: 'NEXT_STEP' });
    } catch (error) {
      console.error('Error saving daily goals:', error);
      // Still proceed to next step even if saving fails
      dispatch({ type: 'NEXT_STEP' });
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-center text-space-gray">
        Цели на сегодня
      </h1>
      <p className="text-space-gray/70 text-center mb-6">
        Запишите до 5 важных задач, которые хотите выполнить сегодня
      </p>
      
      <div className="space-y-4 mb-8">
        {goals.map((goal, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              value={goal}
              onChange={(e) => handleGoalChange(index, e.target.value)}
              placeholder={`Цель ${index + 1}`}
              maxLength={100}
              className="flex-1 p-3 bg-space-navy/30 text-space-gray placeholder-space-gray/50 border border-space-star/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-space-star/50"
            />
            {index > 0 && (
              <button 
                onClick={() => removeGoal(index)}
                className="ml-2 p-2 text-space-gray/50 hover:text-space-star"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {goals.length < 5 && (
        <button 
          onClick={addGoal}
          className="flex items-center text-space-star font-medium mb-8"
        >
          <PlusCircle size={20} className="mr-2" />
          Добавить цель
        </button>
      )}
      
      <Button 
        onClick={handleSubmit}
        fullWidth
        disabled={goals.every(goal => goal.trim() === '')}
      >
        Готово
      </Button>
    </div>
  );
};

export default SetGoals;