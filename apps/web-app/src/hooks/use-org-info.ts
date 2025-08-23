"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getOrganizationInfo,
  GetOrgInfoResponse,
} from "@/server/actions/auth/org-metadata";

export function useOrgInfo() {
  return useQuery<GetOrgInfoResponse>({
    queryKey: ["orgInfo"],
    queryFn: () => getOrganizationInfo(),
    staleTime: 1000 * 60 * 5,
  });
}
