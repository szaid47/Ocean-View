
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import BackButton from './BackButton';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <header className="border-b border-gray-800 px-4 py-3 bg-sea-dark sticky top-0 z-10">
      <div className="container max-w-7xl mx-auto flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BackButton showLabel={true} />
            
            <div className="flex items-center ml-4">
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-400"
              >
                <path 
                  d="M3 16.5L12 21.75L21 16.5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M3 12L12 17.25L21 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M3 7.5L12 12.75L21 7.5L12 2.25L3 7.5Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="ml-2 text-xl font-semibold text-blue-400">Sea Guardian</h1>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center gap-1 text-blue-400"
          >
            <Info size={16} />
            <span className="hidden sm:inline">Activity Info</span>
            {showDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>

        {showDescription && (
          <div className="mt-3 p-3 bg-blue-900/30 rounded-md text-sm text-blue-100 border border-blue-800/50">
            <p>
              Discover a variety of sea activities happening along the coast! From thrilling water sports to relaxing beach events, 
              click on any marker to learn more about each activity, including time, location, and booking info.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🌊 Surfing Zones
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🪂 Parasailing Spots
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🐠 Snorkeling & Scuba
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🚤 Boat Tours & Jet Ski
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🐬 Dolphin & Whale Watching
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🏝️ Island Hopping
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🎣 Fishing Areas
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🔥 Beach Events
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🧘 Wellness Retreats
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-800/50 rounded-full text-xs">
                🚢 Harbor & Sunset Cruises
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
