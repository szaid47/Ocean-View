
import mapboxgl from 'mapbox-gl';
import { filterWasteData, initialWasteData } from './mapData';

// Render markers
export const renderMarkers = (
  map: mapboxgl.Map,
  markers: mapboxgl.Marker[],
  wasteData: typeof initialWasteData,
  selectedType: string,
  selectedTimePeriod: string,
  selectedSeverity: string[]
): mapboxgl.Marker[] => {
  if (!map || !map.loaded()) return markers;
  
  // Clear existing markers
  markers.forEach(marker => marker.remove());
  
  // Get filtered data
  const filteredData = filterWasteData(wasteData, selectedType, selectedTimePeriod, selectedSeverity);
  
  const newMarkers: mapboxgl.Marker[] = [];
  
  // Add new markers
  filteredData.forEach(point => {
    const el = document.createElement('div');
    el.className = 'waste-marker';
    el.innerHTML = `
      <div class="relative">
        <span class="absolute inset-0 rounded-full ${point.severity === 'high' ? 'bg-rose-500/50' : point.severity === 'medium' ? 'bg-amber-500/50' : 'bg-emerald-500/50'} animate-ping"></span>
        <span class="absolute inset-0 rounded-full ${point.severity === 'high' ? 'bg-rose-500' : point.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse-subtle"></span>
      </div>
    `;

    const marker = new mapboxgl.Marker(el)
      .setLngLat([point.lng, point.lat])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${point.type.charAt(0).toUpperCase() + point.type.slice(1)} Waste</h3>
            <p>Severity: ${point.severity}</p>
            <p>Size: ${point.size} tons</p>
            <p>Detected: ${new Date(point.timestamp).toLocaleString()}</p>
          </div>
        `))
      .addTo(map);
    
    newMarkers.push(marker);
  });
  
  return newMarkers;
};
