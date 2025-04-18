
import React from "react";
import { Globe, WavesIcon, Trash } from "lucide-react";
import { motion } from "framer-motion";

const MapHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border-b border-white/5 py-3 px-4 md:px-6 mt-16" // Added mt-16 to avoid navbar overlap
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-ocean/10 animate-pulse-subtle">
              <Globe className="w-5 h-5 text-ocean" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Global Marine Waste Map</h1>
              <p className="text-xs text-foreground/60">Worldwide tracking of ocean pollution</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center justify-center md:justify-end">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs text-foreground/70"
            >
              <WavesIcon className="w-3 h-3 text-ocean" />
              <span>Last updated: <span className="text-foreground">Just now</span></span>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs text-foreground/70"
            >
              <Trash className="w-3 h-3 text-rose-400" />
              <span>Waste types: <span className="text-foreground">Multiple categories tracked</span></span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MapHeader;
