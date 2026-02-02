import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Plus } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import AddCreatorModal from '../creators/AddCreatorModal';

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Foresight</span>
          </Link>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Creator</span>
            </button>
          </div>
        </div>
      </div>

      <AddCreatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
