
// Initial waste data with focus on the provided coordinates
export const initialWasteData = [
  { id: 1, type: 'plastic', severity: 'high', lat: 15.975562, lng: -87.623357, size: 25, timestamp: Date.now() },
  { id: 2, type: 'plastic', severity: 'high', lat: 15.975562, lng: -87.621791, size: 30, timestamp: Date.now() },
  { id: 3, type: 'industrial', severity: 'medium', lat: 15.974811, lng: -87.621791, size: 15, timestamp: Date.now() },
  { id: 4, type: 'oil', severity: 'low', lat: 15.974811, lng: -87.623357, size: 10, timestamp: Date.now() },
  
  { id: 5, type: 'plastic', severity: 'high', lat: 15.975000, lng: -87.622500, size: 28, timestamp: Date.now() },
  { id: 6, type: 'industrial', severity: 'medium', lat: 15.975300, lng: -87.622000, size: 18, timestamp: Date.now() },
  { id: 7, type: 'chemical', severity: 'high', lat: 15.974900, lng: -87.622800, size: 22, timestamp: Date.now() },
  { id: 8, type: 'plastic', severity: 'medium', lat: 15.975100, lng: -87.623100, size: 16, timestamp: Date.now() },
  { id: 9, type: 'oil', severity: 'high', lat: 15.974700, lng: -87.622200, size: 24, timestamp: Date.now() },
  { id: 10, type: 'plastic', severity: 'high', lat: 15.975800, lng: -87.622600, size: 27, timestamp: Date.now() },
  
  { id: 11, type: 'industrial', severity: 'medium', lat: 35.0, lng: -70.0, size: 15, timestamp: Date.now() },
  { id: 12, type: 'oil', severity: 'low', lat: 15.0, lng: -90.0, size: 5, timestamp: Date.now() },
  { id: 13, type: 'chemical', severity: 'medium', lat: -10.0, lng: 10.0, size: 18, timestamp: Date.now() }
];

// Target area boundary from provided coordinates
export const targetBoundary = [
  [-87.623357, 15.975562],
  [-87.621791, 15.975562],
  [-87.621791, 15.974811],
  [-87.623357, 15.974811],
  [-87.623357, 15.975562]
];

// Filter data based on filters
export const filterWasteData = (
  wasteData: typeof initialWasteData,
  selectedType: string,
  selectedTimePeriod: string,
  selectedSeverity: string[]
) => {
  let timeThreshold: number;
  const now = Date.now();

  // Determine time threshold based on selected period
  switch (selectedTimePeriod) {
    case "24h":
      timeThreshold = now - 1000 * 60 * 60 * 24;
      break;
    case "7d":
      timeThreshold = now - 1000 * 60 * 60 * 24 * 7;
      break;
    case "30d":
      timeThreshold = now - 1000 * 60 * 60 * 24 * 30;
      break;
    case "90d":
      timeThreshold = now - 1000 * 60 * 60 * 24 * 90;
      break;
    default:
      timeThreshold = 0;
  }

  // Filter waste data based on selections
  return wasteData.filter(item => {
    const typeMatch = selectedType === "all" || item.type === selectedType;
    const severityMatch = selectedSeverity.includes(item.severity);
    const timeMatch = item.timestamp >= timeThreshold;
    return typeMatch && severityMatch && timeMatch;
  });
};

// Helper function to find closest data point
export const findClosestDataPoint = (lng: number, lat: number, data: typeof initialWasteData) => {
  if (data.length === 0) {
    // Default fallback if no data
    return { severity: 'medium', size: 15, type: 'plastic' };
  }
  
  let minDistance = Infinity;
  let closestPoint = data[0];
  
  data.forEach(point => {
    const distance = Math.sqrt(
      Math.pow(lng - point.lng, 2) + 
      Math.pow(lat - point.lat, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  });
  
  return closestPoint;
};

// Generate grid points in boundary
export const generateGridPointsInBoundary = (
  boundary: number[][],
  spacing: number,
  baseData: typeof initialWasteData
) => {
  if (boundary.length < 4) return [];
  
  // Calculate bounding box
  const lngs = boundary.map(coord => coord[0]);
  const lats = boundary.map(coord => coord[1]);
  
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  
  const gridPoints: any[] = [];
  
  // Create a grid of points within the bounding box
  for (let lng = minLng; lng <= maxLng; lng += spacing) {
    for (let lat = minLat; lat <= maxLat; lat += spacing) {
      // Check if point is inside the polygon (simple test for rectangle)
      if (lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat) {
        // Get closest real data point to inherit properties
        const closestDataPoint = findClosestDataPoint(lng, lat, baseData);
        
        gridPoints.push({
          type: 'Feature',
          properties: {
            intensity: closestDataPoint.severity === 'high' ? 0.9 : 
                       closestDataPoint.severity === 'medium' ? 0.5 : 0.2,
            size: closestDataPoint.size * 0.8, // Slightly less intense than real points
            type: closestDataPoint.type
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        });
      }
    }
  }
  
  return gridPoints;
};
