'use client';

import Image from "next/image";
import type { NavItem, User } from "@/components/common/dashboard-header";
import {
  ProfileDropdown,
} from "@/components/institution-dashboard/navbar-popovers"; 
// import { MessagesSheet } from "@/components/navbar-popovers/messages-sheet";
import { Home, FilePlus, NotepadText, BadgeCheck } from "lucide-react";

export const defaultStudentUser: User = {
  name: "Student User",
  role: "Student",
  avatar: "/avatars/avatar-4.webp",
};

export const studentNavItems: NavItem[] = [
  { icon: Home,        label: "Dashboard",   href: "/students/dashboard" },
  { icon: FilePlus,    label: "Report Lost", href: "/students/report-lost" },
  { icon: NotepadText, label: "My Reports",  href: "/students/my-reports" },
  { icon: BadgeCheck,  label: "Matches",     href: "/students/matches" },
];

/**
 * 
 * // import { useSession } from "next-auth/react";
 * export function useCurrentStudent(): User {
 *   const { data } = useSession();
 *   return {
 *     name: data?.user?.name ?? "Student",
 *     role: data?.user?.role ?? "Student",
 *     avatar: data?.user?.image ?? "/avatars/default-avatar.png",
 *   };
 * }
 */

export function StudentProfileDropdownContent(user: User) {
  return (
    <div className="flex items-center gap-3">
      <ProfileDropdown user={user}>
        <button className="flex items-center gap-2 focus:outline-none">
          <Image
            src={user.avatar || "/avatars/default-avatar.png"}
            alt={user.name}
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          />
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <span className="button-text-small text-black truncate">{user.name}</span>
            <span className="caption-small text-muted-foreground flex items-center gap-1">
              {user.role}
              <span className="text-primary text-xs">✔</span>
            </span>
          </div>
        </button>
      </ProfileDropdown>
    </div>
  );
}

