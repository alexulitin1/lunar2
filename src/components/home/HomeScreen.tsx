import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { AppScreen } from '../../types/app';
import Button from '../shared/Button';
import CycleView from './CycleView';
import StarsView from './StarsView';
import SettingsView from './SettingsView';
import DayStatistics from './DayStatistics';
import MainView from '../../components/shared/MainView';

const HomeScreen: React.FC = () => {
  const { state, dispatch } = useAppState();
  
  const handleStartMorningRitual = () => {
    dispatch({ type: 'RESET_STEP' });
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.MORNING_RITUAL });
  };
  
  const handleStartEveningRitual = () => {
    dispatch({ type: 'RESET_STEP' });
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.EVENING_RITUAL });
  };
  
  const getActionButton = () => {
    if (!state.morningRitualComplete) {
      return (
        <Button 
          onClick={handleStartMorningRitual}
          fullWidth
        >
          Начать утренний ритуал
        </Button>
      );
    }
    
    if (!state.eveningRitualComplete) {
      return (
        <Button 
          onClick={handleStartEveningRitual}
          fullWidth
        >
          Начать вечерний ритуал
        </Button>
      );
    }
    
    return null;
  };
  
  const renderContent = () => {
    switch (state.currentScreen) {
      case AppScreen.CYCLE:
        return <CycleView />;
      case AppScreen.STARS:
        return <StarsView />;
      case AppScreen.SETTINGS:
        return <SettingsView />;
      case AppScreen.DAY_STATISTICS:
        return <DayStatistics date={new Date().toISOString().split('T')[0]} onClose={() => dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.HOME })} />;
      case AppScreen.HOME:
      default:
        return (
          <MainView 
            showBottomNav={true}
            actionButton={getActionButton()}
          />
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default HomeScreen;