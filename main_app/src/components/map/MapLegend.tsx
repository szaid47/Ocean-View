
import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 glass-container rounded-xl p-4 animate-fade-in">
      <h3 className="font-semibold text-sm mb-3">Waste Detection Legend</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-rose-500 mr-2"></span>
          <span>Critical (25+ tons)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
          <span>Moderate (10-25 tons)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
          <span>Low (0-10 tons)</span>
        </div>
        <div className="mt-3 pt-2 border-t border-white/10">
          <div className="flex items-center">
            <div className="w-12 h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded mr-2"></div>
            <span>Heatmap Intensity</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-white/10">
          <div className="flex items-center">
            <div className="h-3 w-8 border border-[#0FA0CE] border-dashed mr-2"></div>
            <span>Target Boundary</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
