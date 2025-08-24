
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generatePitch } from './services/geminiService';
import type { PitchData } from './types';
import PitchResult from './components/PitchResult';
import Loader from './components/Loader';
import { ExclamationTriangleIcon, SearchIconWithSparkle, SendIcon } from './components/Icons';


const App: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [placeholder, setPlaceholder] = useState<string>('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimationRunning = useRef(true);

  const placeholderIdeas = useRef([
    "A mobile app for local gardeners to trade seeds...",
    "An AI-powered platform for personalized travel itineraries...",
    "A subscription box for artisanal coffee from around the world...",
    "A marketplace for sustainable and ethically-made fashion...",
    "A tool to help students manage their study schedules..."
  ]).current;

  useEffect(() => {
    let ideaIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      if (!isAnimationRunning.current) {
        setPlaceholder("A mobile app for local gardeners to trade seeds...");
        return;
      }

      const fullText = placeholderIdeas[ideaIndex];
      let delay = 100;

      if (isDeleting) {
        charIndex--;
        delay = 50;
      } else {
        charIndex++;
      }
      
      const currentText = fullText.substring(0, charIndex);
      setPlaceholder(currentText + '|');

      if (!isDeleting && charIndex === fullText.length) {
        isDeleting = true;
        delay = 2000; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        ideaIndex = (ideaIndex + 1) % placeholderIdeas.length;
        delay = 500; // Pause before new word
      }

      typingTimeoutRef.current = setTimeout(type, delay);
    };

    type();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [placeholderIdeas]);

  const handleIdeaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAnimationRunning.current) {
      isAnimationRunning.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setPlaceholder("A mobile app for local gardeners to trade seeds...");
    }
    setIdea(e.target.value);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnimationRunning.current) {
      isAnimationRunning.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
    if (!idea.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setPitchData(null);

    try {
      const result = await generatePitch(idea);
      setPitchData(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate pitch. The model may be overloaded. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }, [idea, isLoading]);

  return (
    <div 
      className="min-h-screen text-slate-100 font-sans p-4 sm:p-6 lg:p-8 relative"
      style={{backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.15) 0%, rgba(192, 132, 252, 0) 60%)'}}
    >
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-10">
        <h2 className="text-2xl font-bold text-white">
          Spot-Pitch<span className="text-fuchsia-400">.ai</span>
        </h2>
      </div>

      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-10 pt-16 sm:pt-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Generate with
            <span className="block bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent mt-1">
              Seamless Power
              <span className="text-fuchsia-400 text-3xl align-middle relative -top-3 ml-1">✨</span>
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Your favorite business pitch generator.
          </p>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="mb-10 max-w-2xl mx-auto">
            <div className="p-[2px] rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 shadow-lg">
              <div className="relative flex items-center w-full bg-[#13111C] rounded-full">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-5 pointer-events-none">
                  <SearchIconWithSparkle className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="idea-input"
                  type="text"
                  value={idea}
                  onChange={handleIdeaChange}
                  placeholder={placeholder}
                  className="w-full bg-transparent border-none rounded-full py-4 pl-12 pr-16 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                  disabled={isLoading}
                />
                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
                  <button
                    type="submit"
                    disabled={isLoading || !idea.trim()}
                    className="p-2.5 bg-[#1E1C29] rounded-full text-white hover:bg-gray-800 disabled:text-gray-600 disabled:bg-transparent transition-colors"
                    aria-label="Generate Pitch"
                  >
                    {isLoading ? <Loader /> : <SendIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {error && (
             <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg flex items-center gap-4">
               <ExclamationTriangleIcon className="w-6 h-6 text-red-400 flex-shrink-0" />
               <div>
                <h3 className="font-semibold text-red-200">An Error Occurred</h3>
                <p>{error}</p>
               </div>
            </div>
          )}

          {pitchData && <PitchResult data={pitchData} />}
        </main>
        
        <footer className="text-center mt-12 text-gray-600 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;