
import React from 'react';
import { usePollution } from '../contexts/PollutionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const RecentDetectionsCard = () => {
  const { detections } = usePollution();

  // Show only the 4 most recent detections
  const recentDetections = detections.slice(0, 4);

  return (
    <Card className="bg-sea-blue/60 backdrop-blur-sm text-white border-none h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Detections</CardTitle>
        <p className="text-xs text-gray-300">Latest pollution discoveries</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDetections.map((detection) => (
            <div
              key={detection.id}
              className="bg-gray-800/50 rounded-md p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center",
                    detection.level === 'high' ? "bg-pollution-high" : 
                    detection.level === 'medium' ? "bg-pollution-medium" : 
                    "bg-pollution-low"
                  )}
                >
                </div>
                <h3 className="text-sm font-medium">{detection.type}</h3>
                <span 
                  className={cn(
                    "text-xs ml-auto px-2 py-0.5 rounded-full",
                    detection.level === 'high' ? "bg-pollution-high/20 text-pollution-high" : 
                    detection.level === 'medium' ? "bg-pollution-medium/20 text-pollution-medium" : 
                    "bg-pollution-low/20 text-pollution-low"
                  )}
                >
                  {detection.level}
                </span>
              </div>
              <p className="text-xs text-gray-400">{detection.timestamp}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDetectionsCard;
