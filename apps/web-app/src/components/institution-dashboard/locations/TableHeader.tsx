"use client";

import {
  FilterDropdown,
  type FilterValues,
} from "@/components/found-items/FilterDropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Plus } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { AddLocationForm } from "./AddLocationForm";
import type { Location } from "@/db/drizzle/schema/institution/locations";

type TableHeaderProps = {
  onFilterApply: (filters: FilterValues) => void;
  onCreated: (row: Location | undefined) => void;
  locationCount: number;
  search: string;
  setSearch: (val: string) => void;
};

export function TableHeader({
  onFilterApply,
  onCreated,
  locationCount,
  search,
  setSearch,
}: TableHeaderProps) {
  return (
    <div className="w-full max-w-[1286px] mx-auto mb-4 px-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title and Count */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Locations</h2>
          <span className="text-cyan-500 bg-cyan-50 px-2 py-0.5 rounded-md text-sm">
            {locationCount}
          </span>
        </div>

        {/* Search, Sort, Filter, Add Location */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search locations"
              className="pl-8 pr-3 py-2 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Sort (placeholder) */}
          <Button
            variant="ghost"
            className="border border-input bg-background text-foreground px-3 flex items-center justify-center"
          >
            Sort by <span className="font-medium ml-1">Recents</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>

          {/* Filter */}
          <FilterDropdown onApply={onFilterApply} />

          {/* Add Location → SHEET */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="bg-cyan-50 text-cyan-600 hover:bg-cyan-100 border px-4 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Location
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[380px] sm:w-[480px] p-0">
              <SheetHeader className="px-4 pt-4">
                <SheetTitle>Add New Location</SheetTitle>
                <SheetDescription>
                  Create a building, desk, office, kiosk or zone inside your
                  institution.
                </SheetDescription>
              </SheetHeader>

              {/* Scroll container with extra bottom padding so the button never gets hidden */}
              <div className="px-4 pt-4 pb-24 overflow-y-auto max-h-[calc(100vh-6rem)]">
                <AddLocationForm
                  onCreated={(row) => {
                    onCreated(row);
                    // programmatically close the sheet after success
                    const btn = document.querySelector<HTMLButtonElement>(
                      '[data-close-sheet="1"]'
                    );
                    btn?.click();
                  }}
                />
              </div>

              {/* hidden closer to trigger programmatic close */}
              <SheetClose asChild>
                <button className="sr-only" data-close-sheet="1" />
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
