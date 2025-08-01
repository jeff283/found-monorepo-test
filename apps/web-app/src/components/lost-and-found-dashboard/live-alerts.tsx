import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  Shield,
  FileText,
  Search,
  Lightbulb,
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "found" | "report" | "match";
}

interface LiveAlertsProps {
  alerts: Alert[];
  compact?: boolean;
}

export function LiveAlerts({ alerts, compact }: LiveAlertsProps) {
  const defaultAlerts: Alert[] = [
    {
      id: "1042",
      title: "Item #1042",
      description: "Black Backpack found at Lobby",
      type: "found",
    },
    {
      id: "913",
      title: "Lost Report #913 submitted",
      description: "Lost Phone",
      type: "report",
    },
    {
      id: "match",
      title: "Suggested Match",
      description: "#1041 → Report #912 (94%)",
      type: "match",
    },
  ];

  const alertsToShow = alerts.length > 0 ? alerts : defaultAlerts;

  const getIconForType = (type: Alert["type"]) => {
    switch (type) {
      case "found":
        return <Search className="text-blue-600 w-4 h-4" />;
      case "report":
        return <FileText className="text-orange-500 w-4 h-4" />;
      case "match":
        return <Lightbulb className="text-green-600 w-4 h-4" />;
      default:
        return <Shield className="text-blue-600 w-4 h-4" />;
    }
  };

  return (
    <Card
      className={`h-full bg-white ${compact ? "p-0 shadow-none border-transparent" : "border border-transparent"}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle
            className={`${compact ? "text-base" : "text-lg"} font-semibold`}
          >
            Live Alerts
          </CardTitle>
          <p
            className={`${
              compact ? "text-xs" : "text-sm"
            } text-gray-500`}
          >
            Recent events across your institution’s locations
          </p>
        </div>
        <ChevronRight
          className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-blue-500`}
        />
      </CardHeader>

      <CardContent className={`${compact ? "space-y-2" : "space-y-4"}`}>
        {alertsToShow.map((alert, index) => (
          <div
            key={index}
            className={`flex items-start rounded-lg ${
              compact ? "space-x-2 p-2" : "space-x-3 p-3"
            }`}
          >
            <div
              className={`rounded-lg ${
                compact ? "p-1" : "p-2"
              } bg-gray-100 flex items-center justify-center`}
            >
              {getIconForType(alert.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`${
                  compact ? "text-xs" : "text-sm"
                } text-gray-600`}
              >
                {alert.title}
              </p>
              <p
                className={`${
                  compact ? "text-xs" : "text-sm"
                } font-medium text-gray-900`}
              >
                {alert.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
