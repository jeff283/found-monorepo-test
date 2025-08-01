'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/institution-dashboard/dashboard-header';
import { TableHeader } from '@/components/found-items/TableHeader';
import { RecordsTable } from '@/components/found-items/RecordsTable';
import { FilterValues } from '@/components/found-items/FilterDropdown';

const mockUser = {
  name: "Victor Musembi",
  role: "Institution Admin",
  avatar: "/avatars/avatar-1.webp",
};

const sampleData = Array(42).fill(null).map((_, i) => ({
  id: `#24${i + 1}`,
  description: 'Lost phone',
  type: 'Electronics',
  reportDate: '17 Jan 2025 - 10:00 AM',
  location: 'Near south office',
  foundDate: '17 Jun 2025',
  status: 'Active',
}));

export default function FoundItemsPage() {
  const [filters, setFilters] = useState<FilterValues | null>(null);

  const handleApplyFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const filteredData = sampleData.filter(item => {
    if (!filters) return true;
    return (
      (!filters.type || item.type.toLowerCase().includes(filters.type)) &&
      (!filters.status || item.status.toLowerCase().includes(filters.status))
    );
  });

  return (
    <div>
      <DashboardHeader user={mockUser} />
      <main className="p-6 md:p-10">
        {/* <h1 className="title-2 mb-6">Found Items</h1> */}
        <TableHeader onFilterApply={handleApplyFilter} />
        <RecordsTable data={filteredData} />
      </main>
    </div>
  );
}
