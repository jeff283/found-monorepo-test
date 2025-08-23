"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AgentCard from "@/components/institution-dashboard/agents/AgentCard";
import { Pagination } from "@/components/shared/Pagination";
import { DashboardHeader } from "@/components/common/dashboard-header";
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from "@/components/institution-dashboard/dashboard-header.config";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddAgentDialog } from "@/components/institution-dashboard/agents/AddAgentDialog";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

import {
  getAgents,
  getAgentsResponse,
} from "@/server/actions/institution/query-agents";

function AgentsContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const addAgentOpen = searchParams.get("addAgent") === "true";
  const [addAgentPopoverOpen, setAddAgentPopoverOpen] = useState(false);
  const router = useRouter();

  // Fetch agents from backend
  const {
    data: agentsData,
    error: agentsError,
    isLoading: agentsLoading,
  } = useQuery<getAgentsResponse>({
    queryKey: ["agents", currentPage, itemsPerPage],
    queryFn: () =>
      getAgents({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        getAll: false,
      }),
  });

  useEffect(() => {
    if (addAgentOpen) {
      setAddAgentPopoverOpen(true);
      router.replace("/institution/agents", { scroll: false });
    }
  }, [addAgentOpen, router]);

  // Use fetched agents (fallback empty)
  const agents = agentsData?.data?.agents ?? [];

  // Filter agents by name, email, or location
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name?.toLowerCase().includes(search.toLowerCase()) ||
      agent.email?.toLowerCase().includes(search.toLowerCase()) ||
      agent.location?.toLowerCase().includes(search.toLowerCase())
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
                Staff{" "}
                <span className="text-muted-foreground text-base font-normal">
                  ({filteredAgents.length})
                </span>
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
                <AddAgentDialog
                  open={addAgentPopoverOpen}
                  onOpenChange={setAddAgentPopoverOpen}
                />
              </div>
            </div>
          </div>

          {/* Loading */}
          {agentsLoading && (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={40} />
            </div>
          )}

          {/* Error */}
          {agentsError && (
            <div className="text-center mt-20 text-red-500">
              <p className="text-lg font-semibold">Failed to load agents</p>
              <p className="text-sm">Please try again later.</p>
            </div>
          )}

          {/* No Agents */}
          {!agentsLoading && !agentsError && filteredAgents.length === 0 && (
            <div className="text-center mt-20 text-gray-500 space-y-2">
              <p className="text-lg font-semibold">No Agents Yet</p>
              <p className="text-sm">
                You don’t have any staff added. Click the{" "}
                <span className="font-semibold">“Add Agent”</span> button above
                to create your first agent.
              </p>
            </div>
          )}

          {/* Agents Grid */}
          {!agentsLoading && !agentsError && filteredAgents.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]">
                {filteredAgents.map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/institution/agents/${agent.id}`}
                    className="block"
                  >
                    <AgentCard
                      name={agent.name || "Unknown"}
                      email={agent.email || "Unknown"}
                      location={agent.location || "Unknown"}
                      foundItems={agent.foundItems || 0}
                      avatarUrl={agent.avatarUrl ?? "/avatars/avatar-1.webp"}
                    />
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(
                    (agentsData?.data?.total ?? 0) / itemsPerPage
                  )}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function AgentsPage() {
  return (
    <Suspense>
      <AgentsContent />
    </Suspense>
  );
}
