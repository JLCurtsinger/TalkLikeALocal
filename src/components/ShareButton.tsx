import React, { useState } from 'react';
import { Term } from '../types';
import { shareTerm } from '../utils/share';

interface ShareButtonProps {
  term: Term;
  context: string;
}

export function ShareButton({ term, context }: ShareButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShare = async () => {
    const success = await shareTerm({ term, context });
    
    if (success && !navigator.share) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        aria-label={`Share ${term.word}`}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 512 512" 
          className="fill-current"
          aria-hidden="true"
        >
          <path d="M384 336a63.78 63.78 0 00-46.12 19.7l-148-83.27a63.85 63.85 0 000-32.86l148-83.27a63.8 63.8 0 10-15.73-45.3 64 64 0 007.86 30.42l-148 83.27a64 64 0 100 93.72l148 83.27A64 64 0 10384 336z"/>
        </svg>
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}