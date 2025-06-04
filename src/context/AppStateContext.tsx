import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppScreen, Goal, AppState, AppAction } from '../types/app';

const initialState: AppState = {
  currentScreen: AppScreen.ONBOARDING,
  onboardingComplete: false,
  morningRitualComplete: false,
  eveningRitualComplete: false,
  currentStep: 0,
  userGoals: [],
  completedDays: [],
  currentDay: 0,
  starBalance: 0,
  pushNotifications: true,
  language: 'ru',
  firstDayComplete: false,
  userId: '',
};

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'INITIALIZE_APP':
      return {
        ...initialState,
        ...action.payload,
      };
    case 'SET_CURRENT_SCREEN':
      return {
        ...state,
        currentScreen: action.payload,
      };
    case 'SET_ONBOARDING_COMPLETE':
      localStorage.setItem('onboardingComplete', 'true');
      return {
        ...state,
        onboardingComplete: true,
      };
    case 'SET_MORNING_RITUAL_COMPLETE':
      localStorage.setItem('morningRitualComplete', 'true');
      return {
        ...state,
        morningRitualComplete: true,
      };
    case 'SET_EVENING_RITUAL_COMPLETE': {
      const today = new Date().toISOString().split('T')[0];
      // Increment current cycle day count
      const newCurrentDay = state.currentDay + 1;
      localStorage.setItem('currentDay', newCurrentDay.toString());
      
      // Only add the day to completedDays if both rituals are complete
      let updatedCompletedDays = [...state.completedDays];
      if (state.morningRitualComplete && !state.eveningRitualComplete) {
        updatedCompletedDays = [...state.completedDays, today];
      }
      
      localStorage.setItem('eveningRitualComplete', 'true');
      localStorage.setItem('firstDayComplete', 'true');
      localStorage.setItem('completedDays', JSON.stringify(updatedCompletedDays));
      
      return {
        ...state,
        eveningRitualComplete: true,
        currentDay: newCurrentDay,
        firstDayComplete: true,
        completedDays: updatedCompletedDays,
      };
    }
    case 'RESET_DAILY_RITUALS':
      localStorage.removeItem('morningRitualComplete');
      localStorage.removeItem('eveningRitualComplete');
      localStorage.removeItem('userGoals');
      localStorage.removeItem('completedDays');
      localStorage.removeItem('currentDay');
      localStorage.removeItem('firstDayComplete');
      localStorage.removeItem('starBalance');
      return {
        ...initialState,
        userId: state.userId,
      };
    case 'SET_USER_ID':
      return {
        ...state,
        userId: action.payload,
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };
    case 'RESET_STEP':
      return {
        ...state,
        currentStep: 0,
      };
    case 'SET_USER_GOALS':
      localStorage.setItem('userGoals', JSON.stringify(action.payload));
      return {
        ...state,
        userGoals: action.payload,
      };
    case 'UPDATE_GOAL_STATUS': {
      const updatedGoals = state.userGoals.map((goal, index) => 
        index === action.payload.index 
          ? { ...goal, completed: action.payload.completed } 
          : goal
      );
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
      return {
        ...state,
        userGoals: updatedGoals,
      };
    }
    case 'ADD_STARS': {
      const newBalance = state.starBalance + action.payload;
      localStorage.setItem('starBalance', newBalance.toString());
      return {
        ...state,
        starBalance: newBalance,
      };
    }
    case 'TOGGLE_PUSH_NOTIFICATIONS':
      return {
        ...state,
        pushNotifications: !state.pushNotifications,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);