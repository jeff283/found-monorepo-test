'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/common/dashboard-header';
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from '@/components/institution-dashboard/dashboard-header.config';
import { TableHeader } from '@/components/found-items/TableHeader';
import { RecordsTable } from '@/components/found-items/RecordsTable';
import { FilterValues } from '@/components/found-items/FilterDropdown';

const sampleData = Array(42)
  .fill(null)
  .map((_, i) => ({
    id: `#24${i + 1}`,
    description: 'Lost phone',
    type: 'Electronics',
    reportDate: '17 Jan 2025 - 10:00 AM',
    location: 'Near south office',
    foundDate: '17 Jun 2025',
    status: 'Active',
  }));

function FoundItemsContent() {
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('reportFound') === 'true') {
      setReportOpen(true);
      router.replace('/institution/found-items', { scroll: false });
    }
  }, [searchParams, router]);

  const handleApplyFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const filteredData = sampleData.filter((item) => {
    if (!filters) return true;
    return (
      (!filters.type || item.type.toLowerCase().includes(filters.type)) &&
      (!filters.status || item.status.toLowerCase().includes(filters.status))
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
        <TableHeader
          onFilterApply={handleApplyFilter}
          reportOpen={reportOpen}
          setReportOpen={setReportOpen}
        />
        <RecordsTable data={filteredData} />
      </main>
    </div>
  );
}

export default function FoundItemsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FoundItemsContent />
    </Suspense>
  );
}
