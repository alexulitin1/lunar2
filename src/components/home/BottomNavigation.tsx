import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { AppScreen } from '../../types/app';
import { Star, Circle, ShoppingBag } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const { state, dispatch } = useAppState();
  
  const navItems = [
    {
      icon: <Star size={24} />,
      label: 'Звёзды',
      screen: AppScreen.STARS,
    },
    {
      icon: <Circle size={24} />,
      label: 'Виток',
      screen: AppScreen.HOME,
    },
    {
      icon: <ShoppingBag size={24} />,
      label: 'Магазин',
      screen: AppScreen.SETTINGS,
    },
  ];
  
  const handleNavClick = (screen: AppScreen) => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-space-deep border-t border-space-star/10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => (
          <button 
            key={index}
            onClick={() => handleNavClick(item.screen)}
            className={`
              flex flex-col items-center justify-center w-full h-full
              ${state.currentScreen === item.screen ? 'text-space-star' : 'text-space-gray/50'}
              hover:text-space-star transition-colors duration-200
            `}
          >
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;