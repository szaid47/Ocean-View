
import React from "react";
import { X, Filter, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Get the waste types data with labels, colors, and icons
const wasteTypeData = {
  "plastic_waste": { label: "Plastic Waste", color: "#3B82F6", description: "Single-use plastics and microplastics" },
  "ocean_waste": { label: "Ocean Waste", color: "#10B981", description: "Mixed debris floating in ocean currents" },
  "plastic_debris": { label: "Plastic Debris", color: "#F59E0B", description: "Larger plastic items and fragments" },
  "fishing_gear": { label: "Fishing Gear", color: "#EC4899", description: "Abandoned nets, lines, and equipment" },
  "industrial_waste": { label: "Industrial Waste", color: "#8B5CF6", description: "Chemical and manufacturing waste" },
  "sewage_waste": { label: "Sewage Waste", color: "#EF4444", description: "Untreated sewage and related debris" }
};

interface FilterSidebarProps {
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  selectedTypes: string[];
  handleToggleType: (type: string) => void;
  wasteTypes: string[];
  setSelectedTypes: (types: string[]) => void;
}

const FilterSidebar = ({ 
  showFilter, 
  setShowFilter, 
  selectedTypes, 
  handleToggleType,
  wasteTypes,
  setSelectedTypes
}: FilterSidebarProps) => {
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 }
  };

  return (
    <AnimatePresence>
      {showFilter && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowFilter(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-64 sm:w-80 bg-card shadow-lg border-r border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-ocean/10">
                    <Filter className="w-4 h-4 text-ocean" />
                  </div>
                  <h3 className="text-lg font-bold">Filter Map Data</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setShowFilter(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-foreground/70 mb-2">
                  Select the types of marine waste to display on the map.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => setSelectedTypes([])}
                  >
                    Clear all
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => setSelectedTypes([...wasteTypes])}
                  >
                    Select all
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {wasteTypes.map((type) => (
                  <motion.div 
                    key={type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div 
                      className={`p-3 rounded-lg flex items-start gap-3 cursor-pointer transition-all ${
                        selectedTypes.includes(type) 
                          ? 'bg-ocean/10 border border-ocean/20' 
                          : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                      }`}
                      onClick={() => handleToggleType(type)}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedTypes.includes(type) 
                          ? 'bg-ocean text-ocean-foreground' 
                          : 'bg-secondary border border-white/20'
                      }`}>
                        {selectedTypes.includes(type) && <Check className="w-3 h-3" />}
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <div 
                            className="w-2.5 h-2.5 rounded-full mr-2" 
                            style={{ backgroundColor: wasteTypeData[type]?.color || '#888' }} 
                          />
                          <span className="font-medium text-sm">{wasteTypeData[type]?.label || type.replace(/_/g, " ")}</span>
                        </div>
                        {wasteTypeData[type]?.description && (
                          <p className="text-xs text-foreground/60 mt-1">
                            {wasteTypeData[type].description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-6" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  className="w-full flex items-center gap-2 bg-ocean hover:bg-ocean/80 text-ocean-foreground"
                  onClick={() => setShowFilter(false)}
                >
                  Apply Filters
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-white/5">
                  <h4 className="text-sm font-medium mb-1">Selected Filters</h4>
                  <p className="text-xs text-foreground/70">
                    {selectedTypes.length === 0 
                      ? "No filters selected (showing all data)" 
                      : `Showing ${selectedTypes.length} waste ${selectedTypes.length === 1 ? 'type' : 'types'}`}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
      
      {/* Filter Toggle Button - always visible */}
      <Button
        variant="default"
        size="icon"
        className="fixed top-20 left-4 z-30 bg-ocean text-ocean-foreground rounded-full shadow-lg opacity-80 hover:opacity-100"
        onClick={() => setShowFilter(!showFilter)}
        aria-label="Toggle filters"
      >
        <Filter className="w-4 h-4" />
      </Button>
    </AnimatePresence>
  );
};

export default FilterSidebar;
