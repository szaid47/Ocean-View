
import React from "react";
import { useMap } from "react-leaflet";
import { motion } from "framer-motion";

const CompassRose = () => {
  const map = useMap();
  const [rotation, setRotation] = React.useState(0);
  
  // Update compass rose rotation when map bearing changes
  React.useEffect(() => {
    if (!map) return;
    
    const updateRotation = () => {
      // Get the current map container transform
      const container = map.getContainer();
      const transform = window.getComputedStyle(container).transform;
      
      // Extract rotation angle if present
      if (transform && transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        const a = parseFloat(values[0]); // Convert string to number with parseFloat
        const b = parseFloat(values[1]); // Convert string to number with parseFloat
        const angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
        setRotation(-angle); // Negative because we want to counter-rotate
      } else {
        setRotation(0);
      }
    };
    
    // Add event listener for map movement
    map.on('move', updateRotation);
    
    // Initial update
    updateRotation();
    
    // Cleanup
    return () => {
      map.off('move', updateRotation);
    };
  }, [map]);
  
  return (
    <div className="absolute top-36 left-4 z-[1000]">
      <motion.div 
        className="w-16 h-16 bg-card/70 backdrop-blur-md rounded-full shadow-lg border border-white/10 flex items-center justify-center"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: rotation }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Compass rose design */}
          <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
          <circle cx="24" cy="24" r="2" fill="#3B82F6" />
          
          {/* Cardinal directions */}
          <path d="M24 4L26 8H22L24 4Z" fill="#EF4444" /> {/* North - Red */}
          <path d="M44 24L40 26V22L44 24Z" fill="#FFFFFF" /> {/* East - White */}
          <path d="M24 44L22 40H26L24 44Z" fill="#FFFFFF" /> {/* South - White */}
          <path d="M4 24L8 22V26L4 24Z" fill="#FFFFFF" /> {/* West - White */}
          
          {/* Direction labels */}
          <text x="24" y="11" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">N</text>
          <text x="37" y="25" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">E</text>
          <text x="24" y="39" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">S</text>
          <text x="11" y="25" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">W</text>
        </svg>
      </motion.div>
    </div>
  );
};

export default CompassRose;
