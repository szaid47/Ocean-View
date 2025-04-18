
import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { Sun, Moon, Sunset } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const TimeOfDayControl = () => {
  const map = useMap();
  const [timeOfDay, setTimeOfDay] = useState<"day" | "dusk" | "night">("day");
  
  // Apply filter to map container based on time of day
  useEffect(() => {
    if (!map) return;
    
    const mapContainer = map.getContainer();
    
    // Reset filters
    mapContainer.style.filter = "";
    
    // Apply appropriate filter based on time of day
    switch (timeOfDay) {
      case "day":
        mapContainer.style.filter = "brightness(1) contrast(1) saturate(1.1)";
        break;
      case "dusk":
        mapContainer.style.filter = "brightness(0.85) contrast(1.1) saturate(0.9) sepia(0.2)";
        break;
      case "night":
        mapContainer.style.filter = "brightness(0.7) contrast(1.2) saturate(0.7) hue-rotate(15deg)";
        break;
    }
    
    // Show notification
    toast({
      title: `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} mode activated`,
      description: `Map display adjusted to simulate ${timeOfDay} lighting conditions`,
    });
    
  }, [timeOfDay, map]);
  
  const handleTimeChange = (newTime: "day" | "dusk" | "night") => {
    setTimeOfDay(newTime);
  };
  
  return (
    <div className="absolute top-80 right-9 z-[1000] bg-slate-900/90 backdrop-blur-md p-2 rounded-lg shadow-lg border border-slate-700">
      <div className="flex items-center gap-2">
        <div className="text-xs font-medium text-white mr-1">Time of Day</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleTimeChange("day")}
          className={`p-1.5 rounded-full ${timeOfDay === "day" ? "bg-blue-500/20 text-blue-300" : "hover:bg-slate-700"}`}
          title="Day mode"
        >
          <Sun className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleTimeChange("dusk")}
          className={`p-1.5 rounded-full ${timeOfDay === "dusk" ? "bg-orange-500/20 text-orange-300" : "hover:bg-slate-700"}`}
          title="Dusk mode"
        >
          <Sunset className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleTimeChange("night")}
          className={`p-1.5 rounded-full ${timeOfDay === "night" ? "bg-indigo-500/20 text-indigo-300" : "hover:bg-slate-700"}`}
          title="Night mode"
        >
          <Moon className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default TimeOfDayControl;
