import React, { useEffect, useRef } from 'react';
import { ArrowRight, Waves, Shield, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      const layers = heroRef.current.querySelectorAll('.parallax-layer');
      layers.forEach((layer, index) => {
        const speed = 1 + index * 0.5;
        const htmlLayer = layer as HTMLElement;
        htmlLayer.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden wave-bg" ref={heroRef}>
      {/* Moving gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-ocean-950/40 to-background/95 z-0"></div>
      
      {/* Parallax floating elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-ocean/5 blur-3xl parallax-layer"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-ocean/10 blur-2xl parallax-layer"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-ocean/10 blur-xl parallax-layer"
      ></motion.div>
      
      <div className="container mx-auto px-4 pt-20 z-10">
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full md:w-1/2 md:pr-8 mb-10 md:mb-0"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6 inline-block">
              <motion.span 
                className="badge"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Waves className="w-3 h-3 mr-1" />
                <span>Ocean Protection Initiative</span>
              </motion.span>
            </motion.div>
            
            {/* Main heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="ocean-text">Sea Trash</span> Detection & Analytics Hub
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-foreground/80 mb-8 max-w-xl"
            >
              Leveraging AI to monitor and combat marine pollution in real-time. 
              Dive into comprehensive analytics and visualizations of ocean waste data.
            </motion.p>
            
            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Link to="/sea-trash" className="glass-button ripple flex items-center group">
                  <span>Get Started</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div>
              
              <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Link to="/about" className="px-4 py-2 rounded-lg border border-white/10 text-foreground/70 transition-all duration-300 hover:bg-white/5 hover:text-foreground">
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full md:w-1/2 relative"
          >
            {/* Hero image with animation */}
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="relative animated-border rounded-lg overflow-hidden aspect-video"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-ocean-900/60 to-background/60 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1000&auto=format&fit=crop"
                alt="Ocean with waste visualization" 
                className="w-full h-full object-cover"
              />
              
              {/* Floating stats widgets */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-6 left-6 glass-container p-3 rounded-lg z-20 flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-2 rounded-lg bg-ocean/20">
                  <Shield className="w-5 h-5 text-ocean-300" />
                </div>
                <div>
                  <div className="text-xs text-foreground/70">Protection Rate</div>
                  <div className="text-sm font-semibold">87% Coverage</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-6 right-6 glass-container p-3 rounded-lg z-20 flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-2 rounded-lg bg-ocean/20">
                  <BarChart2 className="w-5 h-5 text-ocean-300" />
                </div>
                <div>
                  <div className="text-xs text-foreground/70">Waste Detected</div>
                  <div className="text-sm font-semibold">+2,580 tons</div>
                </div>
              </motion.div>
              
              {/* Animated wave overlay */}
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-[40%] z-5"
                style={{
                  background: "linear-gradient(to top, rgba(10, 143, 196, 0.2), transparent)",
                }}
                initial={{ y: 50 }}
                animate={{ 
                  y: [0, 10, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
