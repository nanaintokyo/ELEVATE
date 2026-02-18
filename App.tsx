
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
  const [copied, setCopied] = useState(false);

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
      setError('Connection interrupted. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    loadVerse(mood, timeOfDay);
  }, [mood, timeOfDay, loadVerse]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const time = getTimeOfDay();
    setTimeOfDay(time);
    loadVerse(mood, time);
  }, []);

  const handleMoodChange = (newMood: Mood) => {
    if (newMood === mood) return;
    setMood(newMood);
    loadVerse(newMood, timeOfDay);
  };

  return (
    <main className="relative min-h-screen bg-creme flex flex-col items-center justify-between p-8 md:p-16 overflow-hidden">
      {/* Top Header */}
      <header className="w-full max-w-6xl flex justify-between items-start z-30">
        <div className="flex flex-col">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none text-black select-none">
            Elevate<span className="text-accent-blue">.</span>
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-[10px] md:text-[12px] tracking-[0.4em] font-black uppercase text-black opacity-40">
              {timeOfDay} Essence • 2025
            </p>
            <button 
              onClick={copyLink}
              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-black/20 rounded-full transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'hover:bg-black hover:text-white'}`}
            >
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="group p-5 bg-black text-creme rounded-full transition-all duration-500 hover:rotate-90 active:scale-90 shadow-2xl"
          aria-label="New Card"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.65685 4 5.77259 5.97852 4.45648 8.86815M20 20V15H19.4185M19.4185 15H14.4185M4.06189 13C4.55399 16.9463 7.92038 20 12 20C15.3431 20 18.2274 18.0215 19.5435 15.1319" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      {/* 3D Flash Card Stack */}
      <section className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl px-4 z-10">
        <div className="relative w-full flex justify-center">
          {loading ? (
            <div className="flash-card-stack w-full max-w-2xl p-16 md:p-24 flex flex-col items-center justify-center space-y-8 animate-pulse">
              <div className="h-12 bg-black/5 w-full rounded"></div>
              <div className="h-12 bg-black/5 w-4/5 rounded"></div>
              <div className="h-4 bg-accent-blue/20 w-32 rounded mt-8"></div>
            </div>
          ) : error ? (
            <div className="flash-card-stack w-full max-w-2xl p-16 text-center border-red-500">
              <p className="text-xl font-black uppercase tracking-widest text-red-500">{error}</p>
            </div>
          ) : (
            <div key={verse?.reference} className="animate-card-entry w-full max-w-2xl">
              <div className="animate-card-3d flash-card-stack p-12 md:p-20 flex flex-col items-center justify-center">
                <blockquote className="text-3xl md:text-5xl lg:text-6xl font-serif-bold leading-[1.1] mb-10 text-black text-center normal-case">
                  “{verse?.text}”
                </blockquote>
                <div className="w-20 h-1.5 bg-accent-blue mb-10"></div>
                <p className="text-xs md:text-base tracking-[0.35em] font-black text-black uppercase max-w-lg mx-auto text-center opacity-60 leading-relaxed">
                  {verse?.reflection}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mood Selector & Floating Reference */}
      <footer className="w-full max-w-6xl flex flex-col items-center z-30 pb-12">
        <MoodSelector currentMood={mood} onMoodChange={handleMoodChange} />
        
        {/* Organic Balloon Reference */}
        <div className="mt-24 relative w-full h-32 flex items-center justify-center">
          {!loading && verse && (
            <div className="animate-balloon-organic absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
              <span className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.5em] uppercase text-black/100 select-none drop-shadow-sm">
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
