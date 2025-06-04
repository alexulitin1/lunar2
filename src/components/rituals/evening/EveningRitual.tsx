import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { EveningRitualStep } from '../../../types/app';
import EveningIntro from './EveningIntro';
import CheckTasks from './CheckTasks';
import AIChat from './AIChat';
import EveningBreathing from './EveningBreathing';
import EveningComplete from './EveningComplete';

const EveningRitual: React.FC = () => {
  const { state, dispatch } = useAppState();
  
  const renderCurrentStep = () => {
    // Skip intro and breathing for experienced users
    if (state.firstDayComplete && state.currentStep === EveningRitualStep.INTRO) {
      dispatch({ type: 'NEXT_STEP' });
      return <CheckTasks />;
    }

    if (state.firstDayComplete && state.currentStep === EveningRitualStep.BREATHING) {
      dispatch({ type: 'NEXT_STEP' });
      return <EveningComplete />;
    }

    switch (state.currentStep) {
      case EveningRitualStep.INTRO:
        return <EveningIntro />;
      case EveningRitualStep.CHECK_TASKS:
        return <CheckTasks />;
      case EveningRitualStep.AI_CHAT:
        return <AIChat />;
      case EveningRitualStep.BREATHING:
        return <EveningBreathing />;
      case EveningRitualStep.COMPLETE:
        return <EveningComplete />;
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

export default EveningRitual;