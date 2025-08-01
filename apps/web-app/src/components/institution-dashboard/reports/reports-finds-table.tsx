'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Download, Filter as FilterIcon, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportItem {
  date: string;
  foundItems: string;
  claimsVerified: string;
  unclaimedItems: string;
}

export function ReportTable({ compact }: { compact?: boolean }) {
  const reports: ReportItem[] = Array(6).fill({
    date: '17 Jun 2025',
    foundItems: '024',
    claimsVerified: '024',
    unclaimedItems: '024',
  });

  return (
    <Card className={compact ? 'p-0 border-0 shadow-none bg-gray-50' : 'border-0'}>
      <CardHeader className="pb-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title */}
          <CardTitle className="text-base md:text-lg font-semibold">
            Reports <span className="text-cyan-500 text-sm">12</span>
          </CardTitle>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search report"
                className="pl-9 pr-3 h-9 w-52"
              />
            </div>

            {/* Sort By */}
            <span className="font-normal text-[15px]">Sort by</span>
            <Button variant="ghost" size="sm" className="h-9 px-3 font-medium text-[15px]">
              Recents
            </Button>

            {/* Filter */}
            <Button variant="outline" size="sm" className="h-9 text-sm px-4 flex items-center gap-1">
              <FilterIcon className="w-4 h-4" /> Filter
            </Button>

            {/* Export */}
            <Button variant="outline" size="sm" className="h-9 text-sm px-4 flex items-center gap-1">
              <FileDown className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="py-3 px-4 font-normal">Dates</th>
                <th className="py-3 px-4 font-normal">Found items</th>
                <th className="py-3 px-4 font-normal">Found items</th>
                <th className="py-3 px-4 font-normal">Claims verified</th>
                <th className="py-3 px-4 font-normal">Unclaimed items</th>
                <th className="py-3 px-4 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-muted/20 transition"
                >
                  <td className="py-3 px-4 font-medium text-foreground">
                    {item.date}
                  </td>
                  <td className="py-3 px-4">{item.foundItems}</td>
                  <td className="py-3 px-4">{item.foundItems}</td>
                  <td className="py-3 px-4">{item.claimsVerified}</td>
                  <td className="py-3 px-4">{item.unclaimedItems}</td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-cyan-600 text-white text-xs font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Export
                    </button>
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
