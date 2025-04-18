import React, { useState, useEffect } from 'react';
import { Globe, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";

const OceanView = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        toast({
          title: "Fullscreen Error",
          description: "Unable to enter fullscreen mode",
          variant: "destructive",
        });
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    // Listen for iframe load event
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content - Full Screen */}
      <main className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center">
              <div className="animate-pulse">
                <Globe className="w-16 h-16 text-ocean" />
              </div>
              <p className="mt-4 text-foreground/70">Loading Ocean View Explorer...</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={toggleFullScreen}
            className="p-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/80 transition-colors"
            aria-label="Toggle fullscreen"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <motion.div 
          className="w-full h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0.3 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <iframe 
            src="https://real-time-ocean-monitor-cfq9.vercel.app/" 
            title="Ocean View Explorer" 
            className="w-full h-full border-0" 
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default OceanView;
