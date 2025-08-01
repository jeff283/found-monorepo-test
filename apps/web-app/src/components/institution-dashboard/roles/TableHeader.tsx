'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

export function TableHeader() {
  const RolesCount = 12;

  return (
    <div className="w-full max-w-[1286px] mx-auto mb-4 px-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title and Count */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Roles</h2>
          <span className="text-cyan-500 bg-cyan-50 px-2 py-0.5 rounded-md text-sm">
            {RolesCount}
          </span>
        </div>

        {/* Search, Sort, Filter, Add Role */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search roles"
              className="pl-8 pr-3 py-2 w-full"
            />
          </div>



          <Button
            variant="ghost"
            className="bg-cyan-50 text-cyan-600 hover:bg-cyan-100 border px-4 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
