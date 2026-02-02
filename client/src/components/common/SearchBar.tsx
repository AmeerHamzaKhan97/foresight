import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanseInput = (input: string) => {
    return input.replace(/[@\s]/g, '').trim();
  };

  const handleSearch = (searchTerm: string) => {
    const cleansed = cleanseInput(searchTerm);
    if (cleansed) {
      navigate(`/search?q=${cleansed}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        handleSearch(value);
      }
    }, 500); // 500ms debounce
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    handleSearch(query);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-zinc-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-full bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
          placeholder="Search by Twitter handle..."
        />
      </div>
    </form>
  );
};

export default SearchBar;
