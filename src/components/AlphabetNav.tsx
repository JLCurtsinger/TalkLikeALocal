import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { states } from '../data/states';
import { cultures } from '../data/cultures';
import { generateTermId } from '../utils/share';

export function AlphabetNav() {
  const location = useLocation();
  const [activeLetters, setActiveLetters] = useState<string[]>([]);
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get the items based on the current page
    const isCulturalTerms = location.pathname === '/cultural-terms';
    const items = isCulturalTerms ? cultures : states;
    
    // Get unique first letters from actual data
    const letters = items.map(item => item.name[0].toUpperCase());
    setActiveLetters([...new Set(letters)].sort());
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);

      // Get the items based on the current page
      const isCulturalTerms = location.pathname === '/cultural-terms';
      const items = isCulturalTerms ? cultures : states;
      
      // Check each item's position
      for (const item of items) {
        const element = document.getElementById(generateTermId(item.name));
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        // Account for navbar height (64px) plus padding
        if (rect.top <= 80) {
          setCurrentLetter(item.name[0].toUpperCase());
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const scrollToLetter = (letter: string) => {
    const isCulturalTerms = location.pathname === '/cultural-terms';
    const items = isCulturalTerms ? cultures : states;
    
    const item = items.find(i => i.name[0].toUpperCase() === letter);
    if (!item) return;

    const element = document.getElementById(generateTermId(item.name));
    if (!element) return;

    const navbarHeight = 64; // Height of the fixed navbar
    const padding = 16; // Additional padding
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - padding;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <style>{`
        /* Fix light mode hover: maintain gradient text color, prevent white text */
        .alphabet-nav-button:not(.alphabet-nav-current) {
          position: relative;
        }
        /* Light mode: maintain gradient text on hover - override any white text */
        :not(.dark) .alphabet-nav-button:not(.alphabet-nav-current):hover {
          background-image: linear-gradient(to right, rgb(37 99 235), rgb(147 51 234)) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          background-color: transparent !important;
        }
        /* Use pseudo-element for the hover background square in light mode */
        :not(.dark) .alphabet-nav-button:not(.alphabet-nav-current):hover::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgb(37 99 235 / 0.2), rgb(147 51 234 / 0.2));
          border-radius: inherit;
          z-index: -1;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
      `}</style>
      {/* Horizontal nav at the top */}
      <nav 
        className="bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 mx-auto max-w-3xl"
        aria-label="Alphabetical navigation"
      >
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {activeLetters.map(letter => {
            const isCurrent = currentLetter === letter;
            
            return (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className={`alphabet-nav-button ${isCurrent ? 'alphabet-nav-current' : ''}
                  w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg
                  font-semibold text-base sm:text-lg transition-all duration-200
                  hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20
                  dark:hover:bg-gradient-to-r dark:hover:from-blue-600 dark:hover:to-purple-600 dark:hover:text-white
                  hover:shadow-md
                  ${isCurrent 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-110' 
                    : 'bg-white/80 dark:bg-gray-700/50 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}
                `}
                aria-label={`Jump to ${letter} section`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Vertical nav on the right */}
      <nav 
        className={`fixed right-0 top-1/2 -translate-y-1/2 transition-all duration-300 z-20
          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
          max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent
          @media (max-height: 600px) { max-height: 70vh }
        `}
        aria-label="Quick navigation"
      >
        <div className="flex flex-col gap-1 sm:gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-l-lg shadow-lg border-l-2 border-blue-500/20 p-1.5 sm:p-2 mr-0">
          {activeLetters.map(letter => {
            const isCurrent = currentLetter === letter;
            
            return (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className={`alphabet-nav-button ${isCurrent ? 'alphabet-nav-current' : ''}
                  w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-l-md
                  font-semibold text-xs sm:text-sm transition-all duration-200
                  hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20
                  dark:hover:bg-gradient-to-r dark:hover:from-blue-600 dark:hover:to-purple-600 dark:hover:text-white
                  hover:shadow-md
                  ${isCurrent 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                    : 'bg-white/80 dark:bg-gray-700/50 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}
                `}
                aria-label={`Jump to ${letter} section`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}