import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white/50">Foresight</span>
          </div>
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Foresight. All rights reserved. Built for creator credibility.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
