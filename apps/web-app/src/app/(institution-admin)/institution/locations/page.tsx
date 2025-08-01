'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/institution-dashboard/dashboard-header';
import { TableHeader } from '@/components/institution-dashboard/locations/TableHeader';
import { LocationsTable } from '@/components/institution-dashboard/locations/LocationsTable';
import { FilterValues } from '@/components/institution-dashboard/locations/FilterDropdown';

const mockUser = {
  name: "Victor Musembi",
  role: "Institution Admin",
  avatar: "/avatars/avatar-1.webp",
};


const sampleData = Array.from({ length: 30 }, (_, i) => ({
  id: `#${248 + i}`,
  locationName: `Location ${i + 1}`,
  address: '535 W 114th St',
  state: 'NY',
  city: 'New York',
  institutionLinked: `${1 + (i % 3)} linked`,
  status: i % 2 === 0 ? 'Active' : 'Inactive',
}));


export default function FoundItemsPage() {
  const [filters, setFilters] = useState<FilterValues | null>(null);

  const handleApplyFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const filteredData = sampleData.filter(item => {
    if (!filters) return true;
    return (
      (!filters.status || item.status.toLowerCase().includes(filters.status.toLowerCase()))
    );
  });

  return (
    <div>
      <DashboardHeader user={mockUser} />
      <main className="p-6 md:p-10">
        {/* <h1 className="title-2 mb-6">Found Items</h1> */}
        <TableHeader onFilterApply={handleApplyFilter} />
        <LocationsTable data={filteredData} />
      </main>
    </div>
  );
}
