
import React from 'react';
import { MapPin, Info } from 'lucide-react';

const MapInfoPanel: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4 glass-container rounded-xl p-4 max-w-sm animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-ocean/10 shrink-0">
          <MapPin className="w-5 h-5 text-ocean" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Target Area Heatmap</h3>
          <p className="text-xs text-foreground/70 mt-1">
            Focused on coordinates [-87.623357, 15.975562] to [-87.621791, 15.974811].
            Boundary highlighted with dashed line. Heatmap intensity increased in this area.
          </p>
          <div className="flex items-center text-xs text-foreground/50 mt-2">
            <Info className="w-3 h-3 mr-1" />
            <span>Click on markers for detailed waste information</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapInfoPanel;
