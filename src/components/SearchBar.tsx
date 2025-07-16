import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';
import { useLocation } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const placeholderText = location.pathname === '/cultural-terms' 
    ? "Search for a culture or term..."
    : "Search for a state or term...";

  const debouncedSearch = useCallback(
    debounce((term: string) => onSearch(term), 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative max-w-2xl mx-auto mt-8">
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg p-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholderText}
          className="w-full px-4 py-3 pl-12 bg-transparent border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          aria-label="Search states and terms"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
      </div>
    </div>
  );
}