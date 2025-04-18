
import React, { useState } from "react";
import { useMap } from "react-leaflet";
import { Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { toast } from "@/components/ui/use-toast";

const MapScreenshot = () => {
  const map = useMap();
  const [isCapturing, setIsCapturing] = useState(false);
  
  const captureScreenshot = async () => {
    if (!map || isCapturing) return;
    
    setIsCapturing(true);
    
    try {
      // Show toast
      toast({
        title: "Capturing screenshot...",
        description: "Please wait while we capture the current map view.",
      });
      
      // Get map container
      const mapContainer = map.getContainer();
      
      // Capture screenshot
      const canvas = await html2canvas(mapContainer, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null
      });
      
      // Convert to image
      const imageUrl = canvas.toDataURL("image/png");
      
      // Create download link
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `ocean-waste-map-${new Date().toISOString().slice(0, 10)}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success toast
      toast({
        title: "Screenshot captured!",
        description: "Your map screenshot has been downloaded.",
      });
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      
      // Show error toast
      toast({
        title: "Screenshot failed",
        description: "There was an error capturing the screenshot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  };
  
  return (
    <div className="absolute top-60 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-2 rounded-lg shadow-lg border border-slate-700">
      <div className="flex items-center gap-2">
        <div className="text-xs font-medium text-white">Screenshot</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={captureScreenshot}
          disabled={isCapturing}
          className={`p-1.5 rounded-full hover:bg-slate-700 ${isCapturing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Capture map screenshot"
        >
          <AnimatePresence mode="wait">
            {isCapturing ? (
              <motion.div
                key="spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-5 h-5 border-2 border-t-transparent border-blue-300 rounded-full animate-spin"
              />
            ) : (
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Camera className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default MapScreenshot;
