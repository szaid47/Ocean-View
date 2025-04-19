
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 px-4 text-center text-xs text-gray-400">
      © {currentYear} Sea Guardian Trash Watch. All rights reserved.
    </footer>
  );
};

export default Footer;
