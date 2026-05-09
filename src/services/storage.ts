import type { Settings, SessionRecord, TimerPhase } from '../types';
import { DEFAULT_SETTINGS, MAX_HISTORY_ENTRIES, STORAGE_KEYS, WORK_DURATION, BREAK_DURATION } from '../constants';

export const getSettings = (): Settings => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!item) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(item) as Partial<Settings>;

    const workDuration = parsed.workDuration ?? DEFAULT_SETTINGS.workDuration;
    const breakDuration = parsed.breakDuration ?? DEFAULT_SETTINGS.breakDuration;

    if (
      typeof workDuration !== 'number' ||
      typeof breakDuration !== 'number' ||
      workDuration < WORK_DURATION.MIN || workDuration > WORK_DURATION.MAX ||
      breakDuration < BREAK_DURATION.MIN || breakDuration > BREAK_DURATION.MAX
    ) {
      return DEFAULT_SETTINGS;
    }
    return { workDuration, breakDuration };
  } catch (error) {
    console.error('Failed to get settings from storage:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Settings): void => {
  try {
    if (
      settings.workDuration < WORK_DURATION.MIN || settings.workDuration > WORK_DURATION.MAX ||
      settings.breakDuration < BREAK_DURATION.MIN || settings.breakDuration > BREAK_DURATION.MAX
    ) {
      console.warn('Invalid settings range. Not saving to storage.');
      return;
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to storage:', error);
  }
};

export const getHistory = (): SessionRecord[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!item) return [];
    return JSON.parse(item) as SessionRecord[];
  } catch (error) {
    console.error('Failed to get history from storage:', error);
    return [];
  }
};

export const addSessionToHistory = (phase: TimerPhase, durationMinutes: number): void => {
  try {
    const history = getHistory();
    const newSession: SessionRecord = {
      id: crypto.randomUUID(),
      phase,
      durationMinutes,
      completedAt: new Date().toISOString()
    };
    const newHistory = [newSession, ...history].slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to add session to history:', error);
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};
