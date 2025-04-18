
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div 
      className="glass-container rounded-xl p-6 hover-card"
      whileHover={{ 
        y: -8,
        boxShadow: "0 15px 30px rgba(14, 165, 233, 0.1)",
        transition: { type: "spring", stiffness: 300, damping: 10 }
      }}
    >
      <motion.div 
        className="w-12 h-12 mb-4 rounded-lg bg-ocean/10 flex items-center justify-center"
        whileHover={{ 
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.5 }
        }}
      >
        <Icon className="w-6 h-6 text-ocean" />
      </motion.div>
      <motion.h3 
        className="text-xl font-semibold mb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-foreground/70"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default FeatureCard;
