
import React, { useState } from 'react';
import { usePollution } from '../contexts/PollutionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ControlsCard = () => {
  const { 
    isRealTimeUpdates, 
    toggleRealTimeUpdates, 
    updateInterval,
    setUpdateInterval,
    manualUpdate 
  } = usePollution();

  const handleIntervalChange = (value: string) => {
    setUpdateInterval(parseInt(value));
  };

  return (
    <Card className="bg-sea-blue/60 backdrop-blur-sm text-white border-none h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Controls</CardTitle>
        <p className="text-xs text-gray-300">Monitoring settings</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="real-time-toggle" className="text-sm font-medium">
              Real-time updates
            </label>
            <Switch
              id="real-time-toggle"
              checked={isRealTimeUpdates}
              onCheckedChange={toggleRealTimeUpdates}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="update-interval" className="text-sm font-medium">
              Update interval
            </label>
            <Select 
              value={updateInterval.toString()} 
              onValueChange={handleIntervalChange}
              disabled={!isRealTimeUpdates}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="5">Every 5 seconds</SelectItem>
                <SelectItem value="10">Every 10 seconds</SelectItem>
                <SelectItem value="30">Every 30 seconds</SelectItem>
                <SelectItem value="60">Every 60 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              className="w-full border-gray-700 bg-blue-700/40 hover:bg-blue-600 text-white flex items-center gap-2 transition-all transform hover:scale-[1.02] font-medium py-6"
              onClick={manualUpdate}
            >
              <RefreshCw size={18} className="animate-pulse" />
              Manual Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlsCard;
