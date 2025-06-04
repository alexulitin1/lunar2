import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import Button from '../../shared/Button';
import BreathingTimer from '../../shared/BreathingTimer';
import { Moon } from 'lucide-react';

const EveningBreathing: React.FC = () => {
  const { dispatch } = useAppState();
  const [showTimer, setShowTimer] = React.useState(false);
  
  const handleStartBreathing = () => {
    setShowTimer(true);
  };
  
  const handleCompleteBreathing = () => {
    dispatch({ type: 'NEXT_STEP' });
  };
  
  if (showTimer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <BreathingTimer 
          duration={300}
          onComplete={handleCompleteBreathing}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1">
        <div className="mb-8 flex justify-center">
          <Moon size={80} className="text-[#3B82F6]" />
        </div>
        
        <h2 className="text-xl font-bold mb-6 text-[#E2E8F0]">Техника дыхания для вечера</h2>
        
        <ol className="space-y-4 list-decimal pl-5 text-[#E2E8F0]/70">
          <li>
            <strong className="text-[#E2E8F0]">Сядьте или лягте удобно</strong> - найдите спокойное 
            место, где вас не будут беспокоить.
          </li>
          <li>
            <strong className="text-[#E2E8F0]">Медленный вдох через нос</strong> - вдыхайте глубоко, 
            считая до 4.
          </li>
          <li>
            <strong className="text-[#E2E8F0]">Задержка дыхания</strong> - задержите дыхание на 
            2 секунды.
          </li>
          <li>
            <strong className="text-[#E2E8F0]">Длинный выдох через рот</strong> - медленно выдыхайте 
            через рот, считая до 6.
          </li>
          <li>
            <strong className="text-[#E2E8F0]">Отпустите мысли о дне</strong> - представьте, как 
            напряжение и заботы уходят с каждым выдохом.
          </li>
        </ol>
      </div>
      
      <Button 
        onClick={handleStartBreathing}
        fullWidth
      >
        Начать дыхание
      </Button>
    </div>
  );
};

export default EveningBreathing;