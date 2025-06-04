import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { OnboardingStep, AppScreen } from '../../types/app';
import Button from '../shared/Button';
import { UserCircle, Sparkles, Heart } from 'lucide-react';

const OnboardingFlow: React.FC = () => {
  const { state, dispatch } = useAppState();
  
  const handleNext = () => {
    if (state.currentStep < 2) {
      dispatch({ type: 'NEXT_STEP' });
    } else {
      dispatch({ type: 'SET_ONBOARDING_COMPLETE' });
      dispatch({ type: 'RESET_STEP' });
      dispatch({ type: 'SET_CURRENT_SCREEN', payload: AppScreen.MORNING_START });
    }
  };
  
  const renderOnboardingStep = () => {
    switch (state.currentStep) {
      case OnboardingStep.WELCOME:
        return (
          <div className="text-center">
            <div className="mb-8">
              <UserCircle size={80} className="mx-auto text-space-star" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-space-gray">lunar loop</h1>
            <p className="text-space-gray/70 mb-8">
              Ваш личный помощник для утренних и вечерних ритуалов, 
              который поможет вам достичь внутреннего спокойствия и 
              продуктивности каждый день.
            </p>
          </div>
        );
      
      case OnboardingStep.BENEFITS:
        return (
          <div className="text-center">
            <div className="mb-8">
              <Sparkles size={80} className="mx-auto text-space-star" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-space-gray">Улучшите свою жизнь</h1>
            <p className="text-space-gray/70 mb-8">
              Регулярные утренние и вечерние ритуалы помогут вам стать более
              осознанным, спокойным и сосредоточенным на важных задачах.
            </p>
          </div>
        );
      
      case OnboardingStep.FEATURES:
        return (
          <div className="text-center">
            <div className="mb-8">
              <Heart size={80} className="mx-auto text-space-star" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-space-gray">Ключевые особенности</h1>
            <ul className="text-left mb-8">
              <li className="flex items-center mb-3">
                <div className="w-6 h-6 rounded-full border border-space-star/50 flex items-center justify-center mr-3">
                  <span className="text-space-star">✓</span>
                </div>
                <span className="text-space-gray">Утренние и вечерние ритуалы для баланса</span>
              </li>
              <li className="flex items-center mb-3">
                <div className="w-6 h-6 rounded-full border border-space-star/50 flex items-center justify-center mr-3">
                  <span className="text-space-star">✓</span>
                </div>
                <span className="text-space-gray">Дыхательные практики для концентрации</span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full border border-space-star/50 flex items-center justify-center mr-3">
                  <span className="text-space-star">✓</span>
                </div>
                <span className="text-space-gray">Отслеживание прогресса и достижений</span>
              </li>
            </ul>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center">
        {renderOnboardingStep()}
      </div>
      
      <div className="py-6">
        <Button onClick={handleNext} fullWidth>
          {state.currentStep < 2 ? 'Далее' : 'Начать'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFlow;