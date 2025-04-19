
import React from 'react';
import { usePollution } from '../contexts/PollutionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Waves, 
  Sailboat, 
  Ship, 
  Anchor, 
  CalendarDays
} from 'lucide-react';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'cleanup':
      return <Waves className="text-blue-400" />;
    case 'research':
      return <Ship className="text-purple-400" />;
    case 'monitoring':
      return <Anchor className="text-red-400" />;
    case 'conservation':
      return <Sailboat className="text-green-400" />;
    default:
      return <Waves className="text-blue-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'bg-green-500/20 text-green-500';
    case 'completed':
      return 'bg-blue-500/20 text-blue-500';
    case 'planned':
      return 'bg-amber-500/20 text-amber-500';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
};

const SeaActivitiesCard = () => {
  const { activities } = usePollution();

  return (
    <Card className="bg-sea-blue/60 backdrop-blur-sm text-white border-none h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Sea Activities</CardTitle>
        <p className="text-xs text-gray-300">Current and upcoming missions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-gray-800/50 rounded-md p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                {getActivityIcon(activity.type)}
                <h3 className="text-sm font-medium flex-1">{activity.name}</h3>
                <span 
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    getStatusColor(activity.status)
                  )}
                >
                  {activity.status}
                </span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1 mb-1.5">
                <CalendarDays size={14} />
                <span>{activity.date} • </span>
                <span>{activity.location}</span>
              </div>
              <p className="text-xs text-gray-300">{activity.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeaActivitiesCard;
