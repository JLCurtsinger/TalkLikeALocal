import React, { useEffect, useState, useMemo } from 'react';
import { Term } from '../types';
import { generateTermId } from '../utils/share';

interface NestedAlphabetNavProps {
  terms: Term[];
  sectionName: string;
  isVisible: boolean;
}

export function NestedAlphabetNav({ terms, sectionName, isVisible }: NestedAlphabetNavProps) {
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);

  // Get unique first letters from terms
  const activeLetters = useMemo(() => {
    const letters = terms.map(term => term.word[0].toUpperCase());
    return [...new Set(letters)].sort();
  }, [terms]);

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      // Check each term's position to determine current letter
      for (const term of terms) {
        const element = document.getElementById(generateTermId(term.word));
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        // Account for navbar height (64px) plus padding
        if (rect.top <= 80) {
          setCurrentLetter(term.word[0].toUpperCase());
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [terms, isVisible]);

  const scrollToLetter = (letter: string) => {
    const term = terms.find(t => t.word[0].toUpperCase() === letter);
    if (!term) return;

    const element = document.getElementById(generateTermId(term.word));
    if (!element) return;

    const navbarHeight = 64;
    const padding = 16;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - padding;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  if (!isVisible || activeLetters.length === 0) return null;

  return (
    <nav 
      className={`fixed right-12 top-1/2 -translate-y-1/2 transition-all duration-300 z-30
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
        max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent
      `}
      aria-label={`Quick navigation for ${sectionName}`}
    >
      <div className="flex flex-col gap-1 bg-white/95 dark:bg-gray-700/95 backdrop-blur-sm rounded-l-lg shadow-lg border-r-2 border-purple-500/20 p-1.5 -mr-2 border-r-0">
        {activeLetters.map(letter => {
          const isCurrent = currentLetter === letter;
          
          return (
            <button
              key={letter}
              onClick={() => scrollToLetter(letter)}
              className={`
                w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-l-md
                font-semibold text-xs transition-all duration-200
                hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white hover:shadow-md
                ${isCurrent 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md scale-105' 
                  : 'bg-white/90 dark:bg-gray-600/90 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent'}
              `}
              aria-label={`Jump to ${letter} terms in ${sectionName}`}
              title={`${letter} terms`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </nav>
  );
}