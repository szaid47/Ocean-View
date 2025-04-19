
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getWeatherByCoordinates, WeatherData } from '../services/weatherService';
import { 
  Cloud, 
  CloudDrizzle, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  Droplets,
  Sun, 
  Thermometer, 
  Waves, 
  Wind 
} from 'lucide-react';

interface WeatherWidgetProps {
  lat?: number;
  lng?: number;
  location?: string;
  compact?: boolean;
}

const WeatherWidget = ({ lat = 25.7617, lng = -80.1918, location = "Miami Beach", compact = false }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const data = await getWeatherByCoordinates(lat, lng);
      setWeather(data);
      setLoading(false);
    };

    fetchWeather();
  }, [lat, lng]);

  const getWeatherIcon = (iconCode: string) => {
    // Map OpenWeatherMap icon codes to Lucide icons
    const prefix = iconCode.substring(0, 2);
    const isDay = iconCode.endsWith('d');
    
    switch (prefix) {
      case '01': // clear sky
        return <Sun size={compact ? 20 : 28} className="text-amber-400" />;
      case '02': // few clouds
      case '03': // scattered clouds
      case '04': // broken/overcast clouds
        return <Cloud size={compact ? 20 : 28} className="text-gray-300" />;
      case '09': // shower rain
        return <CloudDrizzle size={compact ? 20 : 28} className="text-blue-400" />;
      case '10': // rain
        return <CloudRain size={compact ? 20 : 28} className="text-blue-500" />;
      case '11': // thunderstorm
        return <CloudLightning size={compact ? 20 : 28} className="text-amber-500" />;
      case '13': // snow
        return <CloudSnow size={compact ? 20 : 28} className="text-white" />;
      default:  // mist, smoke, haze, etc.
        return <Cloud size={compact ? 20 : 28} className="text-gray-400" />;
    }
  };

  const renderCompactWidget = () => {
    if (loading) {
      return <Skeleton className="h-10 w-32" />;
    }
    
    if (!weather) return null;
    
    return (
      <div className="flex items-center gap-2 bg-sea-blue/40 rounded-full px-3 py-1.5 text-sm">
        {getWeatherIcon(weather.icon)}
        <span className="font-medium">{weather.temperature}°C</span>
        <span className="hidden sm:inline text-xs text-gray-300 truncate">{weather.location}</span>
      </div>
    );
  };

  const renderFullWidget = () => {
    if (loading) {
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      );
    }
    
    if (!weather) return <p className="text-center py-4">Weather data unavailable</p>;
    
    return (
      <Card className="bg-sea-blue/60 backdrop-blur-sm text-white border-none h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Weather at {weather.location}</span>
            {getWeatherIcon(weather.icon)}
          </CardTitle>
          <p className="text-xs text-gray-300">Perfect for sea activities</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Thermometer className="text-amber-500" size={18} />
                <span className="text-2xl font-bold">{weather.temperature}°C</span>
              </div>
              <p className="text-gray-300 text-sm capitalize">{weather.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Wind size={16} />
                <span>{weather.windSpeed} m/s</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets size={16} className="text-blue-400" />
                <span>{weather.humidity}% humidity</span>
              </div>
              <div className="flex items-center gap-2">
                <Waves size={16} className="text-blue-500" />
                <span>{weather.waveHeight}m waves</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-amber-400" />
                <span>UV index: {weather.uvIndex}</span>
              </div>
            </div>
            
            <div className="text-xs space-y-1 border-t border-gray-700/50 pt-3 mt-3">
              <p>High tide: {weather.highTide}</p>
              <p>Low tide: {weather.lowTide}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return compact ? renderCompactWidget() : renderFullWidget();
};

export default WeatherWidget;
