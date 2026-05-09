import { Settings } from '../types';

export const DEFAULT_SETTINGS: Settings = { workDuration: 25, breakDuration: 5 };
export const MAX_HISTORY_ENTRIES = 10;
export const STORAGE_KEYS = { SETTINGS: 'pomodoro_settings', HISTORY: 'pomodoro_history' } as const;
export const WORK_DURATION = { MIN: 1, MAX: 60 } as const;
export const BREAK_DURATION = { MIN: 1, MAX: 30 } as const;
