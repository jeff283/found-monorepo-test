"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Mail, MoreVertical, Filter, ChevronDown } from "lucide-react";

import { DashboardHeader } from "@/components/internal-admin/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/DataTable";
import { Pagination } from "@/components/shared/Pagination";
import AgentCard from "@/components/institution-dashboard/agents/AgentCard";
import type { Column } from "@/components/shared/DataTable";

// Mock data
const institutions = [
  {
    id: "1",
    name: "Lumière Grand Hotel",
    location: "Nairobi, Kenya",
    foundItems: 30,
    agents: 30,
    lastActivity: "1 Hour",
    logoUrl: "/avatars/hotel.png",
  },
];

// Generate 30 agents
const agents = Array.from({ length: 30 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Agent ${i + 1}`,
  email: `agent${i + 1}@example.com`,
  location: i % 2 === 0 ? "Nairobi, Kenya" : "Mombasa, Kenya",
  foundItems: Math.floor(Math.random() * 50),
  avatarUrl: "/avatars/avatar-1.webp",
}));

// Generate 30 found item records
const records = Array.from({ length: 30 }, (_, i) => ({
  itemId: `#24${i + 1}`,
  description: `Lost item ${i + 1}`,
  type: i % 2 === 0 ? "Electronics" : "Clothing",
  reportDate: `17 Jun 2025 – 10:${(i % 60).toString().padStart(2, "0")} AM`,
  location: i % 3 === 0 ? "Near south office" : "Main lobby",
  foundDate: "17 Jun 2025",
  status: i % 2 === 0 ? "Active" : "Archived",
}));

export default function InstitutionProfilePage() {
  const { id } = useParams<{ id: string }>(); // ⬅️ Pull the dynamic route param here
  const router = useRouter();

  const institution = institutions.find((i) => i.id === id);
  const institutionAgents = agents; // Normally filter by institutionId
  const [recordsPage, setRecordsPage] = useState(1);
  const [agentsPage, setAgentsPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"found" | "agents">("found");

  if (!institution) return <p className="p-6">Institution not found.</p>;

  // Records Table
  type RecordType = (typeof records)[number];
  const columns: Column<RecordType>[] = [
    { header: "Item ID", accessor: "itemId" },
    { header: "Description", accessor: "description" },
    { header: "Type", accessor: "type" },
    { header: "Report Date", accessor: "reportDate" },
    { header: "Location", accessor: "location" },
    { header: "Found Date", accessor: "foundDate" },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
          {value}
        </span>
      ),
    },
    {
      header: "Action",
      render: () => (
        <button className="p-1 hover:bg-muted rounded-md">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      ),
    },
  ];

  const filteredRecords = records.filter((r) =>
    r.description.toLowerCase().includes(search.toLowerCase())
  );
  const recordsTotalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (recordsPage - 1) * itemsPerPage,
    recordsPage * itemsPerPage
  );

  const filteredAgents = institutionAgents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );
  const agentsTotalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (agentsPage - 1) * itemsPerPage,
    agentsPage * itemsPerPage
  );

  return (
    <div>
      <DashboardHeader
        user={{
          name: "John Snow",
          role: "Admin",
          avatar: "/avatars/avatar-1.webp",
        }}
      />

      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2 max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/internal-admin/institutions")}
          className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Institution Profile</span>
        </button>

        {/* Institution Card */}
        <div className="mt-4 bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src={institution.logoUrl}
                alt={institution.name}
                width={48}
                height={48}
                className="rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold">{institution.name}</p>
                <p className="text-sm text-muted-foreground">
                  {institution.location}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div>
                <p className="text-black opacity-70">Last Activity</p>
                <p className="font-bold opacity-100">{institution.lastActivity}</p>
              </div>
              <div className="w-px h-6 bg-border" />
              <div>
                <p className="text-black opacity-70">Found Items</p>
                <p className="font-bold opacity-100">{institution.foundItems}</p>
              </div>
              <div className="w-px h-6 bg-border" />
              <div>
                <p className="text-black opacity-70">Agents</p>
                <p className="font-bold opacity-100">{institution.agents}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="default" className="flex gap-2 items-center">
                <Mail className="w-4 h-4" /> Send Mail
              </Button>
              <button className="p-2 rounded-md hover:bg-muted border border-border">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2">
            <Button
              variant={activeTab === "found" ? "default" : "outline"}
              onClick={() => {
                setSearch("");
                setActiveTab("found");
              }}
            >
              Found Items
            </Button>
            <Button
              variant={activeTab === "agents" ? "default" : "outline"}
              onClick={() => {
                setSearch("");
                setActiveTab("agents");
              }}
            >
              Agents
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "found" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Records</h3>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">
                    {filteredRecords.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search records"
                    value={search}
                    onChange={(e) => {
                      setRecordsPage(1);
                      setSearch(e.target.value);
                    }}
                    className="w-64"
                  />
                  <Button variant="ghost" className="flex items-center gap-1">
                    Sort by <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-1">
                    <Filter className="w-4 h-4" /> Filter
                  </Button>
                </div>
              </div>
              <DataTable columns={columns} data={paginatedRecords} />
              <Pagination
                currentPage={recordsPage}
                totalPages={recordsTotalPages}
                onPageChange={setRecordsPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(n) => {
                  setItemsPerPage(n);
                  setRecordsPage(1);
                  setAgentsPage(1);
                }}
              />
            </>
          )}

          {activeTab === "agents" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Agents</h3>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">
                    {filteredAgents.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search agents"
                    value={search}
                    onChange={(e) => {
                      setAgentsPage(1);
                      setSearch(e.target.value);
                    }}
                    className="w-64"
                  />
                  <Button variant="ghost" className="flex items-center gap-1">
                    Sort by <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-1">
                    <Filter className="w-4 h-4" /> Filter
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]">
                {paginatedAgents.map((agent) => (
                  <AgentCard key={agent.id} {...agent} />
                ))}
              </div>
              <Pagination
                currentPage={agentsPage}
                totalPages={agentsTotalPages}
                onPageChange={setAgentsPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(n) => {
                  setItemsPerPage(n);
                  setAgentsPage(1);
                  setRecordsPage(1);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
