
import React from 'react';

const PollutionLegend = () => {
  return (
    <div className="bg-sea-blue/60 backdrop-blur-sm rounded-md p-2 flex items-center gap-4 text-white text-sm">
      <div className="font-medium">Pollution Level:</div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-pollution-high"></div>
        <span>High</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-pollution-medium"></div>
        <span>Medium</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-pollution-low"></div>
        <span>Low</span>
      </div>
    </div>
  );
};

export default PollutionLegend;
