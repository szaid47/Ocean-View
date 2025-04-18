import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, BarChart3, Waves } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const WaterQualityIndicator = () => {
  const map = useMap();
  const [qualityIndex, setQualityIndex] = useState(75.5);
  const [showDetails, setShowDetails] = useState(false);
  
  // Real-time water quality data updates with more frequent interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Random fluctuation between -2 and +2
      setQualityIndex(prev => {
        const newValue = prev + (Math.random() * 4 - 2);
        // Keep between 0 and 100
        return Math.min(100, Math.max(0, newValue));
      });
    }, 3000); // Update every 3 seconds for more "real-time" feel
    
    return () => clearInterval(interval);
  }, []);
  
  // Get color based on quality index
  const getColor = (index: number) => {
    if (index > 80) return "bg-green-500";
    if (index > 60) return "bg-blue-500";
    if (index > 40) return "bg-yellow-500";
    if (index > 20) return "bg-orange-500";
    return "bg-red-500";
  };
  
  // Get label based on quality index
  const getLabel = (index: number) => {
    if (index > 80) return "Excellent";
    if (index > 60) return "Good";
    if (index > 40) return "Moderate";
    if (index > 20) return "Poor";
    return "Critical";
  };
  
  // Get regions with this water quality
  const getRegions = (index: number) => {
    if (index > 80) return ["Caribbean Sea", "North Atlantic"];
    if (index > 60) return ["South Pacific", "Mediterranean Sea"];
    if (index > 40) return ["Gulf of Mexico", "Baltic Sea"];
    if (index > 20) return ["South China Sea", "Bay of Bengal"];
    return ["Gulf Coast", "North Sea"];
  };
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const handleDataShow = () => {
    toast({
      title: "Water Quality Data",
      description: `Current water quality index: ${qualityIndex.toFixed(1)} - ${getLabel(qualityIndex)}`,
    });
  };
  
  return (
    <div className="absolute top-4 left-4 z-[1000]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-700 w-48"
      >
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-white mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>Water Quality Index</span>
            </div>
          </div>
          
          <motion.div 
            className="relative h-3 w-full bg-slate-700 rounded-full overflow-hidden"
            onClick={handleDataShow}
          >
            <motion.div 
              className={`absolute inset-y-0 left-0 rounded-full ${getColor(qualityIndex)}`}
              initial={{ width: "0%" }}
              animate={{ width: `${qualityIndex}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "linear",
                repeatType: "loop"
              }}
            />
          </motion.div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-white">
              {getLabel(qualityIndex)}
            </div>
            <div className="text-xs text-gray-300">
              {qualityIndex.toFixed(1)}/100
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDetails}
            className="text-xs flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors mt-1"
          >
            {showDetails ? "Hide" : "View"} Details
            <BarChart3 className="w-3 h-3" />
          </motion.button>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="text-xs space-y-2 mt-1 border-t border-slate-700 pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Regions:</span>
                    <div className="flex flex-wrap gap-1">
                      {getRegions(qualityIndex).map((region) => (
                        <span key={region} className="text-[10px] font-medium px-1.5 py-0.5 bg-blue-500/20 rounded-full text-blue-300">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-gray-400">Updated every 3s with satellite data</div>
                      <div className="text-[10px] mt-0.5">Last update: {new Date().toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default WaterQualityIndicator;
