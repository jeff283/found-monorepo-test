'use client';

import { DashboardHeader } from "@/components/lost-and-found-dashboard/dashboard-header";
import { StatsCards } from "@/components/common/stats-cards";
import { FileText, Search, Users, Lightbulb } from "lucide-react";
import { LiveAlerts } from "@/components/common/live-alerts";
import { Notes } from "@/components/lost-and-found-dashboard/notes";
import { ItemsChart } from "@/components/common/items-chart";
import { LatestFindsTable } from "@/components/common/latest-finds-table";

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

  const alerts = [
    {
      id: "1042",
      title: "Item #1042",
      description: "Black Backpack found at Lobby",
      type: "found" as const,
    },
    {
      id: "913",
      title: "Lost Report #913 submitted",
      description: "Lost Phone",
      type: "report" as const,
    },
    {
      id: "match",
      title: "Suggested Match",
      description: "#1041 → Report #912 (94%)",
      type: "match" as const,
    },
  ];


  const monthlyData = [
      { name: "Jan", last: 40, current: 40 },
      { name: "Feb", last: 45, current: 70 }, 
      { name: "Mar", last: 35, current: 140 }, 
      { name: "Apr", last: 50, current: 70 }, 
      { name: "May", last: 40, current: 50 }, 
      { name: "Jun", last: 55, current: 60 }, 
      { name: "Jul", last: 60, current: 50 }, 
      { name: "Aug", last: 50, current: 65 }, 
];

  const weeklyData = [
    { name: "Week 1", last: 100, current: 50 },
    { name: "Week 2", last: 60, current: 150 },
    { name: "Week 3", last: 140, current: 100 },
    { name: "Week 4", last: 40, current: 80 },
  ];

  const dailyData = [
    { name: "Mon", last: 130, current: 30 },
    { name: "Tue", last: 50, current: 190 },
    { name: "Wed", last: 100, current: 130 },
    { name: "Thu", last: 65, current: 250 },
    { name: "Fri", last: 100, current: 170 },
    { name: "Sat", last: 190, current: 80 },
    { name: "Sun", last: 8, current: 50 },
  ];

  return (
    <div className="min-h-screen bg-white w-full">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto p-2 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 w-full">
          <StatsCards stats={stats} compact />
          <LiveAlerts alerts={alerts} compact />
          <Notes />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="w-full lg:w-1/2">
            <ItemsChart
              compact
              monthlyData={monthlyData}
              weeklyData={weeklyData}
              dailyData={dailyData}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <LatestFindsTable compact />
          </div>
        </div>
      </main>
    </div>
  );
}
