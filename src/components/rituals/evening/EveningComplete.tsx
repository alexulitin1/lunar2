import React, { useEffect } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { AppScreen } from '../../../types/app';
import Button from '../../shared/Button';
import { Share2, Star } from 'lucide-react';

const EveningComplete: React.FC = () => {
  const { dispatch } = useAppState();
  
  useEffect(() => {
    dispatch({ type: 'SET_EVENING_RITUAL_COMPLETE' });
    dispatch({ type: 'ADD_STARS', payload: 3 });
  }, [dispatch]);
  
  const handleShare = () => {
    alert('Функция обмена будет доступна в ближайшем обновлении');
  };
  
  const handleComplete = () => {
    dispatch({ type: 'RESET_STEP' });
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.HOME });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-2 border-[#10B981] flex items-center justify-center mx-auto mb-6">
          <span className="text-[#10B981] text-2xl">✓</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-[#E2E8F0]">Молодец!</h1>
        
        <p className="text-[#E2E8F0]/70 mb-4">
          Вы завершили вечернюю практику
        </p>
        
        <div className="flex items-center justify-center mb-8 text-[#F59E0B]">
          <span className="text-lg font-medium">+3</span>
          <Star size={20} className="ml-1" />
        </div>
        
        <div className="flex space-x-4">
          <Button 
            onClick={handleShare}
            variant="outline"
            className="flex-1 flex items-center justify-center"
          >
            <Share2 size={18} className="mr-2" />
            Поделиться
          </Button>
          
          <Button 
            onClick={handleComplete}
            className="flex-1"
          >
            Завершить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EveningComplete;