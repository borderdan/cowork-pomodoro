export type TimerPhase = 'work' | 'break';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface Settings {
  workDuration: number;
  breakDuration: number;
}

export interface SessionRecord {
  id: string;
  phase: TimerPhase;
  durationMinutes: number;
  completedAt: string;
}

export interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  secondsRemaining: number;
  totalSeconds: number;
}
