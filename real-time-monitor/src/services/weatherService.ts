
import { toast } from "@/hooks/use-toast";

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  uvIndex: number;
  waveHeight?: number;
  highTide?: string;
  lowTide?: string;
}

// Using OpenWeatherMap's free API
const API_KEY = '05b2c8474f3c61f21b66c6f5cfe5de76'; // This is a demo key, replace with your own for production

export const getWeatherByCoordinates = async (lat: number, lng: number): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather data not available');
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      uvIndex: getEstimatedUVIndex(data.weather[0].id, data.clouds.all),
      waveHeight: getEstimatedWaveHeight(data.wind.speed),
      highTide: getEstimatedTideTime(true),
      lowTide: getEstimatedTideTime(false)
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    // Using toast correctly as a function with a description
    toast({
      variant: "destructive",
      title: "Error",
      description: "Unable to load weather data"
    });
    return null;
  }
};

// These are estimations since the free API doesn't provide this data
const getEstimatedUVIndex = (weatherId: number, cloudCover: number): number => {
  // Clear day has higher UV
  if (weatherId >= 800) {
    return Math.max(1, Math.round(10 - (cloudCover / 20)));
  }
  // Cloudy or rainy days have lower UV
  return Math.max(1, Math.round(5 - (cloudCover / 20)));
};

const getEstimatedWaveHeight = (windSpeed: number): number => {
  // Rough estimation based on wind speed
  return parseFloat((windSpeed * 0.2).toFixed(1));
};

const getEstimatedTideTime = (isHigh: boolean): string => {
  const now = new Date();
  // This is just a placeholder - in reality you'd use a tidal data API
  const hoursOffset = isHigh ? 6 : 12;
  const tideTime = new Date(now.getTime() + hoursOffset * 60 * 60 * 1000);
  return tideTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
