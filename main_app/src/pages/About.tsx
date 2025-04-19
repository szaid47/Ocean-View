
import React from 'react';
import { 
  ArrowRight, Github, ExternalLink, 
  BadgeCheck, Users, Shield, Code 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "AI Research Lead",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Mark Johnson",
      role: "Marine Biologist",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Alex Rodriguez",
      role: "Data Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Priya Patel",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="pt-20 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 wave-bg">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 ocean-text">About Sea Guardian</h1>
            <p className="text-xl text-foreground/80 mb-8">
              Combining AI technology with environmental science to combat marine pollution 
              and protect our planet's most precious resource.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://seadetection.streamlit.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-button ripple flex items-center"
              >
                <span>Visit Streamlit App</span>
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="px-4 py-2 rounded-lg border border-white/10 text-foreground/70 transition-all duration-300 hover:bg-white/5 hover:text-foreground flex items-center"
              >
                <Github className="mr-2 w-4 h-4" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="badge">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>Our Mission</span>
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Protecting Our Oceans</h2>
              <p className="text-foreground/70 mb-6">
                Sea Guardian was born from the urgent need to address the growing crisis of marine pollution. 
                Our platform leverages the latest in artificial intelligence and data visualization 
                to detect, track, and analyze waste in our oceans.
              </p>
              <p className="text-foreground/70 mb-6">
                By providing researchers, conservationists, and policymakers with accurate, 
                real-time data, we aim to facilitate more effective cleanup efforts and 
                prevention strategies.
              </p>
              <div className="space-y-4">
                {[
                  'Develop cutting-edge AI for marine waste detection',
                  'Create comprehensive, accessible data visualizations',
                  'Support global conservation initiatives with actionable insights',
                  'Raise awareness about the impact of ocean pollution'
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <BadgeCheck className="w-5 h-5 text-ocean mr-2 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animated-border rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1484291470158-b8f8d608850d?q=80&w=1000"
                alt="Ocean conservation" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Technology Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="badge">
                <Code className="w-3 h-3 mr-1" />
                <span>Our Technology</span>
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-foreground/70 max-w-xl mx-auto">
              Our platform combines multiple technologies to create a comprehensive 
              marine waste detection and analysis system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI Detection Model",
                description: "Computer vision algorithms trained to identify various types of marine debris from satellite and drone imagery.",
                image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&h=300&auto=format&fit=crop"
              },
              {
                title: "Data Processing Pipeline",
                description: "Robust backend infrastructure for processing large volumes of environmental data in real-time.",
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&h=300&auto=format&fit=crop"
              },
              {
                title: "Visualization Platform",
                description: "Interactive frontend interfaces that transform complex data into actionable insights.",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=300&auto=format&fit=crop"
              }
            ].map((item, index) => (
              <div key={index} className="glass-container rounded-xl overflow-hidden hover-card">
                <img 
                  src={item.image}
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="badge">
                <Users className="w-3 h-3 mr-1" />
                <span>Our Team</span>
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Meet the Experts</h2>
            <p className="text-foreground/70 max-w-xl mx-auto">
              Our interdisciplinary team combines expertise in marine biology, 
              artificial intelligence, and software engineering.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="glass-container rounded-xl p-6 text-center hover-card">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-ocean/20">
                  <img 
                    src={member.image}
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-foreground/70 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 wave-bg">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-foreground/80 mb-8">
              Explore our platform and join our mission to protect and preserve our oceans.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="glass-button ripple flex items-center group">
                <span>Explore Dashboard</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a 
                href="https://seadetection.streamlit.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-white/10 text-foreground/70 transition-all duration-300 hover:bg-white/5 hover:text-foreground flex items-center"
              >
                <span>Open Streamlit App</span>
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
