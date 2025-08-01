'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/shared/Pagination';

type Item = {
  id: string;
  description: string;
  type: string;
  ClaimsDate: string;
  location: string;
  foundDate: string;
  status: string;
};

type ClaimsTableProps = {
  data: Item[];
};

export function ClaimsTable({ data }: ClaimsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full max-w-[1286px] mx-auto overflow-x-auto border rounded-xl bg-white">
      <table className="min-w-[768px] w-full text-sm text-left border-separate border-spacing-y-0.5">
        <thead className="bg-white">
          <tr className="text-muted-foreground border-b">
            <th className="px-4 py-3 text-foreground font-medium whitespace-nowrap">Item ID</th>
            <th className="px-4 py-3 text-foreground font-medium whitespace-nowrap">Description</th>
            <th className="px-4 py-3 text-foreground font-medium whitespace-nowrap">Type</th>
            <th className="px-4 py-3 text-foreground font-medium whitespace-nowrap">Claims Date</th>
            <th className="px-4 py-3 text-foreground font-medium whitespace-nowrap">Location</th>
            <th className="px-4 py-3 text-foreground font-medium whitespace-nowrap">Found Date</th>
            <th className="px-4 py-3 text-foreground font-medium whitespace-nowrap">Status</th>
            <th className="px-4 py-3 text-right text-foreground font-medium whitespace-nowrap">Action</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((item, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? 'bg-white' : 'bg-muted/40'
              } border-t hover:bg-muted/30`}
            >
              <td className="px-4 py-3 whitespace-nowrap">{item.id}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.description}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.type}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.ClaimsDate}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.location}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.foundDate}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge
                  variant="secondary"
                  className="bg-transparent text-green-600 border border-green-300"
                >
                  {item.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <MoreVertical className="w-5 h-5 cursor-pointer mx-auto" />
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
