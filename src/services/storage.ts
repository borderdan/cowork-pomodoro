import type { Settings, SessionRecord, TimerPhase } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEYS, WORK_DURATION, BREAK_DURATION, MAX_HISTORY_ENTRIES } from '../constants';

export const getSettings = (): Settings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(data);

    // Validate the parsed settings
    const workDuration = typeof parsed.workDuration === 'number' && !isNaN(parsed.workDuration) ? parsed.workDuration : DEFAULT_SETTINGS.workDuration;
    const breakDuration = typeof parsed.breakDuration === 'number' && !isNaN(parsed.breakDuration) ? parsed.breakDuration : DEFAULT_SETTINGS.breakDuration;

    // Enforce ranges
    if (workDuration < WORK_DURATION.MIN || workDuration > WORK_DURATION.MAX) {
      return DEFAULT_SETTINGS;
    }
    if (breakDuration < BREAK_DURATION.MIN || breakDuration > BREAK_DURATION.MAX) {
      return DEFAULT_SETTINGS;
    }

    return { workDuration, breakDuration };
  } catch (error) {
    console.error('Failed to get settings from localStorage', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Settings): void => {
  try {
    // Validate ranges before saving
    let workDuration = Math.max(WORK_DURATION.MIN, Math.min(WORK_DURATION.MAX, settings.workDuration));
    let breakDuration = Math.max(BREAK_DURATION.MIN, Math.min(BREAK_DURATION.MAX, settings.breakDuration));

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ workDuration, breakDuration }));
  } catch (error) {
    console.error('Failed to save settings to localStorage', error);
  }
};

export const getHistory = (): SessionRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to get history from localStorage', error);
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

    const updatedHistory = [newSession, ...history].slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to add session to history', error);
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Failed to clear history', error);
  }
};
