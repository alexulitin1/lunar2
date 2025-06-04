import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import Button from '../../shared/Button';
import { Target, Wind, Sun } from 'lucide-react';

const MorningIntro: React.FC = () => {
  const { dispatch } = useAppState();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-space-gray">
        Утренняя практика
      </h1>
      
      <div className="mb-8">
        <p className="text-space-gray/90 mb-6">
          Начните свой день с ясных целей и спокойного ума. Утренняя практика 
          поможет вам сосредоточиться на важных задачах и правильно настроиться 
          на продуктивный день.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <Target className="flex-shrink-0 w-6 h-6 text-space-star mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-space-gray">Постановка целей</h3>
              <p className="text-sm text-space-gray/70">
                Определите до 5 важных задач на сегодня
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Wind className="flex-shrink-0 w-6 h-6 text-space-star mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-space-gray">Дыхательная практика</h3>
              <p className="text-sm text-space-gray/70">
                5-минутная медитация для фокусировки
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Sun className="flex-shrink-0 w-6 h-6 text-space-star mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-space-gray">Позитивный настрой</h3>
              <p className="text-sm text-space-gray/70">
                Подготовка к продуктивному дню
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={() => dispatch({ type: 'NEXT_STEP' })}
        fullWidth
      >
        Далее
      </Button>
    </div>
  );
};

export default MorningIntro;