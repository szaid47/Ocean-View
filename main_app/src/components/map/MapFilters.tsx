
import React from 'react';
import { Filter } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface MapFiltersProps {
  isFilterOpen: boolean;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedTimePeriod: string;
  setSelectedTimePeriod: (period: string) => void;
  selectedSeverity: string[];
  toggleSeverity: (severity: string) => void;
  applyFilters: () => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  isFilterOpen,
  selectedType,
  setSelectedType,
  selectedTimePeriod,
  setSelectedTimePeriod,
  selectedSeverity,
  toggleSeverity,
  applyFilters
}) => {
  if (!isFilterOpen) return null;
  
  return (
    <div className="absolute top-4 right-16 glass-container rounded-xl p-5 w-64 md:w-80 animate-fade-in z-10">
      <h3 className="font-semibold mb-3 flex items-center">
        <Filter className="w-4 h-4 mr-2" />
        Filter Data
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-foreground/70 block mb-1">Waste Type</label>
          <select 
            className="w-full rounded-md bg-secondary border border-white/10 p-2 text-sm"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="plastic">Plastic</option>
            <option value="industrial">Industrial</option>
            <option value="oil">Oil Spill</option>
            <option value="chemical">Chemical</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm text-foreground/70 block mb-1">Time Period</label>
          <select 
            className="w-full rounded-md bg-secondary border border-white/10 p-2 text-sm"
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm text-foreground/70 block mb-1">Severity Level</label>
          <div className="flex space-x-2">
            <button 
              className={`p-2 rounded-md ${selectedSeverity.includes('low') ? 'bg-emerald-500/50' : 'bg-emerald-500/20'} flex-1 text-sm`}
              onClick={() => toggleSeverity('low')}
            >
              Low
            </button>
            <button 
              className={`p-2 rounded-md ${selectedSeverity.includes('medium') ? 'bg-amber-500/50' : 'bg-amber-500/20'} flex-1 text-sm`}
              onClick={() => toggleSeverity('medium')}
            >
              Medium
            </button>
            <button 
              className={`p-2 rounded-md ${selectedSeverity.includes('high') ? 'bg-rose-500/50' : 'bg-rose-500/20'} flex-1 text-sm`}
              onClick={() => toggleSeverity('high')}
            >
              High
            </button>
          </div>
        </div>
        
        <button 
          className="glass-button ripple w-full mt-2"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default MapFilters;
