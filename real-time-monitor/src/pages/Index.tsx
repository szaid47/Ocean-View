
import React from 'react';
import { PollutionProvider } from '../contexts/PollutionContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PollutionMap from '../components/PollutionMap';
import PollutionStatisticsCard from '../components/PollutionStatisticsCard';
import RecentDetectionsCard from '../components/RecentDetectionsCard';
import ControlsCard from '../components/ControlsCard';
import AlertBanner from '../components/AlertBanner';
import PollutionLegend from '../components/PollutionLegend';
import SeaActivitiesCard from '../components/SeaActivitiesCard';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <PollutionProvider>
      <div className="min-h-screen flex flex-col bg-sea-dark text-white">
        <Header />
        <AlertBanner />
        
        <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold">Sea Trash Detection</h1>
            
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <Link to="/activities">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <MapPin size={16} />
                  Explore Sea Activities
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mb-2">
            <PollutionLegend />
          </div>
          
          <div className="w-full">
            <PollutionMap />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <PollutionStatisticsCard />
            </div>
            <div>
              <RecentDetectionsCard />
            </div>
            <div>
              <ControlsCard />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PollutionProvider>
  );
};

export default Index;
