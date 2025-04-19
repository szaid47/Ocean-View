
import React from 'react';
import { usePollution } from '../contexts/PollutionContext';
import { Anchor, Thermometer } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

const PollutionStatisticsCard = () => {
  const { statistics } = usePollution();

  const highPercentage = Math.round(
    (statistics.highCount / statistics.totalDetections) * 100
  ) || 0;
  const mediumPercentage = Math.round(
    (statistics.mediumCount / statistics.totalDetections) * 100
  ) || 0;
  const lowPercentage = Math.round(
    (statistics.lowCount / statistics.totalDetections) * 100
  ) || 0;

  return (
    <Card className="bg-sea-blue/60 backdrop-blur-sm text-white border-none h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Pollution Statistics</CardTitle>
        <p className="text-xs text-gray-300">Current detection summary</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Detections</span>
              <span className="font-bold">{statistics.totalDetections}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Recent (1h)</span>
              <span className="font-bold">{statistics.recentDetections}</span>
            </div>
          </div>

          <div className="flex text-sm gap-6">
            <div className="flex items-center gap-1">
              <Anchor className="text-blue-400" size={16} />
              <span>Avg Depth: </span>
              <span className="font-bold">{statistics.avgDepth}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="text-red-400" size={16} />
              <span>Avg Temp: </span>
              <span className="font-bold">{statistics.avgTemp}°C</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-pollution-high mr-2"></div>
                <span className="text-sm">High</span>
              </div>
              <span className="text-sm">
                {statistics.highCount} ({highPercentage}%)
              </span>
            </div>
            <Progress value={highPercentage} className="h-2 bg-gray-700" indicatorColor="bg-pollution-high" />
            
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-pollution-medium mr-2"></div>
                <span className="text-sm">Medium</span>
              </div>
              <span className="text-sm">
                {statistics.mediumCount} ({mediumPercentage}%)
              </span>
            </div>
            <Progress value={mediumPercentage} className="h-2 bg-gray-700" indicatorColor="bg-pollution-medium" />
            
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-pollution-low mr-2"></div>
                <span className="text-sm">Low</span>
              </div>
              <span className="text-sm">
                {statistics.lowCount} ({lowPercentage}%)
              </span>
            </div>
            <Progress value={lowPercentage} className="h-2 bg-gray-700" indicatorColor="bg-pollution-low" />
          </div>
          
          <div className="pt-2">
            <h3 className="flex items-center gap-2 text-sm mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Ocean Hotspots
            </h3>
            <OceanHotspotsList />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OceanHotspotsList = () => {
  const { hotspots } = usePollution();

  return (
    <div className="space-y-2">
      {hotspots.map(hotspot => (
        <div 
          key={hotspot.id} 
          className={cn(
            "flex items-center border rounded-md p-2",
            hotspot.level === 'high' ? "border-pollution-high" : 
            hotspot.level === 'medium' ? "border-pollution-medium" : 
            "border-pollution-low"
          )}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 12h-6.5a2 2 0 1 0 0 4h3a2 2 0 1 1 0 4H8"></path>
            <path d="M12 6v2"></path>
            <path d="M12 16v2"></path>
          </svg>
          <span className="flex-1 text-sm">{hotspot.name}</span>
          <span 
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              hotspot.level === 'high' ? "text-pollution-high" : 
              hotspot.level === 'medium' ? "text-pollution-medium" : 
              "text-pollution-low"
            )}
          >
            {hotspot.level}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PollutionStatisticsCard;
