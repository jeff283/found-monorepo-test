'use client';

import { DashboardHeader } from '@/components/institution-dashboard/dashboard-header';
import RolesTable, { sampleRoles } from '@/components/institution-dashboard/roles/RolesTable';
import { TableHeader } from '@/components/institution-dashboard/roles/TableHeader';

const mockUser = {
  name: "Victor Musembi",
  role: "Institution Admin",
  avatar: "/avatars/avatar-1.webp",
};

export default function RolesPage() {
  return (
    <>
      <DashboardHeader user={mockUser} />
      <main className="p-6 md:p-10">
        <TableHeader/>
        <div className="mt-8">
          <RolesTable roles={sampleRoles} />
        </div>
      </main>
    </>
  );
}
