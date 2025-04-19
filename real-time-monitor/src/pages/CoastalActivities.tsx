
import React, { useState } from 'react';
import { PollutionProvider } from '../contexts/PollutionContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PollutionMap from '../components/PollutionMap';
import { Button } from '@/components/ui/button';
import { 
  Waves, 
  Fish, 
  Wind, 
  Umbrella, 
  Sailboat, 
  MapPin,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoastalActivities = () => {
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  // Removed weather condition references
  const activities = [
    { 
      icon: <Waves size={24} />, 
      name: 'Surfing', 
      description: 'Catch the perfect wave'
    },
    { 
      icon: <Fish size={24} />, 
      name: 'Snorkeling', 
      description: 'Explore underwater wonders'
    },
    { 
      icon: <Sailboat size={24} />, 
      name: 'Dolphin Watching', 
      description: 'Meet marine mammals'
    },
    { 
      icon: <Wind size={24} />, 
      name: 'Parasailing', 
      description: 'Soar above the sea'
    },
    { 
      icon: <Umbrella size={24} />, 
      name: 'Beach Events', 
      description: 'Fun in the sun'
    },
    { 
      icon: <MapPin size={24} />, 
      name: 'Island Hopping', 
      description: 'Discover hidden gems'
    }
  ];

  const handleStartExploring = () => {
    setShowMap(true);
  };

  const handleBackToActivities = () => {
    setShowMap(false);
  };

  return (
    <PollutionProvider>
      <div className="min-h-screen flex flex-col bg-sea-dark text-white">
        <Header />
        
        <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
          {!showMap ? (
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="text-center py-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  <span className="text-blue-400">Discover</span> Your Perfect Sea Adventure
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Dive into a world of coastal activities, from thrilling water sports to relaxing beach experiences for all ages.
                </p>
              </div>
              
              {/* Activities Grid */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Explore Activities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {activities.map((activity, index) => (
                    <div 
                      key={index} 
                      className="bg-sea-blue/60 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center transition-all transform hover:scale-[1.02] cursor-pointer"
                      onClick={() => setShowMap(true)}
                    >
                      <div className="bg-blue-500/20 p-4 rounded-full mb-4">
                        {activity.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-1">{activity.name}</h3>
                      <p className="text-gray-300 text-sm">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="text-center">
                <Button 
                  onClick={handleStartExploring}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-8 rounded-md text-lg flex items-center gap-2 transition-all transform hover:scale-[1.02]"
                >
                  Start Exploring
                  <ArrowRight size={20} />
                </Button>
              </div>
              
              {/* Safety Reminder - Weather references removed */}
              <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4 max-w-2xl mx-auto">
                <h3 className="font-bold text-amber-300 mb-1">Safety Tips</h3>
                <p className="text-sm text-gray-300">
                  Always wear appropriate safety equipment for water activities. Bring sunscreen, stay hydrated,
                  and be mindful of your surroundings when enjoying coastal adventures.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Button 
                variant="ghost" 
                className="text-blue-400"
                onClick={handleBackToActivities}
              >
                ← Back to Activities
              </Button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Explore Available Activities</h2>
                <p className="text-gray-300">
                  Click on any marker to learn more about each activity, including time, location, and booking info.
                </p>
              </div>
              
              <PollutionMap />
              
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 max-w-2xl mx-auto mt-4">
                <h3 className="font-bold text-green-300 mb-1">Ready for Adventure?</h3>
                <p className="text-sm text-gray-300">
                  Many activities offer online booking with special discounts. We recommend checking availability before planning your trip!
                </p>
              </div>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </PollutionProvider>
  );
};

export default CoastalActivities;
