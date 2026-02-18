
import React, { useState, useEffect, useCallback } from 'react';
import { Mood, TimeOfDay, VerseData } from './types';
import { fetchVerse } from './services/geminiService';
import MoodSelector from './components/MoodSelector';

const App: React.FC = () => {
  const [mood, setMood] = useState<Mood>(Mood.JOYFUL);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Morning');
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getTimeOfDay = (): TimeOfDay => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
  };

  const loadVerse = useCallback(async (currentMood: Mood, currentTime: TimeOfDay) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVerse(currentMood, currentTime);
      setVerse(data);
    } catch (err) {
      setError('Connection lost. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    loadVerse(mood, timeOfDay);
  }, [mood, timeOfDay, loadVerse]);

  useEffect(() => {
    const time = getTimeOfDay();
    setTimeOfDay(time);
    loadVerse(mood, time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMoodChange = (newMood: Mood) => {
    if (newMood === mood) return;
    setMood(newMood);
    loadVerse(newMood, timeOfDay);
  };

  return (
    <main className="relative min-h-screen bg-creme flex flex-col items-center justify-between p-8 md:p-16 overflow-hidden">
      {/* Top Navigation */}
      <header className="w-full max-w-5xl flex justify-between items-start z-20">
        <div className="flex flex-col">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-black">
            Elevate<span className="text-accent-blue">.</span>
          </h1>
          <p className="text-[11px] tracking-[0.4em] font-bold uppercase mt-3 text-black opacity-50">
            {timeOfDay} Essence • 2025
          </p>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="group p-4 bg-black text-creme rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl"
          aria-label="Refresh wisdom"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.65685 4 5.77259 5.97852 4.45648 8.86815M20 20V15H19.4185M19.4185 15H14.4185M4.06189 13C4.55399 16.9463 7.92038 20 12 20C15.3431 20 18.2274 18.0215 19.5435 15.1319" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      {/* Floating Verse Card */}
      <section className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-4 z-10">
        <div className="relative w-full flex justify-center">
          {loading ? (
            <div className="flash-card w-full max-w-2xl p-12 md:p-20 flex flex-col items-center justify-center space-y-6 animate-pulse bg-white border-2 border-black">
              <div className="h-10 bg-black/5 w-full rounded"></div>
              <div className="h-10 bg-black/5 w-5/6 rounded"></div>
              <div className="h-10 bg-black/5 w-4/6 rounded"></div>
            </div>
          ) : error ? (
            <div className="flash-card w-full max-w-2xl p-12 bg-white border-2 border-black text-center">
              <p className="text-xl font-black uppercase tracking-widest">{error}</p>
            </div>
          ) : (
            <div 
              key={verse?.reference} 
              className="animate-card-entry"
            >
              <div className="animate-card-float flash-card w-full max-w-2xl p-10 md:p-16 flex flex-col items-center justify-center">
                <blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif-bold leading-[1.2] mb-8 text-black text-center normal-case">
                  “{verse?.text}”
                </blockquote>
                <div className="w-16 h-1 bg-accent-blue mb-8"></div>
                <p className="text-xs md:text-sm tracking-[0.3em] font-black text-black uppercase max-w-md mx-auto text-center opacity-70">
                  {verse?.reflection}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Controls & Floating Reference */}
      <footer className="w-full max-w-5xl flex flex-col items-center z-20 pb-8">
        <MoodSelector currentMood={mood} onMoodChange={handleMoodChange} />
        
        {/* Balloon-like Floating Reference (Text only) */}
        <div className="mt-20 relative w-full h-32 flex items-center justify-center">
          {!loading && verse && (
            <div className="animate-balloon absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
              <span className="text-2xl md:text-4xl font-black tracking-[0.6em] uppercase text-black/90 select-none">
                {verse.reference}
              </span>
            </div>
          )}
        </div>
      </footer>
    </main>
  );
};

export default App;
