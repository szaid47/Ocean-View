import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { usePollution } from '../contexts/PollutionContext';
import { MapMarker, PollutionLevel, SeaActivity } from '../types';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

/// <reference types="@googlemaps/js-api-loader" />

const GOOGLE_MAPS_API_KEY = 'AIzaSyDDYP9U73l8X1PjXtNPMlsv_gWiPxX744Y';

const getMarkerColor = (level: PollutionLevel): string => {
  switch (level) {
    case 'high':
      return '#ff4d4d';
    case 'medium':
      return '#ffbb33';
    case 'low':
      return '#33cc66';
    default:
      return '#ffffff';
  }
};

const PollutionMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const activityMarkersRef = useRef<{ [key: string]: any }>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  const { detections, activities } = usePollution();

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'visualization']
    });

    loader.load().then(() => {
      if (mapRef.current && !googleMapRef.current) {
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
          mapTypeId: 'hybrid',
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        setIsMapLoaded(true);
      }
    });
    
    return () => {
      if (markersRef.current) {
        Object.values(markersRef.current).forEach(marker => marker.setMap(null));
      }
      if (activityMarkersRef.current) {
        Object.values(activityMarkersRef.current).forEach(marker => marker.setMap(null));
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isMapLoaded || !googleMapRef.current) return;
    
    const currentMarkerIds = new Set(detections.map(detection => detection.id));
    
    Object.keys(markersRef.current).forEach(id => {
      if (!currentMarkerIds.has(id)) {
        markersRef.current[id].setMap(null);
        delete markersRef.current[id];
      }
    });
    
    detections.forEach(detection => {
      const position = {
        lat: detection.location.lat,
        lng: detection.location.lng
      };
      
      if (markersRef.current[detection.id]) {
        markersRef.current[detection.id].setPosition(position);
      } else {
        const color = getMarkerColor(detection.level);
        
        const markerSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 34">
            <path fill="${color}" d="M12 0C5.383 0 0 5.383 0 12c0 9.185 12 22 12 22s12-12.815 12-22c0-6.617-5.383-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          </svg>
        `;
        
        const icon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(markerSvg),
          scaledSize: new window.google.maps.Size(24, 34),
          anchor: new window.google.maps.Point(12, 34),
        };
        
        const glowCircle = document.createElement('div');
        glowCircle.className = 'heatmap-gradient';
        glowCircle.style.position = 'absolute';
        glowCircle.style.width = '120px';
        glowCircle.style.height = '120px';
        glowCircle.style.borderRadius = '50%';
        
        if (detection.level === 'high') {
          glowCircle.style.backgroundColor = 'rgba(255, 77, 77, 0.3)';
          glowCircle.style.boxShadow = '0 0 30px rgba(255, 77, 77, 0.6)';
        } else if (detection.level === 'medium') {
          glowCircle.style.backgroundColor = 'rgba(255, 187, 51, 0.3)';
          glowCircle.style.boxShadow = '0 0 30px rgba(255, 187, 51, 0.6)';
        } else {
          glowCircle.style.backgroundColor = 'rgba(51, 204, 102, 0.3)';
          glowCircle.style.boxShadow = '0 0 30px rgba(51, 204, 102, 0.6)';
        }
        
        const newMarker = new window.google.maps.Marker({
          position,
          map: googleMapRef.current,
          icon,
          title: `${detection.type} (${detection.level})`,
          zIndex: detection.level === 'high' ? 3 : (detection.level === 'medium' ? 2 : 1)
        });
        
        const contentString = `
          <div style="padding: 10px; max-width: 200px; color: #333; position: relative;">
            <button 
              style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.1); border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
              onclick="document.querySelector('.gm-ui-hover-effect').click()"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18"></path>
                <path d="M6 6L18 18"></path>
              </svg>
            </button>
            <h3 style="margin: 0 0 8px 0; font-size: 16px;">${detection.type}</h3>
            <p style="margin: 0 0 5px 0;"><strong>Level:</strong> 
              <span style="color: ${color}; font-weight: bold;">${detection.level}</span>
            </p>
            <p style="margin: 0; font-size: 12px;">${detection.timestamp}</p>
          </div>
        `;
        
        const infoWindow = new window.google.maps.InfoWindow({
          content: contentString,
          pixelOffset: new window.google.maps.Size(0, -34)
        });
        
        newMarker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, newMarker);
        });
        
        const overlay = new window.google.maps.OverlayView();
        overlay.onAdd = function() {
          const panes = overlay.getPanes();
          panes.overlayLayer.appendChild(glowCircle);
        };
        
        overlay.draw = function() {
          const projection = overlay.getProjection();
          const point = projection.fromLatLngToDivPixel(newMarker.getPosition()!);
          
          if (point) {
            glowCircle.style.left = (point.x - 60) + 'px';
            glowCircle.style.top = (point.y - 60) + 'px';
          }
        };
        
        overlay.setMap(googleMapRef.current);
        
        markersRef.current[detection.id] = newMarker;
      }
    });
  }, [detections, isMapLoaded]);
  
  useEffect(() => {
    if (!isMapLoaded || !googleMapRef.current) return;
    
    const currentActivityIds = new Set(activities.map(activity => activity.id));
    
    Object.keys(activityMarkersRef.current).forEach(id => {
      if (!currentActivityIds.has(id)) {
        activityMarkersRef.current[id].setMap(null);
        delete activityMarkersRef.current[id];
      }
    });
    
    const getCoordinatesFromLocation = (location: string): {lat: number, lng: number} => {
      const locationMap: {[key: string]: {lat: number, lng: number}} = {
        'North Pacific': {lat: 35.0, lng: -150.0},
        'Great Barrier Reef': {lat: -18.2871, lng: 147.6992},
        'Mariana Trench': {lat: 11.3493, lng: 142.1996},
        'Mediterranean Sea': {lat: 35.5, lng: 18.0}
      };
      
      return locationMap[location] || {
        lat: (Math.random() * 140) - 70,
        lng: (Math.random() * 360) - 180
      };
    };
    
    const getActivityColor = (type: string): string => {
      switch (type) {
        case 'cleanup':
          return '#3b82f6';
        case 'research':
          return '#8b5cf6';
        case 'monitoring':
          return '#ef4444';
        case 'conservation':
          return '#22c55e';
        default:
          return '#6b7280';
      }
    };
    
    activities.forEach(activity => {
      const position = getCoordinatesFromLocation(activity.location);
      
      if (activityMarkersRef.current[activity.id]) {
        activityMarkersRef.current[activity.id].setPosition(position);
      } else {
        const color = getActivityColor(activity.type);
        
        const activitySvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="5" fill="white"/>
          </svg>
        `;
        
        const icon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(activitySvg),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16),
        };
        
        const newActivityMarker = new window.google.maps.Marker({
          position,
          map: googleMapRef.current,
          icon,
          title: `${activity.name} (${activity.type})`,
          zIndex: 4
        });
        
        const activityContentString = `
          <div style="padding: 12px; max-width: 280px; color: #333; position: relative;">
            <button 
              style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.1); border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
              onclick="document.querySelector('.gm-ui-hover-effect').click()"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18"></path>
                <path d="M6 6L18 18"></path>
              </svg>
            </button>
            <div style="font-size: 24px; margin-bottom: 4px;">${activity.emoji || ''}</div>
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: ${color};">${activity.name}</h3>
            <p style="margin: 0 0 5px 0;"><strong>Type:</strong> ${activity.type}</p>
            <p style="margin: 0 0 5px 0;"><strong>Status:</strong> ${activity.status}</p>
            <p style="margin: 0 0 5px 0;"><strong>Date:</strong> ${activity.date}</p>
            <p style="margin: 0 0 5px 0;"><strong>Time:</strong> ${activity.date ? new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'All day'}</p>
            <p style="margin: 0 0 5px 0;"><strong>Location:</strong> ${activity.location}</p>
            <p style="margin: 0 0 8px 0; font-size: 12px;">${activity.description}</p>
            ${activity.pricing ? `<p style="margin: 0 0 5px 0;"><strong>Pricing:</strong> ${activity.pricing}</p>` : ''}
            ${activity.booking_url ? `<a href="${activity.booking_url}" target="_blank" style="display: inline-block; background: #3b82f6; color: white; padding: 4px 8px; text-decoration: none; border-radius: 4px; font-size: 12px; margin-top: 4px;">Book Now</a>` : ''}
          </div>
        `;
        
        const activityInfoWindow = new window.google.maps.InfoWindow({
          content: activityContentString,
          maxWidth: 300
        });
        
        newActivityMarker.addListener('click', () => {
          activityInfoWindow.open(googleMapRef.current, newActivityMarker);
        });
        
        activityMarkersRef.current[activity.id] = newActivityMarker;
      }
    });
  }, [activities, isMapLoaded]);
  
  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm p-1 rounded-md">
        <p className="text-white text-xs px-2">Click on markers to view pollution and activity details</p>
      </div>
    </div>
  );
};

export default PollutionMap;
