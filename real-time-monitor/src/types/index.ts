
// Import the Google Maps types
/// <reference types="@googlemaps/js-api-loader" />

export type PollutionLevel = 'high' | 'medium' | 'low';

export interface Detection {
  id: string;
  type: string;
  level: PollutionLevel;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface OceanHotspot {
  id: string;
  name: string;
  level: PollutionLevel;
}

export interface PollutionStatistics {
  totalDetections: number;
  recentDetections: number;
  avgDepth: number;
  avgTemp: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  level: PollutionLevel;
}

export type SeaActivityType = 
  | 'surfing'
  | 'parasailing' 
  | 'snorkeling' 
  | 'boating' 
  | 'dolphin_watching'
  | 'island_hopping'
  | 'fishing'
  | 'beach_event'
  | 'wellness'
  | 'harbor_cruise'
  | 'cleanup'       // Added for PollutionContext
  | 'conservation'  // Added for PollutionContext
  | 'monitoring'    // Added for PollutionContext
  | 'research';     // Added for PollutionContext

export interface SeaActivity {
  id: string;
  name: string;
  type: SeaActivityType;
  status: 'ongoing' | 'completed' | 'planned';
  date: string;
  location: string;
  description: string;
  pricing?: string;
  booking_url?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  emoji: string;
}
