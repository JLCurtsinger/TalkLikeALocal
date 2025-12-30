import React, { useState, useRef, useEffect } from 'react';
import { Term } from '../types';
import { shareTerm, copyTermLink } from '../utils/share';

interface ShareButtonProps {
  term: Term;
  context: string;
}

export function ShareButton({ term, context }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check if Web Share API is available
  const hasShareAPI = navigator.share && window.isSecureContext;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleShareClick = async () => {
    // Always try native share API first (restores original behavior)
    const success = await shareTerm({ term, context });
    
    if (success) {
      // Native share was successful, don't show menu
      return;
    }
    
    // If share API not available or user cancelled, show menu with copy option
    // Only show menu if share API is not available (not if user just cancelled)
    if (!hasShareAPI) {
      setShowMenu(!showMenu);
    }
  };

  const handleShareOption = async () => {
    setShowMenu(false);
    // Try share API again (in case it becomes available)
    const success = await shareTerm({ term, context });
    if (success) {
      setTooltipText('Shared!');
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    setShowMenu(false);
    const success = await copyTermLink({ term, context });
    if (success) {
      setTooltipText('Copied to clipboard!');
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleShareClick}
        className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        aria-label={`Share ${term.word}`}
        aria-expanded={showMenu}
        aria-haspopup="true"
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
      
      {/* Menu dropdown - shown when Web Share API is not available */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          role="menu"
        >
          <button
            onClick={handleShareOption}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
            role="menuitem"
          >
            Share...
          </button>
          <button
            onClick={handleCopyLink}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors"
            role="menuitem"
          >
            Copy link
          </button>
        </div>
      )}
      
      {/* Tooltip for copy confirmation */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg whitespace-nowrap z-50">
          {tooltipText}
        </div>
      )}
    </div>
  );
}