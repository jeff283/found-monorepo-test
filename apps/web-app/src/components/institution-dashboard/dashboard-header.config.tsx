'use client';

import {
  SearchPopover,
  GridPopover,
  NotificationsPopover,
  ProfileDropdown,
} from "@/components/institution-dashboard/navbar-popovers";
import { MessagesSheet } from "@/components/navbar-popovers/messages-sheet";
import { Home, ClipboardList, Users, MapPin, BarChart3, Shield } from "lucide-react";
// import Image from "next/image";
import type { NavItem, User } from "@/components/common/dashboard-header";

// Test User
export const defaultUser: User = {
  name: "Victor Nzai",
  role: "Administrator",
  avatar: "/avatars/avatar-2.webp",
};

export const defaultNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/institution/dashboard" },
  { icon: ClipboardList, label: "Found items", href: "/institution/found-items" },
  { icon: Users, label: "Agents", href: "/institution/agents" },
  { icon: MapPin, label: "Locations", href: "/institution/locations" },
  { icon: BarChart3, label: "Reports", href: "/institution/reports" },
  { icon: Shield, label: "Roles", href: "/institution/roles" },
];

/**
 * Example of how you could load the session dynamically later:
 *
 * import { useSession } from "next-auth/react";
 *
 * export function useCurrentUser(): User {
 *   const { data: session } = useSession();
 *   return {
 *     name: session?.user?.name || "Guest",
 *     role: session?.user?.role || "User",
 *     avatar: session?.user?.image || "/avatars/default-avatar.png",
 *   };
 * }
 *
 * // If using custom JWT/localStorage:
 * export function useCurrentUser(): User {
 *   const [user, setUser] = useState<User>({ name: "", role: "", avatar: "" });
 *   useEffect(() => {
 *     const savedUser = localStorage.getItem("foundlyUser");
 *     if (savedUser) setUser(JSON.parse(savedUser));
 *   }, []);
 *   return user.name ? user : defaultUser;
 * }
 */

/**
 * This builds the profile dropdown UI for the header.
 * Pass in a `User` object from either `defaultUser` or the session.
 */
export function ProfileDropdownContent(user: User) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex p-0.5 items-center gap-1 rounded-md border border-[#F4F4F4] bg-white">
        <SearchPopover />
      </div>
      <div className="flex p-0.5 items-center gap-1 rounded-md border border-[#F4F4F4] bg-white">
        <GridPopover />
      </div>
      <div className="flex p-0.5 items-center gap-1 rounded-md border border-[#F4F4F4] bg-white">
        <MessagesSheet />
      </div>
      <div className="flex p-0.5 items-center gap-1 rounded-md border border-[#F4F4F4] bg-white">
        <NotificationsPopover />
      </div>
      <div className="relative rounded-md">
        <ProfileDropdown user={user} />
      </div>
    </div>
  );
}
