import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import Button from '../../shared/Button';
import { CheckSquare, MessageCircle, Moon } from 'lucide-react';

const EveningIntro: React.FC = () => {
  const { dispatch } = useAppState();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#E2E8F0]">
        Вечерний ритуал
      </h1>
      
      <div className="space-y-6">
        <div className="flex items-start">
          <CheckSquare className="flex-shrink-0 w-6 h-6 text-[#3B82F6] mr-3" />
          <div>
            <h3 className="font-medium text-[#E2E8F0]">Подведем итоги дня</h3>
            <p className="text-sm text-[#E2E8F0]/70">
              Отметьте выполненные цели и оцените свой день
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <MessageCircle className="flex-shrink-0 w-6 h-6 text-[#8B5CF6] mr-3" />
          <div>
            <h3 className="font-medium text-[#E2E8F0]">Анализ от ИИ</h3>
            <p className="text-sm text-[#E2E8F0]/70">
              Получите рекомендации и советы для улучшения
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Moon className="flex-shrink-0 w-6 h-6 text-[#10B981] mr-3" />
          <div>
            <h3 className="font-medium text-[#E2E8F0]">Дыхательная практика</h3>
            <p className="text-sm text-[#E2E8F0]/70">
              5-минутная медитация для расслабления перед сном
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Button 
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
          fullWidth
        >
          Далее
        </Button>
      </div>
    </div>
  );
};

export default EveningIntro;