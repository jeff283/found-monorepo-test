'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface FindItem {
  id: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'Active' | 'Claimed' | 'Pending';
}

interface LatestFindsTableProps {
  items?: FindItem[];
  count?: number;
  compact?: boolean;
}

export function LatestFindsTable({ items, count = 248, compact }: LatestFindsTableProps) {
  const defaultItems: FindItem[] = Array(5).fill({
    id: '#248',
    description: 'Lost phone',
    date: '17 Jun 2025',
    time: '',
    location: 'Near south office',
    status: 'Active',
  });

  const tableItems = items || defaultItems;

  return (
    <Card className={compact ? "p-0 shadow-none bg-gray-50 border-0" : "border-0"} style={compact ? { boxShadow: "none" } : { boxShadow: "none" }}>
      <CardHeader className={compact ? "pb-1" : "pb-2"}>
        <div className={compact ? "flex flex-col md:flex-row md:items-center md:justify-between gap-2" : "flex flex-col md:flex-row md:items-center md:justify-between gap-4"}>
          {/* Title */}
          <CardTitle className={compact ? "text-sm md:text-base font-semibold mb-5" : "text-base md:text-lg font-semibold mb-5"}>
            Latest Founds <span className="text-cyan-500">+{count}</span>
          </CardTitle>

          {/* Search, Status, Sort */}
          <div className={compact ? "flex flex-wrap gap-1 items-center mb-2" : "flex flex-wrap gap-2 items-center mb-4"}>
            {/* Search Input */}
            <div className="relative">
              <Search className={compact ? "absolute left-2 top-2 w-3.5 h-3.5 text-gray-400" : "absolute left-3 top-2.5 w-4 h-4 text-gray-400"} />
              <Input
                placeholder="Search..."
                className={compact ? "pl-7 pr-2 h-7 w-32 text-xs" : "pl-9 pr-3 h-9 w-48"}
              />
            </div>

            {/* Status Filter */}
            <Select defaultValue="all">
              <SelectTrigger className={compact ? "h-7 w-20 text-xs" : "h-9 w-28 text-sm"}>
                <SelectValue>Status</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select defaultValue="latest">
              <SelectTrigger className={compact ? "h-7 w-20 text-xs" : "h-9 w-28 text-sm"}>
                <SelectValue>Sort</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <table className={compact ? "min-w-full text-xs" : "min-w-full text-sm"}>
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className={compact ? "py-2 px-2 font-normal" : "py-3 px-4 font-normal"}>Item ID</th>
                <th className={compact ? "py-2 px-2 font-normal" : "py-3 px-4 font-normal"}>Description</th>
                <th className={compact ? "py-2 px-2 font-normal" : "py-3 px-4 font-normal"}>Date & Time</th>
                <th className={compact ? "py-2 px-2 font-normal" : "py-3 px-4 font-normal"}>Location</th>
                <th className={compact ? "py-2 px-2 font-normal" : "py-3 px-4 font-normal"}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableItems.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-muted/20 transition"
                >
                  <td className={compact ? "py-2 px-2 font-medium text-foreground" : "py-3 px-4 font-medium text-foreground"}>
                    {item.id}
                  </td>
                  <td className={compact ? "py-2 px-2" : "py-3 px-4"}>{item.description}</td>
                  <td className={compact ? "py-2 px-2" : "py-3 px-4"}>
                    {item.date} {item.time}
                  </td>
                  <td className={compact ? "py-2 px-2" : "py-3 px-4"}>{item.location}</td>
                  <td className={compact ? "py-2 px-2" : "py-3 px-4"}>
                    <Badge
                      className={compact ? "bg-cyan-50 text-b-600 hover:bg-cyan-100 rounded-md px-1.5 py-0.5 text-[10px] font-medium" : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 rounded-md px-2 py-1 text-xs font-medium"}
                    >
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
