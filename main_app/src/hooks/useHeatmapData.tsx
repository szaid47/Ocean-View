
import { useState, useEffect, useRef } from "react";
import { loadGeoJsonFiles } from "@/utils/geojsonLoader";
import { toast } from "@/components/ui/use-toast";

export const useHeatmapData = (selectedTypes: string[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);
  const loadingRef = useRef(false);
  const previousTypesRef = useRef<string[]>([]);
  const initialLoadDoneRef = useRef(false);
  
  useEffect(() => {
    // Skip if already loading
    if (loadingRef.current) return;
    
    // Skip if the selectedTypes array is the same as before
    const typesString = selectedTypes.sort().join(',');
    const prevTypesString = previousTypesRef.current.sort().join(',');
    if (typesString === prevTypesString && heatmapData.length > 0) return;
    
    previousTypesRef.current = [...selectedTypes];
    loadingRef.current = true;
    
    // Use a faster loading approach for the initial load
    const loadHeatmapData = async () => {
      setIsLoading(true);
      
      try {
        // Using optimized loader with early-return capability
        const data = await loadGeoJsonFiles(selectedTypes);
        
        // If we got data from the cache, update the UI immediately
        if (data.length > 0) {
          setHeatmapData(data);
          setIsLoading(false);
          
          // Only show toast for significant changes after initial load
          if (initialLoadDoneRef.current) {
            const sizeDifference = Math.abs(data.length - heatmapData.length);
            if (sizeDifference > 100) {
              toast({
                title: "Map Updated",
                description: `Loaded ${data.length} waste data points. Zoom in to explore.`,
              });
            }
          } else {
            initialLoadDoneRef.current = true;
          }
        } else if (selectedTypes.length > 0) {
          toast({
            title: "No Data Found",
            description: "No waste data found for the selected filters",
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in useHeatmapData:", error);
        setIsLoading(false);
      } finally {
        loadingRef.current = false;
      }
    };
    
    // Immediate loading for better performance
    loadHeatmapData();
  }, [selectedTypes, heatmapData.length]);

  return { isLoading, heatmapData };
};
