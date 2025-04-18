
import React, { useState } from 'react';
import { Map as MapIcon, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MapPreviewProps {
  title?: string;
  placeholder?: string;
}

const MapPreview = ({ 
  title = "Real-Time Waste Tracking",
  placeholder = "https://images.unsplash.com/photo-1577315734214-4b3dec92d9ad?q=80&w=1000"
}: MapPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Simulating load completion
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="animated-border rounded-xl overflow-hidden"
      whileHover={{ 
        y: -10,
        transition: { type: "spring", stiffness: 300, damping: 15 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative aspect-video">
        {/* Placeholder image */}
        <motion.img 
          src={placeholder}
          alt="Map preview" 
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.8) brightness(0.7)' }}
          animate={{ 
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.5 }}
          onLoad={() => setIsLoading(false)}
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <MapIcon className="w-12 h-12 text-ocean mb-4" />
          </motion.div>
          
          <motion.h3 
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className="text-foreground/70 max-w-md mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            View real-time locations of detected marine waste and pollution hotspots around the globe.
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center"
          >
            <Link 
              to="/map" 
              className="glass-button ripple flex items-center"
            >
              <span>View Full Map</span>
              <motion.div
                animate={{ 
                  x: [0, 5, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  repeatDelay: 1,
                  duration: 1 
                }}
              >
                <ExternalLink className="ml-2 w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
          
          {/* Interactive wave overlay */}
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-[20%] z-5"
            style={{
              background: "linear-gradient(to top, rgba(10, 143, 196, 0.2), transparent)",
            }}
            animate={{ 
              y: [0, 5, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut" 
            }}
          />
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-5 h-5 text-foreground/50 animate-spin" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MapPreview;
