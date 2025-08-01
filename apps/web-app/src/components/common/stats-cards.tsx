import type React from "react";
// import { FileText, Search, Users, Lightbulb } from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: React.ElementType;
}

interface StatsCardsProps {
  stats: StatCard[];
  compact?: boolean;
}

export function StatsCards({ stats, compact }: StatsCardsProps) {
  const statsToShow = stats;

  return (
    <div
      className={`grid ${
        compact
          ? "grid-cols-2 gap-2 p-2"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6"
      }`}
    >
      {statsToShow.map((stat, index) => (
        <div
          key={index}
          className={`${compact ? "p-3" : "p-5"} flex flex-col border border-gray-200`}
          style={{ borderWidth: '0.5px', borderRadius: '12px' }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div
              className={`rounded-lg ${compact ? "p-1" : "p-2"}`}
            >
              <stat.icon
                className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-gray-600`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p
              className={`${
                compact ? "text-xs" : "text-sm"
              } font-medium text-gray-700`}
            >
              {stat.title}
            </p>
            <p
              className={`${
                compact ? "text-lg" : "text-xl"
              } font-bold text-gray-900`}
            >
              {stat.value}
            </p>
            <div
              className={`flex items-center space-x-2 ${
                compact ? "text-xs" : "text-sm"
              } text-gray-500`}
            >
              {stat.change && (
                <span className="text-green-600 font-medium">
                  {stat.change}
                </span>
              )}
              <span>{stat.period}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Example usage in the stats component
// export default function Dashboard() {
//   const [stats, setStats] = useState([]);
//   useEffect(() => {
//     fetch("/api/dashboard/stats")
//       .then((res) => res.json())
//       .then((data) => {
//         const transformedStats = [
//           {
//             title: "Lost Reports",
//             value: data.lost_reports,
//             change: data.lost_reports_change,
//             period: "This month",
//             icon: FileText,
//           },
//           {
//             title: "Items Found",
//             value: data.items_found,
//             change: data.items_found_change,
//             period: "This month",
//             icon: Search,
//           },
//           {
//             title: "Items Matched",
//             value: data.items_matched,
//             change: data.items_matched_change,
//             period: "This month",
//             icon: Users,
//           },
//           {
//             title: "Match Suggestions",
//             value: data.match_suggestions,
//             change: data.match_suggestions_change,
//             period: "This month",
//             icon: Lightbulb,
//           },
//         ];
//         setStats(transformedStats);
//       });
//   }, []);
//   return <StatsCards stats={stats} />;
// }
// Wanted the change to change colour based on value(data.change)
// e.g. if change is positive, show green, if negative, show red
