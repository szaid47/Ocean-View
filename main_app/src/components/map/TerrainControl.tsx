
import React, { useState, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { Mountain, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import L from "leaflet";

const TerrainControl = () => {
  const map = useMap();
  const [showTerrain, setShowTerrain] = useState(false);
  const terrainLayerRef = useRef<L.TileLayer | null>(null);
  
  useEffect(() => {
    if (!map) return;
    
    // If terrain layer should be visible but isn't added yet
    if (showTerrain) {
      if (!terrainLayerRef.current) {
        // Add terrain layer
        const terrainUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}";
        const terrainAttribution = 'Terrain &copy; <a href="https://www.esri.com/">Esri</a>';
        
        terrainLayerRef.current = L.tileLayer(terrainUrl, {
          attribution: terrainAttribution,
          opacity: 0.6,
          maxZoom: 19,
          tileSize: 256
        }).addTo(map);
        
        toast({
          title: "Terrain view enabled",
          description: "Showing topographical features",
        });
      }
    } else {
      // Remove terrain layer if it exists
      if (terrainLayerRef.current) {
        map.removeLayer(terrainLayerRef.current);
        terrainLayerRef.current = null;
        
        toast({
          title: "Terrain view disabled",
          description: "Standard map view restored",
        });
      }
    }
  }, [showTerrain, map]);
  
  const toggleTerrain = () => {
    setShowTerrain(!showTerrain);
  };
  
  return (
    <div className="absolute bottom-[180px] left-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-2 rounded-lg shadow-lg border border-slate-700">
      <div className="flex items-center gap-2">
        <div className="text-xs font-medium text-white">Terrain View</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTerrain}
          className={`p-1.5 rounded-full flex items-center justify-center ${showTerrain ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-slate-700'}`}
          title={showTerrain ? "Disable terrain view" : "Enable terrain view"}
        >
          {showTerrain ? <Mountain className="w-5 h-5" /> : <Waves className="w-5 h-5" />}
        </motion.button>
      </div>
    </div>
  );
};

export default TerrainControl;
