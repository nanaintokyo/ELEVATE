
import React, { useState, useEffect, useCallback } from 'react';
import { Mood, TimeOfDay, VerseData } from './types';
import { fetchVerse } from './services/geminiService';
import MoodSelector from './components/MoodSelector';

interface Gratitude {
  id: string;
  text: string;
  timestamp: string;
}

interface Prayer {
  id: string;
  text: string;
  category: 'Self' | 'Others' | 'World';
  timestamp: string;
}

const App: React.FC = () => {
  const [mood, setMood] = useState<Mood>(Mood.JOYFUL);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Morning');
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Gratitude State
  const [gratitudes, setGratitudes] = useState<Gratitude[]>([]);
  const [newGratitude, setNewGratitude] = useState('');

  // Prayer Modal State
  const [isPrayerOpen, setIsPrayerOpen] = useState(false);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayer, setNewPrayer] = useState('');
  const [prayerCategory, setPrayerCategory] = useState<'Self' | 'Others' | 'World'>('Self');

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
      setError('Connection interrupted.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const time = getTimeOfDay();
    setTimeOfDay(time);
    loadVerse(mood, time);
  }, []);

  const handleMoodChange = (newMood: Mood) => {
    setMood(newMood);
    loadVerse(newMood, timeOfDay);
  };

  const addGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGratitude.trim()) return;
    const entry: Gratitude = {
      id: Date.now().toString(),
      text: newGratitude,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setGratitudes([entry, ...gratitudes]);
    setNewGratitude('');
  };

  const savePrayer = () => {
    if (!newPrayer.trim()) return;
    const entry: Prayer = {
      id: Date.now().toString(),
      text: newPrayer,
      category: prayerCategory,
      timestamp: new Date().toLocaleDateString(),
    };
    setPrayers([entry, ...prayers]);
    setNewPrayer('');
    setIsPrayerOpen(false);
  };

  return (
    <main className="relative min-h-screen bg-creme flex flex-col items-center p-6 md:p-12">
      {/* Top Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12 z-40">
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-black">
            Elevate<span className="text-accent-blue">.</span>
          </h1>
          <p className="text-[10px] tracking-[0.4em] font-black uppercase text-black opacity-30 mt-2">
            {timeOfDay} Essence • 2025
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => loadVerse(mood, timeOfDay)}
            className="text-[10px] font-black uppercase tracking-widest hover:text-accent-blue transition-colors"
          >
            Refresh Verse
          </button>
          <div 
            onClick={() => setIsPrayerOpen(true)}
            className="joystick-base"
            title="Open Prayer Portal"
          >
            <div className="joystick-stick"></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1 items-start">
        
        {/* Flash Card Section */}
        <section className="lg:col-span-7 flex flex-col items-center justify-center min-h-[50vh]">
          {loading ? (
            <div className="flash-card-stack w-full max-w-sm p-12 aspect-[3/4] flex flex-col items-center justify-center animate-pulse bg-white">
              <div className="h-6 bg-black/5 w-full rounded mb-4"></div>
              <div className="h-6 bg-black/5 w-4/5 rounded"></div>
            </div>
          ) : (
            <div key={verse?.reference} className="animate-float-pronounced w-full max-w-sm">
              <div className="flash-card-stack p-8 md:p-12 aspect-[3/4] flex flex-col items-center justify-center bg-white text-center">
                <blockquote className="text-2xl md:text-3xl font-serif-bold leading-tight mb-6 text-black normal-case">
                  “{verse?.text}”
                </blockquote>
                <div className="w-10 h-1 bg-accent-blue mb-6"></div>
                <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-[0.2em] opacity-60 leading-relaxed mb-4">
                  {verse?.reflection}
                </p>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-accent-blue">
                  {verse?.reference}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Gratitude & Moods Section */}
        <section className="lg:col-span-5 flex flex-col gap-10">
          {/* Gratitude Journal */}
          <div className="bg-white border-3 border-black p-6 shadow-[6px_6px_0px_#000]">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-blue rounded-full"></span>
              Gratitude Journal
            </h3>
            <form onSubmit={addGratitude} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newGratitude}
                onChange={(e) => setNewGratitude(e.target.value)}
                placeholder="What are you grateful for?"
                className="flex-1 bg-creme border-2 border-black p-2 text-xs font-bold focus:outline-none"
              />
              <button type="submit" className="bg-black text-white px-4 text-xs font-black uppercase">Add</button>
            </form>
            <div className="gratitude-list space-y-3 max-h-[200px] overflow-y-auto pr-2">
              {gratitudes.length === 0 && <p className="text-[10px] uppercase font-bold opacity-30 italic">No entries yet...</p>}
              {gratitudes.map(g => (
                <div key={g.id} className="border-b border-black/10 pb-2 flex justify-between items-start">
                  <p className="text-xs font-bold leading-snug">{g.text}</p>
                  <span className="text-[9px] font-black opacity-30 whitespace-nowrap ml-4">{g.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          <MoodSelector currentMood={mood} onMoodChange={handleMoodChange} />
        </section>
      </div>

      {/* Reference Footer (Decorative) */}
      <footer className="w-full mt-12 flex justify-center py-6 opacity-10 pointer-events-none">
        <span className="text-6xl md:text-9xl font-black uppercase tracking-tighter whitespace-nowrap">
          {verse?.reference || "Elevate"}
        </span>
      </footer>

      {/* Prayer Modal */}
      {isPrayerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 modal-overlay">
          <div className="bg-white border-4 border-black w-full max-w-lg shadow-[12px_12px_0px_#000] p-8 relative">
            <button 
              onClick={() => setIsPrayerOpen(false)}
              className="absolute top-4 right-4 font-black uppercase text-xs hover:text-accent-blue"
            >
              Close
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Prayer Portal</h2>
            
            <div className="flex gap-2 mb-4">
              {['Self', 'Others', 'World'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPrayerCategory(cat as any)}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black transition-all ${prayerCategory === cat ? 'bg-black text-white' : 'hover:bg-creme'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <textarea 
              value={newPrayer}
              onChange={(e) => setNewPrayer(e.target.value)}
              placeholder="Pour your heart out here..."
              className="w-full h-32 bg-creme border-3 border-black p-4 text-sm font-bold focus:outline-none mb-6 resize-none"
            />

            <button 
              onClick={savePrayer}
              className="w-full bg-accent-blue text-white py-4 font-black uppercase tracking-[0.2em] border-3 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
            >
              Commit to Prayer
            </button>

            {prayers.length > 0 && (
              <div className="mt-8">
                <p className="text-[10px] font-black uppercase opacity-30 mb-2">Previous Commitments</p>
                <div className="max-h-[100px] overflow-y-auto space-y-2">
                  {prayers.slice(0, 3).map(p => (
                    <div key={p.id} className="text-[10px] font-bold border-l-2 border-accent-blue pl-2 py-1">
                      {p.text.substring(0, 60)}...
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
