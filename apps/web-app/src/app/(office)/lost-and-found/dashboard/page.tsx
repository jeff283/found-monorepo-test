
'use client';


import { DashboardHeader } from "@/components/lost-and-found-dashboard/dashboard-header";
import { StatsCards } from "@/components/common/stats-cards";
import { FileText, Search, Users, Lightbulb } from "lucide-react";
import { LiveAlerts } from "@/components/lost-and-found-dashboard/live-alerts";
import { Notes } from "@/components/lost-and-found-dashboard/notes";
import { ItemsChart } from "@/components/lost-and-found-dashboard/items-chart";
import { LatestFindsTable } from "@/components/lost-and-found-dashboard/latest-finds-table";


export default function DashboardPage() {
  const user = {
    name: "John Snow",
    role: "Admin",
    avatar: "/avatars/avatar-1.webp",
  };

  const stats = [
    {
      title: "Lost Reports",
      value: "+240",
      change: "+30",
      period: "Last month",
      icon: FileText,
    },
    {
      title: "Items Found",
      value: "+180",
      change: "+20",
      period: "Last month",
      icon: Search,
    },
    {
      title: "Items Matched",
      value: "+120",
      change: "+10",
      period: "Last month",
      icon: Users,
    },
    {
      title: "Match Suggestions",
      value: "+80",
      change: "+15",
      period: "Last month",
      icon: Lightbulb,
    },
  ];

  return (
    <div className="min-h-screen bg-white w-full">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto p-2 w-full">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 w-full">
          <StatsCards stats={stats} compact />
          <LiveAlerts alerts={[]} compact />
          <Notes />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="w-full lg:w-1/2">
            <ItemsChart compact />
          </div>
          <div className="w-full lg:w-1/2">
            <LatestFindsTable compact />
          </div>
        </div>
      </main>
    </div>
  );
}
