'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/common/dashboard-header';
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from '@/components/institution-dashboard/dashboard-header.config';
import { TableHeader } from '@/components/institution-dashboard/locations/TableHeader';
import { LocationsTable } from '@/components/institution-dashboard/locations/LocationsTable';
import { FilterValues } from '@/components/institution-dashboard/locations/FilterDropdown';

const sampleData = Array.from({ length: 30 }, (_, i) => ({
  id: `#${248 + i}`,
  locationName: `Location ${i + 1}`,
  address: '535 W 114th St',
  state: 'NY',
  city: 'New York',
  institutionLinked: `${1 + (i % 3)} linked`,
  status: i % 2 === 0 ? 'Active' : 'Inactive',
}));

export default function LocationsPage() {
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
      <DashboardHeader
        user={defaultUser}
        navItems={defaultNavItems}
        profileDropdown={ProfileDropdownContent(defaultUser)}
      />
      <main className="p-6 md:p-10">
        <TableHeader onFilterApply={handleApplyFilter} />
        <LocationsTable data={filteredData} />
      </main>
    </div>
  );
}
