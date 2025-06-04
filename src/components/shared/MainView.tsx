import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import OriolMascot from './OriolMascot';
import BottomNavigation from '../home/BottomNavigation';
import { AppScreen } from '../../types/app';
import Button from './Button';

interface MainViewProps {
  showBottomNav: boolean;
}

const MainView: React.FC<MainViewProps> = ({ showBottomNav }) => {
  const { state, dispatch } = useAppState();
  
  const handleOriolClick = () => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.CYCLE });
  };

  const handleStartMorningRitual = () => {
    dispatch({ type: 'RESET_STEP' });
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.MORNING_RITUAL });
  };
  
  const handleStartEveningRitual = () => {
    dispatch({ type: 'RESET_STEP' });
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.EVENING_RITUAL });
  };
  
  const renderActionButton = () => {
    if (!state.morningRitualComplete) {
      return (
        <Button 
          onClick={handleStartMorningRitual}
          fullWidth
          className="h-10 text-base font-medium bg-space-star/10 hover:bg-space-star/20"
        >
          Начать утреннюю практику
        </Button>
      );
    }
    
    if (!state.eveningRitualComplete) {
      return (
        <Button 
          onClick={handleStartEveningRitual}
          fullWidth
          className="h-10 text-base font-medium bg-space-star/10 hover:bg-space-star/20"
        >
          Начать вечернюю практику
        </Button>
      );
    }
    
    return null;
  };
  
  return (
    <div className="h-[100dvh] flex flex-col bg-space-deep">
      <div className="flex-1 flex items-center justify-center">
        <div 
          onClick={handleOriolClick} 
          className="cursor-pointer transform-gpu hover:scale-105 transition-transform duration-300"
        >
          <OriolMascot size="large" />
        </div>
      </div>
      
      <div className="px-4 pb-20">
        {renderActionButton()}
      </div>
      
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default MainView;