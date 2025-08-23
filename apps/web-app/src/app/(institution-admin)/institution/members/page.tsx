"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MemberCard from "@/components/institution-dashboard/members/MemberCard";
import { Pagination } from "@/components/shared/Pagination";
import { DashboardHeader } from "@/components/common/dashboard-header";
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from "@/components/institution-dashboard/dashboard-header.config";
import { Filter, Users, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InviteMemberDialog } from "@/components/institution-dashboard/members/InviteMemberDialog";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

import {
  getMembers,
  GetMembersResponse,
  getInvitations,
  GetInvitationsResponse,
} from "@/server/actions/institution/query-members";

function MembersContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"members" | "invitations">(
    "members"
  );
  const searchParams = useSearchParams();
  const inviteMemberOpen = searchParams.get("inviteMember") === "true";
  const [inviteMemberDialogOpen, setInviteMemberDialogOpen] = useState(false);
  const router = useRouter();

  // Fetch members from backend
  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useQuery<GetMembersResponse>({
    queryKey: ["members", currentPage, itemsPerPage],
    queryFn: () =>
      getMembers({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        getAll: false,
      }),
  });

  // Fetch invitations
  const {
    data: invitationsData,
    error: invitationsError,
    isLoading: invitationsLoading,
  } = useQuery<GetInvitationsResponse>({
    queryKey: ["invitations"],
    queryFn: () => getInvitations(),
  });

  useEffect(() => {
    if (inviteMemberOpen) {
      setInviteMemberDialogOpen(true);
      router.replace("/institution/members", { scroll: false });
    }
  }, [inviteMemberOpen, router]);

  // Use fetched data (fallback empty)
  const members = membersData?.data?.members ?? [];
  const invitations = invitationsData?.data?.invitations ?? [];

  // Filter members by name or email
  const filteredMembers = members.filter(
    (member) =>
      member.name?.toLowerCase().includes(search.toLowerCase()) ||
      member.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Filter invitations by email
  const filteredInvitations = invitations.filter((invitation) =>
    invitation.emailAddress.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                Organization Members{" "}
                <span className="text-muted-foreground text-base font-normal">
                  (
                  {activeTab === "members"
                    ? filteredMembers.length
                    : filteredInvitations.length}
                  )
                </span>
              </h2>
              <div className="flex flex-wrap justify-end items-center gap-3 w-full sm:w-auto">
                <Input
                  type="text"
                  placeholder={`Search ${activeTab === "members" ? "members" : "invitations"}`}
                  className="px-4 py-2 border border-input rounded-lg text-sm w-full sm:w-[240px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="button-text-small px-4 py-2 border border-input rounded-lg text-muted-foreground flex items-center gap-2">
                  <Filter size={16} /> Filter
                </button>
                <InviteMemberDialog
                  open={inviteMemberDialogOpen}
                  onOpenChange={setInviteMemberDialogOpen}
                />
              </div>
            </div>

            {/* Tab Navigation with Custom Styling */}
            <Tabs
              value={activeTab}
              onValueChange={(v) =>
                setActiveTab(v as "members" | "invitations")
              }
            >
              <TabsList className="h-auto bg-transparent p-0 border-b border-border space-x-2 justify-start">
                <TabsTrigger
                  value="members"
                  className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 border-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary text-muted-foreground hover:text-foreground bg-transparent"
                >
                  <Users className="inline-block w-4 h-4 mr-2" />
                  Members ({members.length})
                </TabsTrigger>
                <TabsTrigger
                  value="invitations"
                  className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 border-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary text-muted-foreground hover:text-foreground bg-transparent"
                >
                  <Mail className="inline-block w-4 h-4 mr-2" />
                  Invitations ({invitations.length})
                </TabsTrigger>
              </TabsList>

              {/* Loading */}
              {(membersLoading || invitationsLoading) && (
                <div className="flex justify-center items-center h-64">
                  <ClipLoader size={40} />
                </div>
              )}

              {/* Error */}
              {(membersError || invitationsError) && (
                <div className="text-center mt-20 text-red-500">
                  <p className="text-lg font-semibold">Failed to load data</p>
                  <p className="text-sm">Please try again later.</p>
                </div>
              )}

              <TabsContent value="members" className="mt-6">
                {!membersLoading && !membersError && (
                  <>
                    {/* No Members */}
                    {filteredMembers.length === 0 && (
                      <div className="text-center mt-20 text-gray-500 space-y-2">
                        <p className="text-lg font-semibold">No Members Yet</p>
                        <p className="text-sm">
                          You don&apos;t have any members in your organization.
                          Click the{" "}
                          <span className="font-semibold">
                            &quot;Invite Member&quot;
                          </span>{" "}
                          button above to invite your first member.
                        </p>
                      </div>
                    )}

                    {/* Members Grid */}
                    {filteredMembers.length > 0 && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]">
                          {filteredMembers.map((member) => (
                            <MemberCard
                              key={member.id}
                              name={member.name || "Unknown"}
                              email={member.email || "Unknown"}
                              role={member.role}
                              joinedAt={member.joinedAt}
                              avatarUrl={member.avatarUrl}
                            />
                          ))}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-4">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(
                              (membersData?.data?.total ?? 0) / itemsPerPage
                            )}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={setItemsPerPage}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="invitations" className="mt-6">
                {!invitationsLoading && !invitationsError && (
                  <>
                    {/* No Invitations */}
                    {filteredInvitations.length === 0 && (
                      <div className="text-center mt-20 text-gray-500 space-y-2">
                        <p className="text-lg font-semibold">
                          No Pending Invitations
                        </p>
                        <p className="text-sm">
                          All invitations have been accepted or expired. Click
                          the{" "}
                          <span className="font-semibold">
                            &quot;Invite Member&quot;
                          </span>{" "}
                          button above to send new invitations.
                        </p>
                      </div>
                    )}

                    {/* Invitations List */}
                    {filteredInvitations.length > 0 && (
                      <div className="space-y-4">
                        {filteredInvitations.map((invitation) => (
                          <Card
                            key={invitation.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold">
                                      {invitation.emailAddress}
                                    </h3>
                                    <Badge
                                      variant="secondary"
                                      className={getStatusColor(
                                        invitation.status
                                      )}
                                    >
                                      {invitation.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        invitation.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Role: {invitation.role.replace("org:", "")}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Sent{" "}
                                    {formatDistanceToNow(invitation.createdAt, {
                                      addSuffix: true,
                                    })}
                                    {invitation.status === "pending" && (
                                      <span className="ml-2">
                                        • Expires{" "}
                                        {formatDistanceToNow(
                                          invitation.expiresAt,
                                          {
                                            addSuffix: true,
                                          }
                                        )}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

export default function MembersPage() {
  return (
    <Suspense>
      <MembersContent />
    </Suspense>
  );
}
