import { Search, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string, location: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    // On appelle la fonction passée par App.tsx
    onSearch(query || "Java", location || "Maroc");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] border border-white/10 bg-white/5 p-2 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 focus-within:border-[#3b82f6]/50">
          <Search className="h-5 w-5 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Compétence (Java, Python...)"
            className="flex-1 bg-transparent text-sm text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 focus-within:border-[#3b82f6]/50 md:w-64">
          <MapPin className="h-5 w-5 text-white/40" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lieu (Casablanca...)"
            className="flex-1 bg-transparent text-sm text-white focus:outline-none"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-8 py-3 text-sm font-medium text-white shadow-lg shadow-[#3b82f6]/30"
        >
          <span>Scanner le marché</span>
        </motion.button>
      </div>
    </motion.div>
  );
}