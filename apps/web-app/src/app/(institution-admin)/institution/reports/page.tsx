
import { ItemsChart } from '@/components/institution-dashboard/items-chart';
import { ReportTable } from '@/components/institution-dashboard/reports/reports-finds-table';
import { DashboardHeader } from '@/components/institution-dashboard/dashboard-header';
import { Search, Users, FileText } from 'lucide-react';
//import { ReportTable } from '@/components/institution-dashboard/report-table';

// Sample chart data
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
            

const mockUser = {
  name: "Victor Musembi",
  role: "Institution Admin",
  avatar: "/avatars/avatar-1.webp",
};


const reportStats = [
  {
    title: "Found Items",
    value: "240",
    change: "",
    period: "",
    icon: Search,
  },
  {
    title: "Claims Verified",
    value: "240",
    change: "",
    period: "",
    icon: Users,
  },
  {
    title: "Not Claimed",
    value: "240",
    change: "",
    period: "",
    icon: FileText,
  },
];


function ReportStatsCards({ stats }: { stats: typeof reportStats }) {
  return (
    <div className="flex flex-col gap-y-14 p-6 ml-4 md:ml-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="flex flex-row items-center gap-3 p-3 border border-transparent rounded-xl bg-white h-20">
          <div className="rounded-lg p-1">
            <stat.icon className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="space-y-1 flex flex-col justify-center h-full">
            <p className="text-xl font-normal text-gray-700">{stat.title}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div>
      <DashboardHeader user={mockUser} />
      <main className="p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3 max-w-xs">
            <ReportStatsCards stats={reportStats} />
          </div>
          <div className="flex-1">
            <ItemsChart 
              title="Overview Chart"
              subtitle="Monthly lost & found activity"
              legendLast="Lost Item"
              legendCurrent="Found Item"
              monthlyData={monthlyData}
              weeklyData={weeklyData}
              dailyData={dailyData}
            />
          </div>
        </div>
        <div>
          <ReportTable />
        </div>
      </main>
    </div>
  );
}
