'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/shared/Pagination';

type Item = {
  id: string;
  locationName: string;
  address: string;
  state: string;
  city: string;
  institutionLinked: string;
  status: string;
};

type LocationsTableProps = {
  data: Item[];
};

export function LocationsTable({ data }: LocationsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full max-w-[1286px] mx-auto overflow-x-auto border rounded-xl bg-white">
      <table className="min-w-[900px] w-full text-sm text-left border-separate border-spacing-y-0.5">
        <thead className="bg-white">
          <tr className="text-muted-foreground border-b">
            <th className="px-4 py-3 font-medium text-gray-500">Item id</th>
            <th className="px-4 py-3 font-medium text-gray-500">Location Name</th>
            <th className="px-4 py-3 font-medium text-gray-500">Address</th>
            <th className="px-4 py-3 font-medium text-gray-500">State</th>
            <th className="px-4 py-3 font-medium text-gray-500">City</th>
            <th className="px-4 py-3 font-medium text-gray-500">Institution Linked</th>
            <th className="px-4 py-3 font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 font-medium text-gray-500 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } border-t`}
            >
              <td className="px-4 py-3 whitespace-nowrap">{item.id}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.locationName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.address}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.state}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.city}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.institutionLinked}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full"
                >
                  {item.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <MoreVertical className="w-5 h-5 mx-auto text-gray-600 cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(val) => {
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
