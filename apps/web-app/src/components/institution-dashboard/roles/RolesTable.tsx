'use client';

import { useState } from 'react';
import { Trash2, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/shared/Pagination';

type Role = {
  id?: number;
  role: string;
  totalUsers: number;
  permissions: string[];
};

type RolesTableProps = {
  roles: Role[];
};

export const sampleRoles: Role[] = Array.from({ length: 24 }, (_, i) => ({
  role:
    i % 3 === 0
      ? 'Super Admin'
      : i % 3 === 1
      ? 'Institution Staff'
      : 'Institution Admin',
  totalUsers: 5,
  permissions: [
    'All admin controls',
    'All admin controls',
    'Add , View and Edit  claims',
    'And 4 more',
  ],
  id: i + 1,
}));

export default function RolesTable({ roles }: RolesTableProps) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedRoles = roles.slice(startIdx, endIdx);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedRoles.map((role, index) => (
          <Card key={role.id ?? index} className="bg-white shadow-sm border border-transparent rounded-xl p-4">
            <CardContent className="p-0 space-y-2">
              <h3 className="font-semibold text-base text-gray-800">{role.role}</h3>
              <p className="text-sm text-gray-400">
                Total users with this role: {role.totalUsers}
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                {role.permissions.map((perm, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 mt-1 text-xs">•</span>
                    {perm}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-2 pt-4 border-t mt-2">
                <button className="p-1.5 text-red-600 rounded hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-blue-600 rounded hover:bg-blue-50">
                  <PencilLine className="w-4 h-4" />
                </button>
                <Button
                  variant="outline"
                  className="ml-auto rounded-full px-4 py-1 text-xs border-gray-300 text-gray-600"
                >
                  View role
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
