import React from 'react';
import { Term } from '../types';
import { shareTerm } from '../utils/share';

interface ShareButtonProps {
  term: Term;
  context: string;
}

export function ShareButton({ term, context }: ShareButtonProps) {
  const handleShare = async () => {
    await shareTerm({ term, context });
  };

  return (
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
  );
}