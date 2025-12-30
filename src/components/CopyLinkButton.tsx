import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { Term } from '../types';
import { buildTermUrl } from '../utils/share';

interface CopyLinkButtonProps {
  term: Term;
  context: string;
}

export function CopyLinkButton({ term, context }: CopyLinkButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      const url = buildTermUrl(term, context);
      
      // Try clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
        return;
      }
      
      // Fallback to prompt if clipboard API not available
      window.prompt('Copy this link:', url);
    } catch (error) {
      // If clipboard fails, fall back to prompt
      const url = buildTermUrl(term, context);
      window.prompt('Copy this link:', url);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        aria-label="Copy link"
      >
        <Copy className="w-5 h-5" aria-hidden="true" />
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg whitespace-nowrap z-50">
          Copied!
        </div>
      )}
    </div>
  );
}

