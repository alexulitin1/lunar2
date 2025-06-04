import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { MorningRitualStep } from '../../../types/app';
import MorningIntro from './MorningIntro';
import SetGoals from './SetGoals';
import MorningBreathing from './MorningBreathing';
import MorningComplete from './MorningComplete';

const MorningRitual: React.FC = () => {
  const { state, dispatch } = useAppState();
  
  const renderCurrentStep = () => {
    // Show intro only on first day
    if (!state.firstDayComplete && state.currentStep === MorningRitualStep.INTRO) {
      return <MorningIntro />;
    }

    // Skip intro for experienced users
    if (state.firstDayComplete && state.currentStep === MorningRitualStep.INTRO) {
      dispatch({ type: 'NEXT_STEP' });
      return <SetGoals />;
    }

    switch (state.currentStep) {
      case MorningRitualStep.INTRO:
        return <MorningIntro />;
      case MorningRitualStep.SET_GOALS:
        return <SetGoals />;
      case MorningRitualStep.BREATHING:
        return <MorningBreathing />;
      case MorningRitualStep.COMPLETE:
        return <MorningComplete />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default MorningRitual;