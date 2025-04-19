
import React from 'react';
import { usePollution } from '../contexts/PollutionContext';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const AlertBanner = () => {
  const { alerts, dismissAlert } = usePollution();

  if (alerts.length === 0) return null;

  // Just display the first alert
  const alert = alerts[0];

  return (
    <div className="fixed top-16 right-4 w-80 z-50 animate-fade-in">
      <div className="bg-pollution-high/20 border border-pollution-high rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-pollution-high mt-0.5" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-white">{alert.message}</h3>
            <div className="mt-1 text-xs text-gray-300">{alert.details}</div>
          </div>
          <button 
            onClick={() => dismissAlert(0)} 
            className="ml-2 text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
