
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Detection, OceanHotspot, PollutionStatistics, SeaActivity } from '../types';
import { mockDetections, oceanHotspots, pollutionStatistics } from '../data/mockData';

// Mock sea activities data
const mockSeaActivities: SeaActivity[] = [
  {
    id: "1",
    name: "Pacific Cleanup Initiative",
    type: "cleanup",
    status: "ongoing",
    date: "2025-04-10",
    location: "North Pacific",
    description: "Large-scale cleanup operation targeting plastic waste in the North Pacific Gyre.",
    coordinates: {
      lat: 35.0,
      lng: -150.0
    },
    emoji: "🧹"
  },
  {
    id: "2",
    name: "Coral Reef Conservation",
    type: "conservation",
    status: "ongoing",
    date: "2025-03-15",
    location: "Great Barrier Reef",
    description: "Conservation efforts to protect and restore damaged coral reef ecosystems.",
    coordinates: {
      lat: -18.2871,
      lng: 147.6992
    },
    emoji: "🪸"
  },
  {
    id: "3",
    name: "Deep Sea Monitoring",
    type: "monitoring",
    status: "planned",
    date: "2025-05-20",
    location: "Mariana Trench",
    description: "Deployment of sensors to monitor pollution levels and marine life in deep sea environments.",
    coordinates: {
      lat: 11.3493,
      lng: 142.1996
    },
    emoji: "📊"
  },
  {
    id: "4",
    name: "Mediterranean Research Expedition",
    type: "research",
    status: "completed",
    date: "2025-02-08",
    location: "Mediterranean Sea",
    description: "Research mission studying the effects of microplastics on marine ecosystems.",
    coordinates: {
      lat: 35.5,
      lng: 18.0
    },
    emoji: "🔬"
  }
];

interface PollutionContextType {
  detections: Detection[];
  statistics: PollutionStatistics;
  hotspots: OceanHotspot[];
  activities: SeaActivity[];
  isRealTimeUpdates: boolean;
  updateInterval: number;
  alerts: { message: string; details: string }[];
  toggleRealTimeUpdates: () => void;
  setUpdateInterval: (interval: number) => void;
  manualUpdate: () => void;
  dismissAlert: (index: number) => void;
  addActivity: (activity: Omit<SeaActivity, 'id'>) => void;
}

const PollutionContext = createContext<PollutionContextType | undefined>(undefined);

export const usePollution = () => {
  const context = useContext(PollutionContext);
  if (!context) {
    throw new Error('usePollution must be used within a PollutionProvider');
  }
  return context;
};

interface PollutionProviderProps {
  children: ReactNode;
}

export const PollutionProvider = ({ children }: PollutionProviderProps) => {
  const [detections, setDetections] = useState<Detection[]>(mockDetections);
  const [statistics, setStatistics] = useState<PollutionStatistics>(pollutionStatistics);
  const [activities, setActivities] = useState<SeaActivity[]>(mockSeaActivities);
  const [isRealTimeUpdates, setIsRealTimeUpdates] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(10); // seconds
  const [alerts, setAlerts] = useState<{ message: string; details: string }[]>([
    { message: "Alert: 1 high-level pollution detected!", details: "Large debris cluster" }
  ]);

  const toggleRealTimeUpdates = () => {
    setIsRealTimeUpdates(!isRealTimeUpdates);
  };

  const addActivity = (activity: Omit<SeaActivity, 'id'>) => {
    const newActivity: SeaActivity = {
      ...activity,
      id: (activities.length + 1).toString()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const manualUpdate = () => {
    // In a real application, this would fetch new data
    console.log('Manual update triggered');
    
    // For demo purposes, we'll simulate getting a new detection occasionally
    const shouldAddNewDetection = Math.random() > 0.7;
    
    if (shouldAddNewDetection) {
      const newId = (detections.length + 1).toString();
      const pollutionTypes = ["Industrial waste", "Mixed pollution detected", "Fishing nets and equipment", "Plastic debris", "Chemical spill", "Microplastics", "Oil slick", "Large debris cluster"];
      const randomType = pollutionTypes[Math.floor(Math.random() * pollutionTypes.length)];
      const levels: ("high" | "medium" | "low")[] = ["high", "medium", "low"];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      
      // Random location within reasonable ocean coordinates
      const lat = (Math.random() * 140) - 70; // -70 to 70
      const lng = (Math.random() * 360) - 180; // -180 to 180
      
      const newDetection: Detection = {
        id: newId,
        type: randomType,
        level: randomLevel,
        timestamp: new Date().toLocaleString(),
        location: {
          lat,
          lng
        }
      };
      
      setDetections(prev => [newDetection, ...prev]);
      
      // Update statistics
      setStatistics(prev => {
        const newStats = { ...prev };
        newStats.totalDetections += 1;
        newStats.recentDetections += 1;
        
        if (randomLevel === "high") newStats.highCount += 1;
        if (randomLevel === "medium") newStats.mediumCount += 1;
        if (randomLevel === "low") newStats.lowCount += 1;
        
        return newStats;
      });
      
      // Add alert for high-level pollution
      if (randomLevel === "high") {
        setAlerts(prev => [...prev, { 
          message: `Alert: 1 high-level pollution detected!`, 
          details: randomType 
        }]);
      }
    }
  };

  const dismissAlert = (index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRealTimeUpdates) {
      interval = setInterval(manualUpdate, updateInterval * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTimeUpdates, updateInterval]);

  const value = {
    detections,
    statistics,
    hotspots: oceanHotspots,
    activities,
    isRealTimeUpdates,
    updateInterval,
    alerts,
    toggleRealTimeUpdates,
    setUpdateInterval,
    manualUpdate,
    dismissAlert,
    addActivity
  };

  return (
    <PollutionContext.Provider value={value}>
      {children}
    </PollutionContext.Provider>
  );
};
