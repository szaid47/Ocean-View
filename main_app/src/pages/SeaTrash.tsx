import React from 'react';
import { Trash2 } from 'lucide-react';
import DetectionTool from '../components/sea-trash/DetectionTool';
import Statistics from '../components/sea-trash/Statistics';
import AboutSeaTrash from '../components/sea-trash/AboutSeaTrash';
import TypesOfMarineDebris from '../components/sea-trash/TypesOfMarineDebris';
import Solutions from '../components/sea-trash/Solutions';
import FAQ from '../components/sea-trash/FAQ';

const SeaTrash = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ocean/10 mb-4">
            <Trash2 className="w-8 h-8 text-ocean" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Sea Trash Information</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn about ocean waste pollution, its impact on marine ecosystems, and what we can do to combat this global environmental crisis.
          </p>
        </div>

        {/* AI Detection Tool Section */}
        <DetectionTool />

        {/* Key Statistics Section */}
        <Statistics />

        {/* About Sea Trash Section */}
        <AboutSeaTrash />

        {/* Types of Sea Trash Section */}
        <TypesOfMarineDebris />

        {/* Solutions Section */}
        <Solutions />

        {/* FAQ Section */}
        <FAQ />
      </div>
    </div>
  );
};

export default SeaTrash;
