
import React from "react";
import { motion } from "framer-motion";

const PollutionIntensityLegend = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-16 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-700"
    >
      <h3 className="text-xs font-medium text-white mb-2">Pollution Intensity</h3>
      <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full" />
      <div className="flex justify-between mt-2 text-[10px] text-gray-300">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </motion.div>
  );
};

export default PollutionIntensityLegend;
