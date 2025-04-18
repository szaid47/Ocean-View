
import React from 'react';
import { Layers, Filter, Info } from 'lucide-react';

interface MapControlsProps {
  heatmapVisible: boolean;
  toggleHeatmap: () => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  flyToCoordinates: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  heatmapVisible,
  toggleHeatmap,
  isFilterOpen,
  setIsFilterOpen,
  flyToCoordinates
}) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-4">
      <button 
        className={`glass-container p-2 rounded-lg hover:bg-white/5 transition-colors ${heatmapVisible ? 'bg-ocean/10' : ''}`}
        title={heatmapVisible ? "Hide Heatmap" : "Show Heatmap"}
        onClick={toggleHeatmap}
        aria-pressed={heatmapVisible}
      >
        <Layers className="w-5 h-5" />
      </button>
      
      <button 
        className={`glass-container p-2 rounded-lg hover:bg-white/5 transition-colors ${isFilterOpen ? 'bg-ocean/10' : ''}`}
        title="Filter Data"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        aria-pressed={isFilterOpen}
      >
        <Filter className="w-5 h-5" />
      </button>
      
      <button 
        className="glass-container p-2 rounded-lg hover:bg-white/5 transition-colors"
        title="Focus on Target Area"
        onClick={flyToCoordinates}
      >
        <Info className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MapControls;
