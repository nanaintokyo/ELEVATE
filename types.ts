
export enum Mood {
  GRATEFUL = 'Grateful',
  TIRED = 'Tired',
  ANXIOUS = 'Anxious',
  POWERFUL = 'Powerful',
  SEEKING = 'Seeking',
  JOYFUL = 'Joyful'
}

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface VerseData {
  text: string;
  reference: string;
  reflection: string;
}
