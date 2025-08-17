'use client';

import { StatsCards } from "@/components/common/stats-cards";
import { DashboardHeader } from "@/components/common/dashboard-header";
import { studentNavItems, defaultStudentUser } from "@/components/students/dashboard-header.config";
import { MatchesPreviewTable } from "@/components/students/MatchesPreviewTable";
import { FileText, Search, Users } from "lucide-react";

type Match = { id: string; item: string; location: string; confidence: number; updatedAt: string };

export default function StudentDashboardPage() {
  // Top stats (mocked for now)
  const stats = [
    { title: "My Open Reports", value: "2", change: "+1", period: "This week", icon: FileText },
    { title: "Matches",         value: "1", change: "—",  period: "This week", icon: Search },
    { title: "Returned",        value: "0", change: "—",  period: "This week", icon: Users },
    { title: "New Reports",     value: "3", change: "+1", period: "This week", icon: FileText },
  ];

  // Mock matches — replace with API results later
  const matches: Match[] = [
    { id: "m1", item: "Black AirPods Pro", location: "Main Library Desk", confidence: 82, updatedAt: "2h ago" },
    { id: "m2", item: "Blue Hydro Flask",  location: "Student Center",    confidence: 58, updatedAt: "Yesterday" },
    { id: "m3", item: "Casio FX-991EX",    location: "Room B204",         confidence: 73, updatedAt: "Yesterday" },
    { id: "m4", item: "Lenovo ThinkPad",   location: "IT Helpdesk",       confidence: 41, updatedAt: "2d ago" },
    { id: "m5", item: "Brown Leather Wallet", location: "Security Office", confidence: 65, updatedAt: "2d ago" },
    // { id: "m6", item: "Grey Hoodie",       location: "Gym Reception",     confidence: 52, updatedAt: "3d ago" },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader navItems={studentNavItems} user={defaultStudentUser} />
      <StatsCards stats={stats} />
      <MatchesPreviewTable rows={matches} seeAllHref="/students/matches" />
    </div>
  );
}
