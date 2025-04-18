
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Globe, Info, Menu, X, Droplet, Rocket
} from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Ocean View', path: '/ocean-view', icon: <Globe className="w-4 h-4" /> },
    { name: 'Get Started', path: '/sea-trash', icon: <Rocket className="w-4 h-4" /> },
    { name: 'About', path: '/about', icon: <Info className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-2 glass-container backdrop-blur border-b border-white/5' : 'py-3 bg-background shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="relative">
              <Droplet className="h-6 w-6 text-ocean" />
              <span className="absolute inset-0 bg-ocean rounded-full animate-pulse-subtle opacity-30 group-hover:opacity-50 transition-opacity"></span>
            </span>
            <span className="font-bold text-lg tracking-tight ocean-text">Sea Guardian</span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link flex items-center space-x-1.5 ${
                  location.pathname === link.path ? 'active text-ocean' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden glass-container border-t border-white/5 mt-2 animate-slide-down">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg ${
                    location.pathname === link.path
                      ? 'bg-ocean/10 text-ocean'
                      : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
