
import React from 'react';
import { MessageSquare } from 'lucide-react';
import SeaTrashSection from './SeaTrashSection';

const FAQ = () => {
  return (
    <SeaTrashSection icon={MessageSquare} title="Frequently Asked Questions">
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">How long does it take for plastic to decompose in the ocean?</h3>
          <p className="text-muted-foreground">
            Most plastics never fully decompose. Instead, they break down into smaller and smaller pieces called microplastics. A plastic bottle can take 450 years to break down, while fishing line can take up to 600 years.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-2">What is the most common type of trash found in the ocean?</h3>
          <p className="text-muted-foreground">
            Cigarette butts, food wrappers, plastic beverage bottles, plastic bottle caps, and plastic grocery bags are among the most common items found during beach cleanups.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-2">How does marine debris affect human health?</h3>
          <p className="text-muted-foreground">
            Microplastics and the toxins they absorb can enter the human food chain through seafood consumption. Additionally, marine debris can harbor harmful bacteria and pathogens, posing health risks to swimmers and beachgoers.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-2">Are biodegradable plastics a good solution?</h3>
          <p className="text-muted-foreground">
            While biodegradable plastics can break down more quickly than conventional plastics, many still require specific industrial conditions to decompose properly. In ocean environments, they may still persist for years and cause harm to marine life.
          </p>
        </div>
      </div>
    </SeaTrashSection>
  );
};

export default FAQ;
