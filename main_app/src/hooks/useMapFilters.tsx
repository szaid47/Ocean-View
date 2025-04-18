
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { initialWasteData, filterWasteData } from '../utils/mapData';
import mapboxgl from 'mapbox-gl';

export const useMapFilters = (map: React.MutableRefObject<mapboxgl.Map | null>) => {
  // State for filters
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("24h");
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>(["low", "medium", "high"]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(true);
  
  // State for waste data
  const [wasteData] = useState(initialWasteData);

  // Get filtered data based on user selections
  const getFilteredData = () => {
    return filterWasteData(wasteData, selectedType, selectedTimePeriod, selectedSeverity);
  };

  // Toggle heatmap visibility
  const toggleHeatmap = () => {
    if (!map.current) return;
    setHeatmapVisible(!heatmapVisible);
  };

  // Apply all filters
  const applyFilters = () => {
    if (!map.current) return;
    
    // Close filter panel
    setIsFilterOpen(false);
    
    // Notify user
    toast({
      title: "Filters Applied",
      description: "Map view has been updated based on your filters",
    });
  };

  // Toggle severity filter
  const toggleSeverity = (severity: string) => {
    if (selectedSeverity.includes(severity)) {
      // Remove severity if it's already selected (but don't allow empty array)
      if (selectedSeverity.length > 1) {
        setSelectedSeverity(prev => prev.filter(s => s !== severity));
      }
    } else {
      // Add severity if not already selected
      setSelectedSeverity(prev => [...prev, severity]);
    }
  };

  return {
    selectedType,
    setSelectedType,
    selectedTimePeriod,
    setSelectedTimePeriod,
    selectedSeverity,
    isFilterOpen,
    setIsFilterOpen,
    heatmapVisible,
    wasteData,
    getFilteredData,
    toggleHeatmap,
    applyFilters,
    toggleSeverity
  };
};
