'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Mail,
  MoreVertical,
  Filter,
  ChevronDown,
} from 'lucide-react';

import { DashboardHeader } from '@/components/common/dashboard-header';
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from '@/components/institution-dashboard/dashboard-header.config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import type { Column } from '@/components/shared/DataTable';

const agents = [
  {
    id: '1',
    name: 'Mugisha Samuel',
    email: 'mugishasamuel@gmail.com',
    location: 'Miami, Florida',
    foundItems: 24,
    avatarUrl: '/avatars/avatar-1.webp',
  },
  {
    id: '2',
    name: 'Joyce Achieng',
    email: 'joyce.achieng@foundly.io',
    location: 'Nairobi, Kenya',
    foundItems: 18,
    avatarUrl: '/avatars/avatar-2.webp',
  },
  {
    id: '3',
    name: 'David Kim',
    email: 'dkim@foundly.io',
    location: 'New York Campus',
    foundItems: 10,
    avatarUrl: '/avatars/avatar-3.webp',
  },
  {
    id: '4',
    name: 'Amina Yusuf',
    email: 'amina.yusuf@foundly.io',
    location: 'Doha, Qatar',
    foundItems: 7,
    avatarUrl: '/avatars/avatar-4.webp',
  },
  {
    id: '5',
    name: 'Carlos Rodriguez',
    email: 'carlos@foundly.io',
    location: 'San Jose, CA',
    foundItems: 31,
    avatarUrl: '/avatars/avatar-5.webp',
  },
  {
    id: '6',
    name: 'Fatima Noor',
    email: 'fatima.noor@foundly.io',
    location: 'Mombasa Office',
    foundItems: 14,
    avatarUrl: '/avatars/avatar-3.webp',
  },
];

const records = [
  ...Array.from({ length: 5 }, (_, i) => ({
    agentId: '1',
    itemId: `#24${i + 1}`,
    description: 'Lost phone',
    type: 'Electronics',
    reportDate: `17 Jun 2025 – 10:${i} AM`,
    location: 'Near south office',
    foundDate: '17 Jun 2025',
    status: 'Active',
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    agentId: '2',
    itemId: `#32${i + 1}`,
    description: 'Wallet',
    type: 'Accessories',
    reportDate: `15 Jun 2025 – 2:${i}0 PM`,
    location: 'Main gate',
    foundDate: '16 Jun 2025',
    status: 'Active',
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    agentId: '3',
    itemId: `#41${i + 1}`,
    description: 'Backpack',
    type: 'Bags',
    reportDate: `14 Jun 2025 – 9:0${i} AM`,
    location: 'Library',
    foundDate: '15 Jun 2025',
    status: i % 2 === 0 ? 'Claimed' : 'Pending',
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    agentId: '4',
    itemId: `#51${i + 1}`,
    description: 'Laptop',
    type: 'Electronics',
    reportDate: `13 Jun 2025 – 11:0${i} AM`,
    location: 'Main gate',
    foundDate: '14 Jun 2025',
    status: 'Pending',
  })),
  ...Array.from({ length: 7 }, (_, i) => ({
    agentId: '5',
    itemId: `#61${i + 1}`,
    description: 'ID Card',
    type: 'Cards',
    reportDate: `12 Jun 2025 – 3:${i}0 PM`,
    location: 'Cafeteria',
    foundDate: '13 Jun 2025',
    status: 'Unclaimed',
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    agentId: '6',
    itemId: `#73${i + 1}`,
    description: 'USB Drive',
    type: 'Electronics',
    reportDate: `11 Jun 2025 – 12:0${i} PM`,
    location: 'IT Lab',
    foundDate: '12 Jun 2025',
    status: i % 2 === 0 ? 'Claimed' : 'Unclaimed',
  })),
];

export default function AgentProfilePage(props: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(props.params);
  const router = useRouter();

  const agent = agents.find((a) => a.id === agentId);
  const agentRecords = records.filter((r) => r.agentId === agentId);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const pageSize = 5;
  const totalPages = Math.ceil(agentRecords.length / pageSize);

  const filteredRecords = agentRecords.filter((r) =>
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (!agent) return <p className="p-6">Agent not found.</p>;

  type AgentRecord = typeof agentRecords[number];

  const columns: Column<AgentRecord>[] = [
    { header: 'Item ID', accessor: 'itemId' },
    { header: 'Description', accessor: 'description' },
    { header: 'Type', accessor: 'type' },
    { header: 'Report Date', accessor: 'reportDate' },
    { header: 'Location', accessor: 'location' },
    { header: 'Found Date', accessor: 'foundDate' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
          {value}
        </span>
      ),
    },
    {
      header: 'Action',
      render: () => (
        <button className="p-1 hover:bg-muted rounded-md">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <DashboardHeader
        user={defaultUser}
        navItems={defaultNavItems}
        profileDropdown={ProfileDropdownContent(defaultUser)}
      />

      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2 max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/institution-dashboard/agents')}
          className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Agent profile</span>
        </button>

        {/* Agent Card */}
        <div className="mt-4 bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4">
              <Image
                src={agent.avatarUrl}
                alt={agent.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{agent.name}</p>
                <p className="text-sm text-muted-foreground">{agent.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-black">Last Activity</p>
                <p>1 Hour</p>
              </div>
              <div className="w-px h-6 bg-border" />
              <div>
                <p className="font-medium text-black">Location</p>
                <p>{agent.location}</p>
              </div>
              <div className="w-px h-6 bg-border" />
              <div>
                <p className="font-medium text-black">Found Items</p>
                <p>{agent.foundItems}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="default" className="flex gap-2 items-center">
                <Mail className="w-4 h-4" />
                Send Mail
              </Button>
              <button className="p-2 rounded-md hover:bg-muted border border-border">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Records Header + Filters */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">Records</h3>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">
                {filteredRecords.length}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto sm:flex-1 sm:justify-end">
              <Input
                placeholder="Search records"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="w-full sm:w-64"
              />
              <Button variant="ghost" className="flex items-center gap-1">
                Sort by <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="flex items-center gap-1">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>

          <DataTable columns={columns} data={paginatedRecords} />

          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              itemsPerPage={pageSize}
              onItemsPerPageChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
