
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from "@/components/ui/use-toast";
import { initialWasteData, targetBoundary, filterWasteData } from '../utils/mapData';
import { addTargetBoundary, addHeatmapLayer, renderMarkers, flyToCoordinates } from '../utils/mapUtils';

export const useMapSetup = () => {
  const [loading, setLoading] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const rotationRequestId = useRef<number | null>(null);
  
  // Setup map with the token provided
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Set the Mapbox token (using the provided token)
    mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbWFsaTA3ODYiLCJhIjoiY20yYWRiZWw0MGQxZDJvczd6bzc4aDUzMiJ9.FUTLwMNaICKfoct8yJqVQQ";
    
    try {
      // Initialize map with improved stability settings and focused on specified coordinates
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 14, // Higher zoom to focus on target area
        center: [-87.6225, 15.9752], // Center between the coordinates
        pitch: 45,
        minZoom: 0.5,
        maxZoom: 18,
        renderWorldCopies: true,
        attributionControl: false,
        preserveDrawingBuffer: true,
        antialias: true,
        trackResize: true,
        fadeDuration: 0
      });

      // Add navigation controls
      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
      });
      map.current.addControl(nav, 'top-right');
      
      // Add attribution control in a subtle position
      map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-left');

      // Add scale
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

      // Set up map load event with improved error handling
      map.current.on('load', () => {
        try {
          if (!map.current) return;

          // Add atmosphere and fog effects for visual appeal
          map.current.setFog({
            color: 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
          });

          setLoading(false);
          
          // Notify user that the map has loaded
          toast({
            title: "Map loaded successfully",
            description: "Waste detection heatmap is now active in the specified coordinates",
          });
        } catch (err) {
          console.error('Error during map load:', err);
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Map error",
            description: "Failed to initialize map components",
          });
        }
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        toast({
          variant: "destructive",
          title: "Map error occurred",
          description: "The map encountered an error. Please refresh the page.",
        });
      });

      return () => {
        if (rotationRequestId.current) {
          cancelAnimationFrame(rotationRequestId.current);
          rotationRequestId.current = null;
        }
        
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Map initialization failed",
        description: "There was an error loading the map",
      });
    }
  }, []);

  return {
    mapContainer,
    map,
    markersRef,
    loading
  };
};

export const useMapLayers = (
  map: React.MutableRefObject<mapboxgl.Map | null>,
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>,
  loading: boolean,
  wasteData: any[],
  selectedType: string,
  selectedTimePeriod: string,
  selectedSeverity: string[],
  heatmapVisible: boolean
) => {
  // Update map when filters change
  useEffect(() => {
    if (!map.current || loading || !map.current.loaded()) return;
    
    // Update heatmap and markers with filtered data
    addTargetBoundary(map.current);
    addHeatmapLayer(map.current, wasteData, selectedType, selectedTimePeriod, selectedSeverity, heatmapVisible);
    markersRef.current = renderMarkers(
      map.current, 
      markersRef.current, 
      wasteData, 
      selectedType, 
      selectedTimePeriod, 
      selectedSeverity
    );
    
  }, [selectedType, selectedTimePeriod, selectedSeverity, heatmapVisible, loading, wasteData, map, markersRef]);
};
