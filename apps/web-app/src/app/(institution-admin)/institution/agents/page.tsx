'use client';

import { useState } from 'react';
import Link from 'next/link';
import AgentCard from '@/components/institution-dashboard/agents/AgentCard';
import { Pagination } from '@/components/shared/Pagination';
import { DashboardHeader } from '@/components/common/dashboard-header';
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from '@/components/institution-dashboard/dashboard-header.config';
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AddAgentPopover } from '@/components/institution-dashboard/agents/AddAgentDialog';

const agents = [
  {
    id: "1",
    name: "Mugisha Samuel",
    email: "mugishasamuel@gmail.com",
    location: "Miami, Florida",
    foundItems: 24,
    avatarUrl: "/avatars/avatar-1.webp",
  },
  {
    id: "2",
    name: "Joyce Achieng",
    email: "joyce.achieng@foundly.io",
    location: "Nairobi, Kenya",
    foundItems: 18,
    avatarUrl: "/avatars/avatar-2.webp",
  },
  {
    id: "3",
    name: "David Kim",
    email: "dkim@foundly.io",
    location: "New York Campus",
    foundItems: 10,
    avatarUrl: "/avatars/avatar-3.webp",
  },
  {
    id: "4",
    name: "Amina Yusuf",
    email: "amina.yusuf@foundly.io",
    location: "Doha, Qatar",
    foundItems: 7,
    avatarUrl: "/avatars/avatar-4.webp",
  },
  {
    id: "5",
    name: "Carlos Rodriguez",
    email: "carlos@foundly.io",
    location: "San Jose, CA",
    foundItems: 31,
    avatarUrl: "/avatars/avatar-5.webp",
  },
  {
    id: "6",
    name: "Fatima Noor",
    email: "fatima.noor@foundly.io",
    location: "Mombasa Office",
    foundItems: 14,
    avatarUrl: "/avatars/avatar-3.webp",
  },
  {
    id: "7",
    name: "Aisha Bello",
    email: "aisha.bello@foundly.io",
    location: "Lagos, Nigeria",
    foundItems: 22,
    avatarUrl: "/avatars/avatar-4.webp",
  }
];

export default function AgentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Filter agents by name, email, or location
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.email.toLowerCase().includes(search.toLowerCase()) ||
      agent.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DashboardHeader
        user={defaultUser}
        navItems={defaultNavItems}
        profileDropdown={ProfileDropdownContent(defaultUser)}
      />
      <div className="w-full flex justify-center bg-background min-h-[982px] px-2 sm:px-4">
        <div className="w-full max-w-[1295px] min-h-[776px] py-6 space-y-6 relative">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="title-4">
                Staff <span className="text-muted-foreground text-base font-normal">({filteredAgents.length})</span>
              </h2>
              <div className="flex flex-wrap justify-end items-center gap-3 w-full sm:w-auto">
                <Input
                  type="text"
                  placeholder="Search staff"
                  className="px-4 py-2 border border-input rounded-lg text-sm w-full sm:w-[240px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="button-text-small px-4 py-2 border border-input rounded-lg text-muted-foreground flex items-center gap-2">
                  <Filter size={16} /> Filter
                </button>
                <AddAgentPopover />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]">
            {filteredAgents.map((agent) => (
              <Link key={agent.id} href={`/institution/agents/${agent.id}`} className="block">
                <AgentCard
                  name={agent.name}
                  email={agent.email}
                  location={agent.location}
                  foundItems={agent.foundItems}
                  avatarUrl={agent.avatarUrl}
                />
              </Link>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-4">
            <Pagination
              currentPage={currentPage}
              totalPages={3}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
