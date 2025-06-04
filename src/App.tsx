import { useEffect } from 'react';
import { useAppState } from './context/AppStateContext';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import MorningRitual from './components/rituals/morning/MorningRitual';
import EveningRitual from './components/rituals/evening/EveningRitual';
import HomeScreen from './components/home/HomeScreen';
import StarField from './components/shared/StarField';
import { AppScreen } from './types/app';

function App() {
  const { state, dispatch } = useAppState();

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    dispatch({ type: 'RESET_DAILY_RITUALS' });
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.ONBOARDING });
  }, [dispatch]);

  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case AppScreen.ONBOARDING:
        return <OnboardingFlow />;
      case AppScreen.MORNING_RITUAL:
        return <MorningRitual />;
      case AppScreen.EVENING_RITUAL:
        return <EveningRitual />;
      case AppScreen.HOME:
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-space-deep text-space-gray font-sans">
      <StarField />
      {renderCurrentScreen()}
    </div>
  );
}

export default App;