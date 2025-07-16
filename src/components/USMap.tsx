import React from 'react';
import { MapPin } from 'lucide-react';

interface USMapProps {
  onStateClick: (state: string) => void;
}

export function USMap({ onStateClick }: USMapProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <img
        src="https://images.unsplash.com/photo-1598313183973-4effcded8d5e?auto=format&fit=crop&w=2000"
        alt="United States Map"
        className="w-full h-auto"
      />
      <div className="absolute inset-0 grid grid-cols-12 gap-2">
        {/* Example state markers - more would be added */}
        <button
          onClick={() => onStateClick('Louisiana')}
          className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 group"
          aria-label="Louisiana"
        >
          <MapPin className="w-6 h-6 text-red-500 hover:text-red-600 transition-colors" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Louisiana
          </span>
        </button>
      </div>
    </div>
  );
}