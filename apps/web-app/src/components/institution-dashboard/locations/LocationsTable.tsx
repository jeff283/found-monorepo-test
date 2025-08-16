'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/shared/Pagination';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

type Item = {
  locationName: string;
  type: string;
  floor?: string;
  room?: string;
  staffLinked?: string;
  status: string;
};

type LocationsTableProps = {
  data: Item[];
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  onStatusChange?: (item: Item, newStatus: string) => void;
};

const statusOptions = [
  'Active',
  'Inactive',
];

export function LocationsTable({
  data,
  onEdit,
  onDelete,
  onStatusChange,
}: LocationsTableProps) {
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
            <th className="px-4 py-3 font-medium text-gray-500">Location Name</th>
            <th className="px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="px-4 py-3 font-medium text-gray-500">Floor</th>
            <th className="px-4 py-3 font-medium text-gray-500">Room</th>
            <th className="px-4 py-3 font-medium text-gray-500">Staff Linked</th>
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
              <td className="px-4 py-3 whitespace-nowrap">{item.locationName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.type}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.floor}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.room}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.staffLinked}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full"
                >
                  {item.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreVertical className="w-5 h-5 mx-auto text-gray-600 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit && onEdit(item)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete && onDelete(item)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground mb-1">
                          Change Status
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {statusOptions.map((status) => (
                            <button
                              key={status}
                              type="button"
                              className={`px-2 py-1 rounded text-xs ${
                                item.status === status
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              onClick={() =>
                                onStatusChange && onStatusChange(item, status)
                              }
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
