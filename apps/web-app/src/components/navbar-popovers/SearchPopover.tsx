'use client';

import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

export function SearchPopover({ onSearch }: { onSearch?: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const runSearch = (term: string) => {
    if (!term.trim()) return;

    // callback to parent
    if (onSearch) {
      onSearch(term.trim());
    }

    toast.success(`Searching for "${term.trim()}"`);

    // update recent searches (no duplicates, max 5)
    setRecentSearches((prev) => {
      const updated = [term.trim(), ...prev.filter((s) => s !== term.trim())];
      return updated.slice(0, 5);
    });

    setSearchTerm('');
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runSearch(searchTerm);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Open search popover"
          className="bg-transparent p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <Search className="w-5 h-5 text-black" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="right-0 top-full mt-2 w-72 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-100">
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-cyan-300"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKey}
          aria-label="Search input"
        />

        {recentSearches.length > 0 && (
          <>
            <div className="mt-4 text-xs text-gray-500 font-medium">RECENT SEARCHES</div>
            <ul className="text-sm text-gray-800 mt-1 space-y-2">
              {recentSearches.map((term, i) => (
                <li
                  key={i}
                  onClick={() => runSearch(term)}
                  className="py-1 border-b last:border-b-0 cursor-pointer hover:text-cyan-600"
                >
                  {term}
                </li>
              ))}
            </ul>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
