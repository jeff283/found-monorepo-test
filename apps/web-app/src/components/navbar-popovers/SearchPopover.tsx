
import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Search } from 'lucide-react';

export function SearchPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button aria-label="Open search popover" className="bg-transparent p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400">
          <Search className="w-5 h-5 text-black" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="right-0 top-full mt-2 w-72 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-100">
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-cyan-300"
          placeholder="Search something"
        />
        <div className="mt-4 text-xs text-gray-500 font-medium">RECENT SEARCHES</div>
        <ul className="text-sm text-gray-800 mt-1 space-y-2">
          <li className="py-1 border-b last:border-b-0">Black Dell laptop with sticker</li>
          <li className="py-1 border-b last:border-b-0">Lost ID card - James N.</li>
          <li className="py-1 border-b last:border-b-0">iPhone 13 blue found near cafeteria</li>
          <li className="py-1">Red Samsonite suitcase</li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
