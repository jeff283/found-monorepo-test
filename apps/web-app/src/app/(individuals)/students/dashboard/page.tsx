'use client';

import { DashboardHeader } from "@/components/common/dashboard-header";
import {
  studentNavItems,
  defaultStudentUser,
  StudentProfileDropdownContent,
} from "@/components/students/dashboard-header.config";
import { MatchesPreviewTable } from "@/components/students/MatchesPreviewTable";
import { FileText, Search, Users } from "lucide-react";
import { WelcomeSection } from "@/components/institution-dashboard/welcome-section";

type Match = { id: string; item: string; location: string; confidence: number; updatedAt: string };

export default function StudentDashboardPage() {
  // Top stats (mocked for now)
  const stats = [
    { title: "My Open Reports", value: "2", change: "+1", period: "This week", icon: FileText, href: "/students/my-reports" },
    { title: "Matches",         value: "1", change: "—",  period: "This week", icon: Search,   href: "/students/matches" },
    { title: "Returned",        value: "0", change: "—",  period: "This week", icon: Users,    href: "/students/returned" },
    { title: "New Reports",     value: "3", change: "+1", period: "This week", icon: FileText, href: "/students/my-reports" },
  ];

  // Mock matches — replace with API results later
  const matches: Match[] = [
    { id: "m1", item: "Black AirPods Pro", location: "Main Library Desk", confidence: 82, updatedAt: "2h ago" },
    { id: "m2", item: "Blue Hydro Flask",  location: "Student Center",    confidence: 58, updatedAt: "Yesterday" },
    { id: "m3", item: "Casio FX-991EX",    location: "Room B204",         confidence: 73, updatedAt: "Yesterday" },
    { id: "m4", item: "Lenovo ThinkPad",   location: "IT Helpdesk",       confidence: 41, updatedAt: "2d ago" },
    { id: "m5", item: "Brown Leather Wallet", location: "Security Office", confidence: 65, updatedAt: "2d ago" },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      {/* Header */}
      <DashboardHeader
        navItems={studentNavItems}
        user={defaultStudentUser}
        profileDropdown={StudentProfileDropdownContent(defaultStudentUser)}
      />

      {/* Welcome section */}
      <WelcomeSection userName={defaultStudentUser.name ?? "Student"} />

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, change, period, icon: Icon, href }) => (
          <a
            key={title}
            href={href}
            className="flex items-center gap-3 p-4 sm:gap-5 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-50
                       hover:shadow-lg transition-shadow border border-gray-100
                       dark:from-gray-900 dark:to-gray-800 min-h-[100px] sm:min-h-[160px]"
          >
            <div className="flex-shrink-0 rounded-full bg-primary/10 p-2 sm:p-4">
              <Icon className="w-5 h-5 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{title}</div>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl font-bold text-primary">{value}</span>
                <span className="text-xs sm:text-sm text-gray-500">{change}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400">{period}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Matches table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 bg-white dark:bg-gray-900 shadow-sm p-0">
        <div className="min-w-[320px] sm:min-w-0 p-6">
          <MatchesPreviewTable rows={matches} seeAllHref="/students/matches" />
        </div>
      </div>
    </div>
  );
}
