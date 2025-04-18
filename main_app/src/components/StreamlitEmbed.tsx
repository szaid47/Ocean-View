
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface StreamlitEmbedProps {
  url: string;
  title?: string;
  height?: string;
  customStyles?: string;
}

const StreamlitEmbed = ({ 
  url,
  title = "Streamlit Application",
  height = "600px",
  customStyles = ""
}: StreamlitEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Track when the iframe has loaded
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Reset loading state if URL changes
  useEffect(() => {
    setIsLoading(true);
  }, [url]);

  // Make sure we're using dark theme in the URL
  const urlWithDarkTheme = url.includes('theme=') 
    ? url 
    : `${url}${url.includes('?') ? '&' : '?'}theme=dark`;

  return (
    <div className={cn("w-full overflow-hidden", customStyles)}>
      <div className="relative" style={{ height }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-ocean animate-spin mb-4 mx-auto" />
              <p className="text-muted-foreground">Loading Streamlit Application</p>
            </div>
          </div>
        )}
        
        <iframe
          title={title}
          src={urlWithDarkTheme}
          width="100%"
          height="100%"
          onLoad={handleIframeLoad}
          className="border-0 bg-background"
          allow="camera;microphone;clipboard-read;clipboard-write;"
        />
        
        {/* Add CSS to overwrite Streamlit styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Hide Streamlit's default elements */
          iframe[title="${title}"] {
            background-color: hsl(222, 47%, 11%) !important;
          }
          
          /* These styles target elements inside the iframe */
          iframe[title="${title}"]::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: hsl(222, 47%, 11%);
            z-index: -1;
          }
          
          /* This will be injected into the iframe when it loads */
          iframe {
            background-color: transparent !important;
          }
        `}} />
      </div>
    </div>
  );
};

export default StreamlitEmbed;
