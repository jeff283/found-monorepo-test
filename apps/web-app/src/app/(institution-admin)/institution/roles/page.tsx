'use client';

import { DashboardHeader } from '@/components/common/dashboard-header';
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from '@/components/institution-dashboard/dashboard-header.config';
import RolesTable, { sampleRoles } from '@/components/institution-dashboard/roles/RolesTable';
import { TableHeader } from '@/components/institution-dashboard/roles/TableHeader';

export default function RolesPage() {
  return (
    <>
      <DashboardHeader
        user={defaultUser}
        navItems={defaultNavItems}
        profileDropdown={ProfileDropdownContent(defaultUser)}
      />
      <main className="p-6 md:p-10">
        <TableHeader />
        <div className="mt-8">
          <RolesTable roles={sampleRoles} />
        </div>
      </main>
    </>
  );
}
