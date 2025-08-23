"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/common/dashboard-header";
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from "@/components/institution-dashboard/dashboard-header.config";
import { TableHeader } from "@/components/institution-dashboard/locations/TableHeader";
import { LocationsTable } from "@/components/institution-dashboard/locations/LocationsTable";
import { FilterValues } from "@/components/institution-dashboard/locations/FilterDropdown";

import {
  getLocations,
  GetLocationsResponse,
  LocationWithRelations,
} from "@/server/actions/institution/query-locations";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners"; // react-spinner

interface LocationData {
  locationName: string;
  type: string;
  floor: string;
  room: string;
  staffLinked: string;
  status: string;
}

export default function LocationsPage() {
  const [rows, setRows] = useState<LocationData[]>([]);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [search, setSearch] = useState("");

  const {
    data: locations,
    isLoading: locationsLoading,
    isError: locationsError,
    refetch: refetchLocations,
  } = useQuery<GetLocationsResponse>({
    queryKey: ["locations"],
    queryFn: () => getLocations(),
  });

  function mapApiLocationsToTableData(
    locations: LocationWithRelations[]
  ): LocationData[] {
    return locations.map((loc) => ({
      locationName: loc.name,
      type: loc.type?.label ?? "_",
      floor: loc.floor ?? "_",
      room: loc.room ?? "_",
      staffLinked: "1 linked", // adjust if you have actual staff count
      status: loc.status,
    }));
  }

  useEffect(() => {
    if (locations?.data?.locations) {
      const tableData = mapApiLocationsToTableData(locations.data.locations);
      setRows(tableData);
    }
  }, [locations]);

  const filteredData = useMemo(() => {
    if (!filters) return rows;
    return rows.filter((item) => {
      const byStatus =
        !filters.status ||
        item.status.toLowerCase().includes(filters.status.toLowerCase());
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
  function handleCreated() {
    refetchLocations();
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

        {locationsLoading ? (
          <div className="flex justify-center mt-20">
            <ClipLoader size={50} color="#00bcf9" />
          </div>
        ) : locationsError ? (
          <div className="text-center mt-20 text-red-500">
            Failed to load locations. Please try refreshing the page.
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="text-center mt-20 text-gray-500 space-y-2">
            <p className="text-lg font-semibold">No Locations Yet</p>
            <p className="text-sm">
              You don’t have any locations added. Click the “Add Location”
              button above to create your first location.
            </p>
          </div>
        ) : (
          <LocationsTable data={filteredRows} />
        )}
      </main>
    </div>
  );
}
