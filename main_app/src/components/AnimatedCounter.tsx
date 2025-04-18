
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  separator?: string;
}

const AnimatedCounter = ({
  value,
  duration = 1500,
  formatValue = (val) => val.toLocaleString(),
  separator = ','
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const previousValueRef = useRef<number>(0);

  useEffect(() => {
    previousValueRef.current = displayValue;
    startTimeRef.current = null;
    
    const startAnimation = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const progress = timestamp - startTimeRef.current;
      const progressRatio = Math.min(progress / duration, 1);
      const easedProgress = easeOutCubic(progressRatio);
      
      const currentValue = Math.round(
        previousValueRef.current + (value - previousValueRef.current) * easedProgress
      );
      
      setDisplayValue(currentValue);
      
      if (progressRatio < 1) {
        frameRef.current = requestAnimationFrame(startAnimation);
      }
    };
    
    frameRef.current = requestAnimationFrame(startAnimation);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  // Easing function for smooth animation
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };

  // Format the displayed value
  const formattedValue = formatValue(displayValue).replace(/,/g, separator);

  return <span>{formattedValue}</span>;
};

export default AnimatedCounter;
