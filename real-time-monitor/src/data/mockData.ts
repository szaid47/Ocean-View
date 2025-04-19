
import { Detection, OceanHotspot, PollutionStatistics } from "../types";

export const mockDetections: Detection[] = [
  {
    id: "1",
    type: "Industrial waste",
    level: "medium",
    timestamp: "4/13/2025, 11:09:10 AM",
    location: {
      lat: 15.870032,
      lng: -40.4567
    }
  },
  {
    id: "2",
    type: "Mixed pollution detected",
    level: "medium",
    timestamp: "4/13/2025, 11:09:10 AM",
    location: {
      lat: -25.7448,
      lng: 28.2336
    }
  },
  {
    id: "3",
    type: "Mixed pollution detected",
    level: "high",
    timestamp: "4/13/2025, 11:09:10 AM",
    location: {
      lat: 35.6762,
      lng: 139.6503
    }
  },
  {
    id: "4",
    type: "Fishing nets and equipment",
    level: "medium",
    timestamp: "4/13/2025, 11:09:10 AM",
    location: {
      lat: -33.8688,
      lng: 151.2093
    }
  },
  {
    id: "5",
    type: "Plastic debris",
    level: "medium",
    timestamp: "4/12/2025, 10:45:22 AM",
    location: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  {
    id: "6",
    type: "Chemical spill",
    level: "high",
    timestamp: "4/12/2025, 09:30:15 AM",
    location: {
      lat: 51.5074,
      lng: -0.1278
    }
  },
  {
    id: "7",
    type: "Microplastics",
    level: "medium",
    timestamp: "4/12/2025, 08:15:30 AM",
    location: {
      lat: -33.4489,
      lng: -70.6693
    }
  },
  {
    id: "8",
    type: "Oil slick",
    level: "medium",
    timestamp: "4/11/2025, 05:20:45 PM",
    location: {
      lat: 19.4326,
      lng: -99.1332
    }
  },
  {
    id: "9",
    type: "Large debris cluster",
    level: "high",
    timestamp: "4/11/2025, 03:10:05 PM",
    location: {
      lat: 37.7749,
      lng: -122.4194
    }
  }
];

export const oceanHotspots: OceanHotspot[] = [
  {
    id: "1",
    name: "Pacific Ocean",
    level: "high"
  },
  {
    id: "2",
    name: "Indian Ocean",
    level: "high"
  },
  {
    id: "3",
    name: "Atlantic Ocean",
    level: "medium"
  },
  {
    id: "4",
    name: "Mediterranean Sea",
    level: "medium"
  },
  {
    id: "5",
    name: "Caribbean Sea",
    level: "low"
  }
];

export const pollutionStatistics: PollutionStatistics = {
  totalDetections: 9,
  recentDetections: 9,
  avgDepth: 2633,
  avgTemp: 11.7,
  highCount: 2,
  mediumCount: 7,
  lowCount: 0
};
