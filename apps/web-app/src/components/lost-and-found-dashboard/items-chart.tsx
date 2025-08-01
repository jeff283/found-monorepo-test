
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const data = [
  { name: 'Jan', last: 10, current: 5 },
  { name: 'Feb', last: 90, current: 100 },
  { name: 'Mar', last: 160, current: 110 },
  { name: 'Apr', last: 180, current: 100 },
  { name: 'May', last: 140, current: 105 },
  { name: 'Jun', last: 160, current: 160 },
  { name: 'Jul', last: 200, current: 260 },
  { name: 'Aug', last: 230, current: 280 },
  // { name: 'Sep', last: 230, current: 270 },
  // { name: 'Oct', last: 260, current: 290 },
  // { name: 'Nov', last: 280, current: 310 },
  // { name: 'Dec', last: 300, current: 330 },
];

export function ItemsChart({
  title = 'Items Logged',
  compact,
  subtitle = 'Per Week',
  legendLast = 'Last month',
  legendCurrent = 'This month',
}: {
  title?: string;
  compact?: boolean;
  subtitle?: string;
  legendLast?: string;
  legendCurrent?: string;
}) {
  return (
    <Card className={compact ? "p-0 shadow-none bg-gray-50 border-0" : "border-0"}>
      <CardHeader className="pb-1">
        <div className="w-full flex flex-col gap-2 sm:gap-3">
          {/* Top row: Title + Dropdown */}
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className={compact ? "text-sm md:text-base font-semibold" : "text-base md:text-lg font-semibold"}>
                {title}
              </CardTitle>
              <div className={compact ? "text-[10px] text-muted-foreground" : "text-xs text-muted-foreground"}>
                {subtitle}
              </div>
            </div>
            <Select defaultValue="monthly">
              <SelectTrigger className={compact ? "w-20 h-7 rounded-md text-xs" : "w-28 h-8 rounded-md text-sm"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Centered legend */}
          <div className="flex justify-center items-center gap-3 -mt-5">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-[#1e293b]"></span>
              <span className={compact ? "text-[10px] text-gray-500" : "text-xs text-gray-500"}>{legendLast}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-[#0ea5e9]"></span>
              <span className={compact ? "text-[10px] text-gray-500" : "text-xs text-gray-500"}>{legendCurrent}</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className={compact ? "h-62 pl-2" : "h-80 pl-3"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, 300]}
              ticks={[0, 50, 100, 150, 200, 250, 300]}
              tick={{ fontSize: compact ? 10 : 12, fill: '#64748b' }}
            />
            <Tooltip />
            <Line type="monotone" dataKey="last" stroke="#1e293b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="current" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}