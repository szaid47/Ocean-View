
import { useEffect, useState, useRef, useMemo } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet.heat";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface HeatmapLayerProps {
  heatmapData: [number, number, number][];
}

const HeatmapLayer = ({ heatmapData }: HeatmapLayerProps) => {
  const map = useMap();
  const [isReady, setIsReady] = useState(false);
  const heatLayerRef = useRef<any>(null);
  const pointMarkersRef = useRef<L.Marker[]>([]);
  const markersAddedRef = useRef(false);
  const samplingRateRef = useRef(1);
  
  // More aggressive downsampling for better performance
  const memoizedData = useMemo(() => {
    // If we have too many points, use very aggressive downsampling
    let downsampledData = heatmapData;
    
    if (heatmapData.length > 10000) {
      samplingRateRef.current = Math.ceil(heatmapData.length / 5000);
      downsampledData = heatmapData.filter((_, i) => i % samplingRateRef.current === 0);
      console.log(`Aggressive downsampling: ${heatmapData.length} points → ${downsampledData.length} points (1/${samplingRateRef.current})`);
    } else if (heatmapData.length > 5000) {
      samplingRateRef.current = Math.ceil(heatmapData.length / 3000);
      downsampledData = heatmapData.filter((_, i) => i % samplingRateRef.current === 0);
      console.log(`Medium downsampling: ${heatmapData.length} points → ${downsampledData.length} points (1/${samplingRateRef.current})`);
    }
    
    return downsampledData;
  }, [heatmapData]);

  useEffect(() => {
    if (!map || memoizedData.length === 0) return;

    // Debug log heatmap data
    console.log(`Creating heatmap with ${memoizedData.length} points`);
    
    // Set ready to false for loading indicator, but only if the layer was previously displayed
    if (heatLayerRef.current) {
      setIsReady(false);
    }
    
    // Clear existing heatmap layer if it exists
    if (heatLayerRef.current && map.hasLayer(heatLayerRef.current)) {
      map.removeLayer(heatLayerRef.current);
    }
    
    // Use a more efficient approach for creating the heat layer
    const renderHeatmap = () => {
      try {
        // @ts-ignore - leaflet.heat types are not properly recognized
        heatLayerRef.current = L.heatLayer(memoizedData, {
          radius: 12,           // Reduced radius for better performance
          blur: 15,             // Reduced blur for better performance
          maxZoom: 10,          // Optimized maxZoom
          max: 1.0,             // Ensures proper scaling of intensity
          minOpacity: 0.3,      // Better visibility at low intensities
          gradient: {           // Enhanced color gradient for better visualization
            0.1: "#0000FF",     // Blue (Very Low)
            0.3: "#00FF00",     // Green (Low)
            0.5: "#FFFF00",     // Yellow (Medium)
            0.7: "#FFA500",     // Orange (High)
            1.0: "#FF0000",     // Red (Very High)
          },
        }).addTo(map);
        
        // Add click functionality at higher zoom levels
        const handleZoomEnd = () => {
          const currentZoom = map.getZoom();
          
          // Only add markers when zoomed in and not already added
          if (currentZoom >= 8 && !markersAddedRef.current) {
            addClickablePoints();
            markersAddedRef.current = true;
          } else if (currentZoom < 8 && markersAddedRef.current) {
            // Remove markers when zoomed out
            removeClickablePoints();
            markersAddedRef.current = false;
          }
        };
        
        // Add event listener for zoom
        map.on('zoomend', handleZoomEnd);
        
        // Initial check for the zoom level
        handleZoomEnd();
        
        // Set ready to true immediately for better UX
        setIsReady(true);
        
        return () => {
          if (heatLayerRef.current && map) {
            map.removeLayer(heatLayerRef.current);
          }
          
          removeClickablePoints();
          map.off('zoomend', handleZoomEnd);
        };
      } catch (error) {
        console.error("Error creating heatmap:", error);
        setIsReady(true); // Set ready even if there's an error
        toast({
          title: "Heatmap Error",
          description: "There was a problem creating the heatmap",
          variant: "destructive"
        });
      }
    };
    
    // Use requestAnimationFrame for smoother rendering
    requestAnimationFrame(renderHeatmap);
  }, [map, memoizedData]);

  // Add clickable points with better performance
  const addClickablePoints = () => {
    // Clear existing markers first
    removeClickablePoints();
    
    // Get current zoom level to determine sampling
    const currentZoom = map.getZoom();
    const zoomSamplingRate = currentZoom >= 10 ? 1 : Math.max(2, samplingRateRef.current);
    
    // Create a subset of points based on zoom level
    const pointsToShow = memoizedData.filter((_, i) => i % zoomSamplingRate === 0);
    
    // Create a batch processing approach for better performance
    const batchSize = 100;
    const totalBatches = Math.ceil(pointsToShow.length / batchSize);
    
    // Process markers in batches
    const processBatch = (batchIndex: number) => {
      if (batchIndex >= totalBatches) return;
      
      const startIdx = batchIndex * batchSize;
      const endIdx = Math.min(startIdx + batchSize, pointsToShow.length);
      const batch = pointsToShow.slice(startIdx, endIdx);
      
      batch.forEach(point => {
        const [lat, lng, intensity] = point;
        
        // Create an invisible marker
        const marker = L.marker([lat, lng], {
          opacity: 0, // Completely transparent
          interactive: true
        });
        
        // Determine waste type based on location if available
        let wasteType = "Unknown";
        let intensityText = "Medium";
        
        // Set intensity text based on the value
        if (intensity <= 0.3) intensityText = "Low";
        else if (intensity >= 0.7) intensityText = "High";
        
        // Determine probable waste type based on the coordinates
        if (lng < -80) wasteType = "Plastic Waste";
        else if (lng > 100) wasteType = "Ocean Debris";
        else wasteType = "Local Litter";
        
        // Add popup with information
        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">Waste Details</h3>
            <ul class="mt-2">
              <li><strong>Type:</strong> ${wasteType}</li>
              <li><strong>Intensity:</strong> ${intensityText}</li>
              <li><strong>Coordinates:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}</li>
            </ul>
          </div>
        `, {
          className: 'rounded-md shadow-lg',
          maxWidth: 300
        });
        
        marker.addTo(map);
        pointMarkersRef.current.push(marker);
      });
      
      // Process next batch asynchronously for better UI responsiveness
      if (batchIndex < totalBatches - 1) {
        setTimeout(() => processBatch(batchIndex + 1), 0);
      }
    };
    
    // Start batch processing if we have points to show
    if (pointsToShow.length > 0) {
      processBatch(0);
    }
  };
  
  // Remove all clickable points
  const removeClickablePoints = () => {
    pointMarkersRef.current.forEach(marker => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    pointMarkersRef.current = [];
  };

  return (
    <>
      {!isReady && memoizedData.length > 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-ocean border-t-transparent rounded-full" />
              <p className="text-sm font-medium">Generating heatmap...</p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default HeatmapLayer;
