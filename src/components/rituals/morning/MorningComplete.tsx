import React, { useEffect } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { AppScreen } from '../../../types/app';
import Button from '../../shared/Button';
import { Sun, Star } from 'lucide-react';

const MorningComplete: React.FC = () => {
  const { dispatch } = useAppState();
  
  useEffect(() => {
    dispatch({ type: 'SET_MORNING_RITUAL_COMPLETE' });
    dispatch({ type: 'ADD_STARS', payload: 3 });
  }, [dispatch]);
  
  const handleReturnHome = () => {
    dispatch({ type: 'RESET_STEP' });
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.HOME });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <Sun size={80} className="mx-auto text-[#FFB800] mb-6" />
        
        <h1 className="text-2xl font-bold mb-4 text-[#E2E8F0]">Отличное начало дня!</h1>
        
        <p className="text-[#E2E8F0]/70 mb-8">
          Вы успешно завершили утреннюю практику. Теперь вы готовы к продуктивному
          дню с ясными целями и спокойным умом.
        </p>
        
        <div className="flex items-center justify-center mb-8 text-[#F59E0B]">
          <span className="text-lg font-medium">+3</span>
          <Star size={20} className="ml-1" />
        </div>
        
        <Button 
          onClick={handleReturnHome}
          fullWidth
        >
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
};

export default MorningComplete;