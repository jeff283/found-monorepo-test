'use client';

import { FilterDropdown, FilterValues } from './FilterDropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, Plus } from 'lucide-react';

type TableHeaderProps = {
  onFilterApply: (filters: FilterValues) => void;
};

export function TableHeader({ onFilterApply }: TableHeaderProps) {
  const claimsCount = 12;

  return (
    <div className="w-full max-w-[1286px] mx-auto mb-4 px-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title and Count */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Claims</h2>
          <span className="text-cyan-500 bg-cyan-50 px-2 py-0.5 rounded-md text-sm">
            {claimsCount}
          </span>
        </div>

        {/* Search, Sort, Filter, Claims */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search claims"
              className="pl-8 pr-3 py-2 w-full"
            />
          </div>

          {/* Sort Button */}
          <Button
            variant="ghost"
            className="border border-input bg-background text-foreground px-3 flex items-center justify-center"
          >
            Sort by <span className="font-medium ml-1">Recents</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>

          {/* Filter */}
          <FilterDropdown onApply={onFilterApply} />

          {/* Claims Found */}
          <Button
            variant="ghost"
            className="bg-cyan-50 text-cyan-600 hover:bg-cyan-100 border px-4 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Claims Found
          </Button>
        </div>
      </div>
    </div>
  );
}
