
import React from 'react';
import { Info } from 'lucide-react';
import SeaTrashSection from './SeaTrashSection';

const AboutSeaTrash = () => {
  return (
    <SeaTrashSection icon={Info} title="About Sea Trash">
      <p className="text-muted-foreground mb-4">
        Ocean pollution, particularly plastic waste, has become one of the most pressing environmental issues of our time. Approximately 80% of marine debris comes from land-based sources – litter carried by wind and rain into streams and rivers, and then into our oceans. The remaining 20% comes from boats and marine vessels.
      </p>
      <p className="text-muted-foreground mb-4">
        Plastic waste is particularly problematic because it degrades very slowly, breaking down into smaller and smaller pieces called microplastics rather than biodegrading. These microplastics absorb toxic chemicals, are ingested by marine life, and make their way up the food chain, eventually reaching humans.
      </p>
      <p className="text-muted-foreground">
        The Great Pacific Garbage Patch, located between Hawaii and California, is the largest accumulation of ocean plastic in the world and covers an estimated surface area of 1.6 million square kilometers - twice the size of Texas.
      </p>
    </SeaTrashSection>
  );
};

export default AboutSeaTrash;
