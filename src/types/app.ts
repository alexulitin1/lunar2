export enum AppScreen {
  ONBOARDING = 'onboarding',
  MORNING_START = 'morning_start',
  MORNING_RITUAL = 'morning_ritual',
  EVENING_RITUAL = 'evening_ritual',
  HOME = 'home',
  CYCLE = 'cycle',
  STARS = 'stars',
  SETTINGS = 'settings',
  DAY_STATISTICS = 'day_statistics',
}

export enum OnboardingStep {
  WELCOME = 0,
  BENEFITS = 1,
  FEATURES = 2,
}

export enum MorningRitualStep {
  INTRO = 0,
  SET_GOALS = 1,
  BREATHING = 2,
  COMPLETE = 3,
}

export enum EveningRitualStep {
  INTRO = 0,
  CHECK_TASKS = 1,
  AI_CHAT = 2,
  BREATHING = 3,
  COMPLETE = 4,
}

export interface Goal {
  text: string;
  completed: boolean;
  note?: string;
}

export interface AppState {
  currentScreen: AppScreen;
  onboardingComplete: boolean;
  morningRitualComplete: boolean;
  eveningRitualComplete: boolean;
  currentStep: number;
  userGoals: Goal[];
  completedDays: string[];
  currentDay: number;
  starBalance: number;
  pushNotifications: boolean;
  language: string;
  firstDayComplete: boolean;
  userId: string;
}

export type AppAction =
  | { type: 'INITIALIZE_APP'; payload: Partial<AppState> }
  | { type: 'SET_CURRENT_SCREEN'; payload: AppScreen }
  | { type: 'SET_ONBOARDING_COMPLETE' }
  | { type: 'SET_MORNING_RITUAL_COMPLETE' }
  | { type: 'SET_EVENING_RITUAL_COMPLETE' }
  | { type: 'SET_FIRST_DAY_COMPLETE' }
  | { type: 'SET_USER_ID'; payload: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET_STEP' }
  | { type: 'RESET_DAILY_RITUALS' }
  | { type: 'SET_USER_GOALS'; payload: Goal[] }
  | { type: 'UPDATE_GOAL_STATUS'; payload: { index: number; completed: boolean } }
  | { type: 'ADD_STARS'; payload: number }
  | { type: 'TOGGLE_PUSH_NOTIFICATIONS' }
  | { type: 'SET_LANGUAGE'; payload: string };