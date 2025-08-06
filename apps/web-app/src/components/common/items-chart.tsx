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
import { useState, useMemo } from 'react';

export interface ItemsChartData {
  name: string;
  last: number;
  current: number;
}

export function ItemsChart({
  title = 'Items Logged',
  subtitle,
  legendLast,
  legendCurrent,
  compact,
  monthlyData,
  weeklyData,
  dailyData,
}: {
  title?: string;
  subtitle?: string;
  legendLast?: string;
  legendCurrent?: string;
  compact?: boolean;
  monthlyData: ItemsChartData[];
  weeklyData: ItemsChartData[];
  dailyData: ItemsChartData[];
}) {
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  // Select correct data based on period
  const filteredData = useMemo(() => {
    if (period === 'monthly') return monthlyData;
    if (period === 'weekly') return weeklyData;
    if (period === 'daily') return dailyData;
    return monthlyData;
  }, [period, monthlyData, weeklyData, dailyData]);
  
  const isEmpty =
    (!monthlyData || monthlyData.length === 0) &&
    (!weeklyData || weeklyData.length === 0) &&
    (!dailyData || dailyData.length === 0);

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
              {subtitle && (
                <div className={compact ? "text-[10px] text-muted-foreground" : "text-xs text-muted-foreground"}>{subtitle}</div>
              )}
              {!subtitle && (
                <div className={compact ? "text-[10px] text-muted-foreground" : "text-xs text-muted-foreground"}>
                  {period === 'monthly' ? 'Per Month' : period === 'weekly' ? 'Per Week' : 'Per Day'}
                </div>
              )}
            </div>
            <Select value={period} onValueChange={v => setPeriod(v as 'monthly' | 'weekly' | 'daily')}>
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
              <span className={compact ? "text-[10px] text-gray-500" : "text-xs text-gray-500"}>
                {legendLast
                  ? legendLast
                  : period === 'monthly' && 'Last month' || period === 'weekly' && 'Last week' || period === 'daily' && 'Yesterday'}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-[#0ea5e9]" ></span>
              <span className={compact ? "text-[10px] text-gray-500" : "text-xs text-gray-500"}>
                {legendCurrent
                  ? legendCurrent
                  : period === 'monthly' && 'This month' || period === 'weekly' && 'This week' || period === 'daily' && 'Today'}
              </span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent style={{ height: compact ? 320 : 420 }} className={compact ? "pl-2" : "pl-3"}>
        {isEmpty ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data to display yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ left: 5, right: 5, top: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                label={{
                  value: period === 'monthly' ? 'Month' : period === 'weekly' ? 'Week' : 'Day',
                  position: 'bottom',
                  offset: 15,  
                  fontSize: compact ? 15 : 20,
                  fill: '#000000ff', 
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, 300]}
                ticks={[0, 50, 100, 150, 200, 250, 300]}
                tick={{ fontSize: compact ? 10 : 12, fill: '#64748b' }}
                label={{
                  value: 'Items',
                  angle: -90,
                  position: 'insideLeft',
                  fontSize: compact ? 15 : 20,
                  fill: '#000000ff', 
                }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="last" stroke="#1e293b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="current" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
