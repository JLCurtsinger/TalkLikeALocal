import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { State, Term } from '../types';
import { ShareButton } from './ShareButton';
import { CopyLinkButton } from './CopyLinkButton';
import { NestedAlphabetNav } from './NestedAlphabetNav';
import { generateTermId, generateTermCardId } from '../utils/share';
import { useTheme } from '../contexts/ThemeContext';

interface StateSectionProps {
  state: State;
  isExpanded: boolean;
  onToggle: () => void;
  filteredTerms?: Term[];
}

export function StateSection({ state, isExpanded, onToggle, filteredTerms }: StateSectionProps) {
  const { theme } = useTheme();
  const termsToDisplay = filteredTerms || state.terms;
  
  // Check if this section is currently in view
  const [isInView, setIsInView] = React.useState(false);
  
  React.useEffect(() => {
    if (!isExpanded) {
      setIsInView(false);
      return;
    }

    const handleScroll = () => {
      const element = document.getElementById(generateTermId(state.name));
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Consider in view if any part of the section is visible
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      setIsInView(isVisible);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded, state.name]);

  return (
    <>
      <NestedAlphabetNav 
        terms={termsToDisplay}
        sectionName={state.name}
        isVisible={isExpanded && isInView}
      />
      
      <section id={generateTermId(state.name)} className={`py-4 pr-20 ${!isExpanded ? 'pb-2' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left mb-2 group"
        aria-expanded={isExpanded}
        aria-controls={`content-${state.name}`}
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{state.name}</h2>
        <div className="text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {isExpanded ? (
            <ChevronDown className="w-6 h-6" />
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
        </div>
      </button>
      
      <div
        id={`content-${state.name}`}
        className={`grid gap-4 transition-all duration-300 relative ${
          isExpanded ? 'opacity-100 mt-4' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        {termsToDisplay.map((term, index) => (
          <div 
            key={`${state.name}-${term.word}-${index}`} 
            id={generateTermCardId(term.word)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors scroll-mt-24 relative z-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold dark:text-white">{term.word}</h3>
                <p className="text-gray-600 dark:text-gray-300">{term.phonetic}</p>
                {term.description && (
                  <p className="text-gray-500 dark:text-gray-400 mt-2">{term.description}</p>
                )}
              </div>
              <div className="flex items-center gap-0">
                <ShareButton term={term} context={state.name} />
                <CopyLinkButton term={term} context={state.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}