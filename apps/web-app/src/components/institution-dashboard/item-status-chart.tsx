"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatusData {
  label: string
  percentage: number
  color: string
}

interface ItemStatusChartProps {
  data?: StatusData[]
  compact?: boolean
}

export function ItemStatusChart({ data, compact }: ItemStatusChartProps) {
  const defaultData: StatusData[] = [
    { label: "Item Claimed", percentage: 55, color: "#67e8f9" },
    { label: "Pending Claim", percentage: 30, color: "#22d3ee" },
    { label: "Unmatched", percentage: 15, color: "#06b6d4" },
  ]

  const statusData = data || defaultData

  return (
    <Card className={compact ? "p-0 shadow-none bg-gray-50 border border-gray-100/0 hover:border-gray-100/40 transition-colors duration-300" : undefined} style={compact ? { boxShadow: "0 1px 2px 0 rgba(0,0,0,0.01)" } : undefined}>
      <CardHeader className={compact ? "pb-1" : "pb-2"}>
        <CardTitle className={compact ? "text-base font-semibold mb-0.5" : "text-lg font-semibold mb-1"}>Item Status</CardTitle>
        <p className={compact ? "text-xs text-gray-500 mb-0.5" : "text-sm text-gray-500 mb-1"}>Current Item Status Distribution</p>
      </CardHeader>
      <CardContent>
        <div className={compact ? "space-y-3" : "space-y-6"}>
          {statusData.map((item, index) => {
            // Dimming: 1 = dimmest, 2 = dimmer, 3 = least dim
            const dimLevels = [0.4, 0.7, 1];
            const opacity = dimLevels[index] ?? 1;
            return (
              <div key={index} className={compact ? "flex items-center space-x-2" : "flex items-center space-x-4"}>
                {/* Tall vertical bar with dimming */}
                <div
                  className={compact ? "w-4 h-10 rounded-md" : "w-6 h-16 rounded-md"}
                  style={{ backgroundColor: item.color, opacity }}
                />

                {/* Mini horizontal percentage bar and label with percentage below */}
                <div className="flex flex-col items-start">
                  <div className={compact ? "flex items-center space-x-1" : "flex items-center space-x-3"}>
                    <div className={compact ? "h-3 w-1.5 rounded-full" : "h-4 w-2 rounded-full"} style={{ backgroundColor: item.color, opacity }} />
                    <div className="flex flex-col">
                      <span className={compact ? "text-xs text-gray-700" : "text-sm text-gray-700"}>{item.label}</span>
                      <span className={compact ? "text-base font-bold text-gray-700 mt-0.5" : "text-lg font-bold text-gray-700 mt-0.5"}>{item.percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}
