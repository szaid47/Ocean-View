
import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const FullscreenControl = () => {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement !== null ||
        (document as any).webkitFullscreenElement !== null ||
        (document as any).mozFullScreenElement !== null ||
        (document as any).msFullscreenElement !== null
      );
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  const toggleFullscreen = () => {
    if (!map) return;
    
    const container = map.getContainer();
    
    if (!isFullscreen) {
      // Enter fullscreen
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
      
      toast({
        title: "Fullscreen mode enabled",
        description: "Press ESC to exit fullscreen",
      });
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      
      toast({
        title: "Fullscreen mode disabled",
        description: "Returned to normal view",
      });
    }
  };
  
  return (
    <div className="absolute top-40 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-2 rounded-lg shadow-lg border border-slate-700">
      <div className="flex items-center gap-2">
        <div className="text-xs font-medium text-white">Fullscreen</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFullscreen}
          className={`p-1.5 rounded-full ${isFullscreen ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-slate-700'}`}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </motion.button>
      </div>
    </div>
  );
};

export default FullscreenControl;
