"use client"
import { getAgents, getAgentsResponse } from "@/server/actions/institution/query-agents";
import { getMembers, GetMembersResponse } from "@/server/actions/institution/query-members";
import { getLocations, GetLocationsResponse } from "@/server/actions/institution/query-locations";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

const Test2Page = () => {
  // Fetch agents
  const {
    data: agents,
    error: agentsError,
    isLoading: agentsLoading,
    isError: isAgentsError,
  } = useQuery<getAgentsResponse>({
    queryKey: ["agents"],
    queryFn: () => getAgents(),
  });

  // Fetch locations
  const {
    data: locations,
    error: locationsError,
    isLoading: locationsLoading,
    isError: isLocationsError,
  } = useQuery<GetLocationsResponse>({
    queryKey: ["locations"],
    queryFn: () => getLocations(),
  });

  // Fetch members
  const {
    data: members,
    error: membersError,
    isLoading: membersLoading,
    isError: isMembersError,
  } = useQuery<GetMembersResponse>({
    queryKey: ["members"],
    queryFn: () => getMembers(),
  });

  // Console debug logging
  console.log("Agents:", { loading: agentsLoading, error: agentsError, data: agents });
  console.log("Locations:", { loading: locationsLoading, error: locationsError, data: locations });
  console.log("Members:", { loading: membersLoading, error: membersError, data: members });

  const obj = JSON.stringify(
    {
      agents: {
        loading: agentsLoading,
        error: agentsError ? String(agentsError) : null,
        data: agents,
      },
      locations: {
        loading: locationsLoading,
        error: locationsError ? String(locationsError) : null,
        data: locations,
      },
      members: {
        loading: membersLoading,
        error: membersError ? String(membersError) : null,
        data: members,
      },
    },
    null,
    2
  );

  return (
    <div className="min-h-screen flex items-center justify-center mx-8">
      <div className="space-y-6">
        {/* Agents Section */}
        <div>
          <h2 className="font-bold">Agents</h2>
          {agentsLoading && (
            <div className="flex items-center gap-2">
              <ClipLoader size={20} /> <span>Loading agents...</span>
            </div>
          )}
          {isAgentsError && (
            <div className="text-red-500">
              Error loading agents: {String(agentsError)}
            </div>
          )}
          {agents && <pre>{JSON.stringify(agents, null, 2)}</pre>}
        </div>

        {/* Locations Section */}
        <div>
          <h2 className="font-bold">Locations</h2>
          {locationsLoading && (
            <div className="flex items-center gap-2">
              <ClipLoader size={20} /> <span>Loading locations...</span>
            </div>
          )}
          {isLocationsError && (
            <div className="text-red-500">
              Error loading locations: {String(locationsError)}
            </div>
          )}
          {locations && <pre>{JSON.stringify(locations, null, 2)}</pre>}
        </div>

        {/* Members Section */}
        <div>
          <h2 className="font-bold">Members</h2>
          {membersLoading && (
            <div className="flex items-center gap-2">
              <ClipLoader size={20} /> <span>Loading members...</span>
            </div>
          )}
          {isMembersError && (
            <div className="text-red-500">
              Error loading members: {String(membersError)}
            </div>
          )}
          {members && <pre>{JSON.stringify(members, null, 2)}</pre>}
        </div>

        {/* Global snapshot object */}
        <div>
          <h2 className="font-bold">Combined Debug Object</h2>
          <pre>{obj}</pre>
        </div>
      </div>
    </div>
  );
};

export default Test2Page;
