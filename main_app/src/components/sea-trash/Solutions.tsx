
import React from 'react';
import { Lightbulb, Waves } from 'lucide-react';

const Solutions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-5 h-5 text-ocean mr-2" />
          <h2 className="text-xl font-semibold">Solutions & Innovations</h2>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground"><strong>Ocean Cleanup Projects:</strong> Organizations like The Ocean Cleanup are developing technologies to collect plastic waste from oceans.</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground"><strong>Marine Debris Tracking:</strong> AI and satellite technology to identify and track waste accumulation hotspots.</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground"><strong>Biodegradable Alternatives:</strong> Development of biodegradable and compostable materials to replace single-use plastics.</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground"><strong>Waste-to-Energy:</strong> Technologies that convert plastic waste into fuel or energy resources.</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground"><strong>Marine Protected Areas:</strong> Establishing conservation zones to allow ecosystems to recover from pollution impacts.</span>
          </li>
        </ul>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center mb-4">
          <div className="p-1 rounded-md bg-ocean/10">
            <Waves className="w-4 h-4 text-ocean" />
          </div>
          <h2 className="text-xl font-semibold ml-2">How You Can Help</h2>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground">Reduce single-use plastics by using reusable bags, bottles, and containers</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground">Participate in beach and coastal cleanup events in your community</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground">Properly dispose of trash and recycle whenever possible</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground">Choose seafood from sustainable sources that use responsible fishing practices</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground">Support organizations and policies focused on ocean conservation</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-muted-foreground">Spread awareness about marine pollution through education and social media</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Solutions;
