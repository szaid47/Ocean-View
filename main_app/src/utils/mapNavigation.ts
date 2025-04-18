
import mapboxgl from 'mapbox-gl';

// Fly to coordinates
export const flyToCoordinates = (map: mapboxgl.Map, boundary: number[][]) => {
  if (!map) return;
  
  // Calculate the center of the boundary
  const centerLng = (boundary[0][0] + boundary[2][0]) / 2;
  const centerLat = (boundary[0][1] + boundary[2][1]) / 2;
  
  map.flyTo({
    center: [centerLng, centerLat],
    zoom: 15, // Zoom in more to see the boundary clearly
    pitch: 50,
    bearing: 0,
    duration: 2000
  });
};
