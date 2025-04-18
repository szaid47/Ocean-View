
import React from 'react';
import { BarChart2, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPreview = () => {
  return (
    <motion.section 
      className="py-20 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
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
                <BarChart2 className="w-3 h-3 mr-1" />
                <span>Waste Analytics</span>
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Comprehensive Dashboard
            </motion.h2>
            
            <motion.p 
              className="text-foreground/70 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Monitor key metrics and trends with our interactive dashboard. Track waste detection
              rates, geographic distribution, and temporal patterns to gain actionable insights.
            </motion.p>
            
            <motion.ul 
              className="space-y-3 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {[
                'Real-time detection metrics and statistics',
                'Interactive data visualization and filtering',
                'Temporal analysis of waste accumulation patterns',
                'Customizable alerts and monitoring thresholds'
              ].map((item, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                >
                  <motion.span 
                    className="text-ocean mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      duration: 1,
                      delay: 1 + (index * 0.2),
                      repeat: Infinity,
                      repeatDelay: 5
                    }}
                  >
                    ✓
                  </motion.span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // Combined transitions into a single transition prop
              transition={{ 
                duration: 0.5, 
                delay: 0.6,
                type: "spring", 
                stiffness: 400, 
                damping: 10 
              }}
            >
              <a href="/dashboard" className="glass-button ripple inline-flex items-center">
                <span>Explore Dashboard</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5, 
                    ease: "easeInOut" 
                  }}
                >
                  <BarChart3 className="ml-2 w-4 h-4" />
                </motion.div>
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2 animated-border rounded-xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ y: -10 }}
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
              alt="Dashboard preview" 
              className="w-full h-full object-cover rounded-xl"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default DashboardPreview;
