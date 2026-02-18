
import React from 'react';
import { Mood } from '../types';

interface MoodSelectorProps {
  currentMood: Mood;
  onMoodChange: (mood: Mood) => void;
}

const moods: Mood[] = Object.values(Mood);

const MoodSelector: React.FC<MoodSelectorProps> = ({ currentMood, onMoodChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-10">
      {moods.map((mood) => (
        <button
          key={mood}
          onClick={() => onMoodChange(mood)}
          className={`px-5 py-2.5 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 border-2 ${
            currentMood === mood
              ? 'bg-black text-creme border-black shadow-[4px_4px_0px_0px_#2563EB]'
              : 'bg-transparent text-black border-black hover:bg-black hover:text-creme'
          }`}
        >
          {mood}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
