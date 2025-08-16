"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/common/dashboard-header";
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from "@/components/institution-dashboard/dashboard-header.config";
import { TableHeader } from "@/components/institution-dashboard/locations/TableHeader";
import { LocationsTable } from "@/components/institution-dashboard/locations/LocationsTable";
import { FilterValues } from "@/components/institution-dashboard/locations/FilterDropdown";
import type { NewLocation } from "@/components/institution-dashboard/locations/AddLocationForm";

const sampleData = Array.from({ length: 28 }, (_, i) => ({
  locationName: `Location ${i + 1}`,
  type: i % 2 === 0 ? "desk" : "office",
  floor: `${(i % 5) + 1}`,
  room: `Room ${((i % 3) + 1)}`,
  staffLinked: `${1 + (i % 3)} linked`,
  status: i % 2 === 0 ? "Active" : "Inactive",
}));

export default function LocationsPage() {
  const [rows, setRows] = useState(sampleData);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!filters) return rows;
    return rows.filter((item) => {
      const byStatus = !filters.status || item.status.toLowerCase().includes(filters.status.toLowerCase());
      return byStatus;
    });
  }, [rows, filters]);

  const filteredRows = filteredData.filter(
    (row) =>
      row.locationName.toLowerCase().includes(search.toLowerCase()) ||
      row.type.toLowerCase().includes(search.toLowerCase()) ||
      (row.floor ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (row.room ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (row.staffLinked ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Add new location to table
  function handleCreated(row: NewLocation) {
    setRows((prev) => [
      {
        locationName: row.locationName,
        type: row.type,
        floor: row.floor ?? "",
        room: row.room ?? "",
        staffLinked: row.staffLinked ?? "1 linked",
        status: row.status ?? "Active",
      },
      ...prev,
    ]);
  }

  return (
    <div>
      <DashboardHeader
        user={defaultUser}
        navItems={defaultNavItems}
        profileDropdown={ProfileDropdownContent(defaultUser)}
      />

      <main className="p-6 md:p-10">
        <TableHeader
          onFilterApply={setFilters}
          onCreated={handleCreated}
          locationCount={filteredRows.length}
          search={search}
          setSearch={setSearch}
        />
        <LocationsTable data={filteredRows} />
      </main>
    </div>
  );
}
