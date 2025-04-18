
import React from 'react';
import Hero from '../components/Hero';
import FeaturesSection from '../components/features/FeaturesSection';
import GlobalMonitoringSection from '../components/map/GlobalMonitoringSection';
import OceanViewSection from '../components/ocean-view/OceanViewSection';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Ocean View Preview */}
      <OceanViewSection />
      
      {/* Map Preview */}
      <GlobalMonitoringSection />
    </div>
  );
};

export default Index;
