
import React from 'react';

interface MapStatsFooterProps {
  filteredData: Array<{
    id: number;
    type: string;
    severity: string;
    lat: number;
    lng: number;
    size: number;
    timestamp: number;
  }>;
  selectedType: string;
  selectedSeverity: string[];
}

const MapStatsFooter: React.FC<MapStatsFooterProps> = ({
  filteredData,
  selectedType,
  selectedSeverity
}) => {
  return (
    <div className="bg-secondary border-t border-white/5 py-3">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-foreground/70 text-xs">Active Hotspots</div>
            <div className="font-semibold">{filteredData.length}</div>
          </div>
          <div className="text-center">
            <div className="text-foreground/70 text-xs">Total Waste</div>
            <div className="font-semibold">
              {filteredData.reduce((sum, point) => sum + point.size, 0)} tons
            </div>
          </div>
          <div className="text-center">
            <div className="text-foreground/70 text-xs">Target Area</div>
            <div className="font-semibold">
              Honduras Bay
            </div>
          </div>
          <div className="text-center">
            <div className="text-foreground/70 text-xs">Filter Settings</div>
            <div className="font-semibold text-xs truncate">
              {selectedType === "all" ? "All Types" : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} • 
              {selectedSeverity.length === 3 ? "All Severities" : selectedSeverity.join(", ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStatsFooter;
