
/**
 * Creates a pulsing animation for markers on the map
 * @param element HTML element to animate
 * @param intensity Animation intensity (1-10)
 * @returns Animation controller
 */
export const createPulsingMarker = (element: HTMLElement, intensity: number = 5) => {
  // Normalize intensity to a scale of 0.5 - 2.0
  const normalizedIntensity = 0.5 + (intensity / 10) * 1.5;
  
  // Set initial styles
  element.style.transition = 'transform 1.5s ease-in-out, opacity 1.5s ease-in-out';
  element.style.transformOrigin = 'center center';
  
  // Animation variables
  let growing = true;
  let animationFrameId: number;
  
  // Animation function
  const animate = () => {
    if (growing) {
      element.style.transform = `scale(${normalizedIntensity})`;
      element.style.opacity = '0.6';
    } else {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    }
    
    growing = !growing;
    
    // Schedule next animation
    animationFrameId = setTimeout(animate, 1500) as unknown as number;
  };
  
  // Start animation
  animate();
  
  // Return controller to stop animation
  return {
    stop: () => {
      clearTimeout(animationFrameId);
    }
  };
};

/**
 * Creates a parallax effect for map background
 * @param mapContainer Map container element
 * @returns Cleanup function
 */
export const createParallaxEffect = (mapContainer: HTMLElement) => {
  if (!mapContainer) return () => {};
  
  // Create subtle parallax effect
  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { width, height } = mapContainer.getBoundingClientRect();
    
    // Calculate offset (very subtle movement)
    const offsetX = (clientX / width - 0.5) * 5;
    const offsetY = (clientY / height - 0.5) * 5;
    
    // Apply transform
    mapContainer.style.transition = 'transform 0.8s ease-out';
    mapContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  };
  
  // Add listener
  mapContainer.addEventListener('mousemove', handleMouseMove);
  
  // Return cleanup function
  return () => {
    mapContainer.removeEventListener('mousemove', handleMouseMove);
  };
};
