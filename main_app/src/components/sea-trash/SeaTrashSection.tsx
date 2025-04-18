
import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SeaTrashSectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-in-left' | 'slide-in-right' | 'scale-up';
  delay?: number;
}

const SeaTrashSection = ({ 
  icon: Icon, 
  title, 
  children, 
  className = '',
  animation = 'fade-in',
  delay = 0
}: SeaTrashSectionProps) => {
  const animationClass = animation ? `animate-${animation}` : '';
  const animationStyle = delay ? { animationDelay: `${delay}s` } : {};
  
  return (
    <div 
      className={`bg-card border border-border rounded-xl p-6 mb-8 ${animationClass} ${className}`}
      style={animationStyle}
    >
      <div className="flex items-center mb-4">
        <div className="bg-ocean/10 p-2 rounded-full mr-3">
          <Icon className="w-5 h-5 text-ocean" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default SeaTrashSection;
