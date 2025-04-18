
import React from 'react';
import { BarChart, Waves, AlertCircle } from 'lucide-react';

const Statistics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-card border border-border rounded-xl p-6 hover-card">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mr-3">
            <BarChart className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="text-xl font-semibold">8 Million Tons</h3>
        </div>
        <p className="text-muted-foreground">
          Approximately 8 million tons of plastic waste enter our oceans every year, equivalent to dumping a garbage truck of plastic into the ocean every minute.
        </p>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6 hover-card">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-3">
            <Waves className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold">5 Trillion Pieces</h3>
        </div>
        <p className="text-muted-foreground">
          There are more than 5 trillion plastic pieces weighing over 250,000 tons floating in our oceans, forming massive garbage patches.
        </p>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6 hover-card">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold">100,000+ Deaths</h3>
        </div>
        <p className="text-muted-foreground">
          Marine debris causes the deaths of more than 100,000 marine mammals and one million seabirds annually through ingestion and entanglement.
        </p>
      </div>
    </div>
  );
};

export default Statistics;
