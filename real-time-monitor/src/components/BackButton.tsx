
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
  showLabel?: boolean;
}

const BackButton = ({ className, showLabel = false }: BackButtonProps) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Button 
      variant="ghost" 
      size={showLabel ? "default" : "icon"}
      onClick={goBack} 
      className={cn(className, "hover:bg-blue-800/30 text-blue-300")}
      aria-label="Go back"
    >
      <ArrowLeft size={20} />
      {showLabel && <span className="ml-1">Back</span>}
    </Button>
  );
};

export default BackButton;
