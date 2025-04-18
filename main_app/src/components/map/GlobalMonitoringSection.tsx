
import React from 'react';
import { Trash2 } from 'lucide-react';
import MapPreview from '../MapPreview';
import { motion } from 'framer-motion';

const GlobalMonitoringSection = () => {
  return (
    <motion.section 
      className="py-20 px-4 bg-secondary"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="inline-block mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge">
              <Trash2 className="w-3 h-3 mr-1" />
              <span>Waste Hotspots</span>
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Global Monitoring System
          </motion.h2>
          
          <motion.p 
            className="text-foreground/70 max-w-xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Visualize marine waste hotspots across the globe with our interactive map interface.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <MapPreview />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default GlobalMonitoringSection;
