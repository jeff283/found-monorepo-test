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
import { Filter, Users, Mail, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InviteMemberDialog } from "@/components/institution-dashboard/members/InviteMemberDialog";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  getJoinRequests,
  getJoinRequestsCount,
  GetJoinRequestsCountResponse,
  updateJoinRequest,
} from "@/server/actions/institution/query-joinRequest";
import { Button } from "@/components/ui/button";
import { useOrgInfo } from "@/hooks/use-org-info";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function MembersContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "members" | "invitations" | "joinRequests"
  >("members");
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

  // Fetch Join Requests Count
  const { data: joinRequestsCountData } =
    useQuery<GetJoinRequestsCountResponse>({
      queryKey: ["joinRequestsCount"],
      queryFn: () => getJoinRequestsCount(),
    });

  // // Update Join Request
  // const updateJoinRequestMutation = useMutation({
  //   mutationFn: async (data) => await updateJoinRequest(data),
  // });

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
      <div className="w-full flex justify-center px-2 sm:px-4 mt-4">
        <div className="w-full max-w-[1295px]">
          <OrgHeader />
        </div>
      </div>
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
                  placeholder={`Search ${activeTab}`}
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
                setActiveTab(v as "members" | "invitations" | "joinRequests")
              }
            >
              {/* Mobile Dropdown Navigation */}
              <div className="md:hidden mb-4">
                <Select
                  value={activeTab}
                  onValueChange={(v) =>
                    setActiveTab(
                      v as "members" | "invitations" | "joinRequests"
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a tab" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="members">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Members ({members.length})
                      </div>
                    </SelectItem>
                    <SelectItem value="invitations">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Invitations ({invitations.length})
                      </div>
                    </SelectItem>
                    <SelectItem value="joinRequests">
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Join Requests ({joinRequestsCountData?.data?.count ?? 0}
                        )
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop Tab Navigation */}
              <TabsList className="hidden md:flex h-auto bg-transparent p-0 border-b border-border space-x-2 justify-start">
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
                <TabsTrigger
                  value="joinRequests"
                  className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 border-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary text-muted-foreground hover:text-foreground bg-transparent"
                >
                  <UserPlus className="inline-block w-4 h-4 mr-2" />
                  Join Requests ({joinRequestsCountData?.data?.count ?? 0})
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

              {/* Join Requests */}
              <TabsContent value="joinRequests" className="mt-6">
                <JoinRequestsTab />
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

// ---- Organization Header ----

function OrgHeader() {
  const { data, isLoading } = useOrgInfo();
  const org = data?.data;

  if (isLoading) return null;

  return (
    <div className="w-full bg-card rounded-lg p-4 flex items-center gap-4">
      {org?.imageUrl ? (
        <Image
          src={org.imageUrl}
          alt={org.name ?? "Org"}
          className="w-12 h-12 rounded-full object-cover"
          width={48}
          height={48}
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
          {(org?.name || "?").charAt(0)}
        </div>
      )}
      <div className="flex-1">
        <div className="font-semibold">{org?.name ?? "Organization"}</div>
        <div className="text-sm text-muted-foreground">
          {org?.emailDomain ? `@${org.emailDomain}` : "No email domain set"}
        </div>
      </div>
    </div>
  );
}

/** --- Join Requests Component --- */

function JoinRequestsTab() {
  const queryClient = useQueryClient();

  // 🔹 Fetch join requests
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["joinRequests"],
    queryFn: () => getJoinRequests(),
  });

  // 🔹 Handle approve/reject mutations
  const mutation = useMutation({
    mutationFn: updateJoinRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["joinRequests"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-20 text-red-500">
        <p className="text-lg font-semibold">Failed to load join requests</p>
        <p className="text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  const requests = data?.data?.joinRequests ?? [];

  if (requests.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500 space-y-2">
        <p className="text-lg font-semibold">No Join Requests</p>
        <p className="text-sm">
          When users request to join your organization, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <Card key={req.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{req.email}</h3>
                  <Badge
                    variant="secondary"
                    className={
                      req.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : req.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requested{" "}
                  {formatDistanceToNow(new Date(req.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              {req.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    disabled={mutation.isPending}
                    onClick={() =>
                      mutation.mutate({
                        id: req.id,
                        action: "approve",
                        role: "org:member",
                      })
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={mutation.isPending}
                    onClick={() =>
                      mutation.mutate({ id: req.id, action: "reject" })
                    }
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
