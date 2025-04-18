
import React from 'react';
import { HelpCircle } from 'lucide-react';
import SeaTrashSection from './SeaTrashSection';

const TypesOfMarineDebris = () => {
  return (
    <SeaTrashSection icon={HelpCircle} title="Types of Marine Debris">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Plastic Waste</h3>
          <p className="text-muted-foreground mb-4">
            Includes single-use plastics (bags, bottles, straws), fishing gear, microplastics, and nurdles (plastic pellets). Plastics make up 80% of all marine debris.
          </p>
          
          <h3 className="font-medium mb-2">Chemical Pollutants</h3>
          <p className="text-muted-foreground mb-4">
            Industrial discharges, agricultural runoff, oil spills, and untreated sewage introduce harmful chemicals like pesticides, heavy metals, and pharmaceuticals.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-2">Derelict Fishing Gear</h3>
          <p className="text-muted-foreground mb-4">
            Abandoned fishing nets, lines, traps, and equipment that continue to "ghost fish" and entangle marine life long after being discarded.
          </p>
          
          <h3 className="font-medium mb-2">Marine Debris</h3>
          <p className="text-muted-foreground">
            General waste items like glass, metal, paper, cloth, rubber, and wood that enter marine environments through improper disposal or natural disasters.
          </p>
        </div>
      </div>
    </SeaTrashSection>
  );
};

export default TypesOfMarineDebris;
