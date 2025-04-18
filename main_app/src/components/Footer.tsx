
import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Droplet className="h-6 w-6 text-ocean" />
              <span className="font-bold text-lg ocean-text">Sea Guardian</span>
            </Link>
            <p className="text-foreground/70 text-sm max-w-xs">
              Leveraging AI and data visualization to combat marine pollution and protect our oceans.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2 text-foreground/70">
              <li><Link to="/" className="hover:text-ocean transition-colors duration-200">Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-ocean transition-colors duration-200">Dashboard</Link></li>
              <li><Link to="/map" className="hover:text-ocean transition-colors duration-200">Map</Link></li>
              <li><Link to="/about" className="hover:text-ocean transition-colors duration-200">About</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2 text-foreground/70">
              <li><a href="#" className="hover:text-ocean transition-colors duration-200">Documentation</a></li>
              <li><a href="https://seadetection.streamlit.app/" target="_blank" rel="noopener noreferrer" className="hover:text-ocean transition-colors duration-200">Streamlit App</a></li>
              <li><a href="#" className="hover:text-ocean transition-colors duration-200">API</a></li>
              <li><a href="#" className="hover:text-ocean transition-colors duration-200">Contribute</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-foreground/70 hover:text-ocean transition-colors duration-200">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-ocean transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-ocean transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-ocean transition-colors duration-200">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-foreground/50 text-xs">
              Stay updated with our newsletter
            </p>
            <div className="mt-2 flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-secondary border border-white/5 py-2 px-3 text-sm rounded-l-lg focus:outline-none focus:ring-1 focus:ring-ocean w-full"
              />
              <button className="bg-ocean text-ocean-foreground py-2 px-3 text-sm rounded-r-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-foreground/50 text-sm">
          <p>© 2023 Sea Guardian. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <a href="#" className="hover:text-foreground transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
