import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapIcon, Layers, Filter as FilterIcon, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom components and hooks - lazy load non-critical components
import HeatmapLayer from "@/components/map/HeatmapLayer";
import FilterSidebar from "@/components/map/FilterSidebar";
import { useHeatmapData } from "@/hooks/useHeatmapData";
import MapHeader from "@/components/map/MapHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TimeOfDayControl from "@/components/map/TimeOfDayControl";
import CompassRose from "@/components/map/CompassRose";
import MapScreenshot from "@/components/map/MapScreenshot";
import TerrainControl from "@/components/map/TerrainControl";
import FullscreenControl from "@/components/map/FullscreenControl";
import WaterQualityIndicator from "@/components/map/WaterQualityIndicator";
import PollutionIntensityLegend from "@/components/map/PollutionIntensityLegend";

// Lazy load MapLoading component
const MapLoading = lazy(() => import("@/components/map/MapLoading"));

// Waste types with icons and colors
const wasteTypes = [
  { id: "plastic_waste", label: "Plastic Waste", color: "#3B82F6" },
  { id: "ocean_waste", label: "Ocean Waste", color: "#10B981" },
  { id: "plastic_debris", label: "Plastic Debris", color: "#F59E0B" },
  { id: "fishing_gear", label: "Fishing Gear", color: "#EC4899" },
  { id: "industrial_waste", label: "Industrial Waste", color: "#8B5CF6" },
  { id: "sewage_waste", label: "Sewage Waste", color: "#EF4444" }
];

// Map Animation Component - moved to separate component for better performance
const MapAnimation = () => {
  const map = useMap();
  
  useEffect(() => {
    // Add a smooth zoom animation when map loads - reduce timing for faster initial display
    setTimeout(() => {
      map.flyTo([20, -80], 4, {
        animate: true,
        duration: 1.5 // Reduced from 2 seconds for faster animation
      });
    }, 500); // Reduced from 1000ms for faster startup
  }, [map]);
  
  return null;
};

// Main Map Component
const Map = () => {
  // State for filter management
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const mapRef = useRef(null);
  
  // Custom hook for heatmap data loading
  const { isLoading, heatmapData } = useHeatmapData(selectedTypes);

  // Handle waste type toggle
  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Set initialLoadComplete to true after first render
  useEffect(() => {
    if (!initialLoadComplete && !isLoading) {
      setInitialLoadComplete(true);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="h-16"></div> {/* Spacer to prevent navbar overlap */}
      <MapHeader />
      
      <div className="flex-1 relative mt-2">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-10"
        >
          <MapContainer 
            center={[15.96, -87.62]} 
            zoom={3} 
            style={{ height: "100%", width: "100%" }}
            preferCanvas={true}
            zoomControl={false}
            className="z-10"
            attributionControl={false}
            worldCopyJump={true} // For better performance when crossing date line
          >
            {/* Satellite Tile Layer - with optimized loading */}
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              maxZoom={19}
              tileSize={256}
              keepBuffer={2} // Reduced for better performance
              updateWhenZooming={false} // Improves performance during zoom
              updateWhenIdle={true} // Only update when map is idle
            />
            
            {/* Add a second layer for better visuals */}
            <TileLayer
              url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.png"
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>'
              opacity={0.35}
              tileSize={256}
              keepBuffer={2}
              updateWhenZooming={false}
              updateWhenIdle={true}
            />
            
            {/* Zoom control in a better position */}
            <ZoomControl position="bottomright" />
            
            {/* Map animation component */}
            <MapAnimation />
            
            {/* Heatmap Layer - display only when visible and data is available */}
            {heatmapVisible && heatmapData.length > 0 && (
              <HeatmapLayer heatmapData={heatmapData} />
            )}

            {/* Map features */}
            <TimeOfDayControl />
            <CompassRose />
            <MapScreenshot />
            
            {/* Updated features */}
            <TerrainControl />
            <FullscreenControl />
            <WaterQualityIndicator />
            <PollutionIntensityLegend />

            {/* Attribution in better position */}
            <div className="leaflet-control leaflet-control-attribution absolute bottom-0 right-0 z-[400] text-xs bg-black/30 text-white/70 px-2 py-1 rounded-tl">
              © <a href="https://www.esri.com/" className="text-white/80 hover:text-white">Esri</a> | 
              <a href="http://stamen.com" className="text-white/80 hover:text-white"> Stamen Design</a>
            </div>
          </MapContainer>
        </motion.div>

        {/* Loading overlay - using Suspense for better performance */}
        <Suspense fallback={null}>
          {isLoading && <MapLoading loading={isLoading} />}
        </Suspense>

        {/* Controls overlay - moved slightly down to avoid navbar overlap */}
        <div className="absolute top-6 right-[110px] z-30 flex flex-col gap-2">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              variant="secondary" 
              size="icon" 
              className={cn("shadow-lg", heatmapVisible && "bg-ocean/20 border-ocean/50")}
              onClick={() => setHeatmapVisible(!heatmapVisible)}
            >
              <Layers className="w-5 h-5" />
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              variant="secondary" 
              size="icon" 
              className={cn("shadow-lg", showFilter && "bg-ocean/20 border-ocean/50")}
              onClick={() => setShowFilter(!showFilter)}
            >
              <FilterIcon className="w-5 h-5" />
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              variant="secondary" 
              size="icon" 
              className={cn("shadow-lg", showInfo && "bg-ocean/20 border-ocean/50")}
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Info panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 right-4 z-30 max-w-sm bg-card/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10"
            >
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-ocean" />
                About Marine Waste Map
              </h3>
              <p className="text-sm text-foreground/80">
                This interactive map displays real-time data of detected marine waste and pollution hotspots across the world's oceans. 
                Toggle the filters to visualize different types of waste.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {wasteTypes.map(type => (
                  <div key={type.id} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="text-xs">{type.label}</span>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-3 text-xs" 
                variant="outline" 
                size="sm"
                onClick={() => setShowInfo(false)}
              >
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: initialLoadComplete ? 1 : 0, y: initialLoadComplete ? 0 : 20 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute bottom-0 left-0 right-0 z-20 bg-card/50 backdrop-blur-md border-t border-white/10 py-2"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Active tracking: {heatmapData.length} points</span>
              </div>
              <div>
                Selected filters: {selectedTypes.length === 0 ? "All waste types" : selectedTypes.map(t => t.replace("_", " ")).join(", ")}
              </div>
              <div className="text-ocean">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Sidebar Component */}
      <FilterSidebar 
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        selectedTypes={selectedTypes}
        handleToggleType={handleToggleType}
        wasteTypes={wasteTypes.map(wt => wt.id)}
        setSelectedTypes={setSelectedTypes}
      />
    </div>
  );
};

export default Map;
