
'use client';
import React from 'react';

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
import { Pagination } from '../shared/Pagination';
 // import { useEffect, useState } from "react";
interface FindItem {
  id: string;
  description: string;
  date: string;
  location: string;
  status: 'Active' | 'Claimed' | 'Pending';
}

interface LatestFindsTableProps {
  items?: FindItem[];
  compact?: boolean;
}

export function LatestFindsTable({ items, compact }: LatestFindsTableProps) {
  const defaultItems: FindItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: `#${248 + i}`,
    description: i % 3 === 0 ? 'Lost phone' : i % 3 === 1 ? 'Found wallet' : 'Lost keys',
    date: `${17 + (i % 10)} Jun 2025`,
    location: i % 2 === 0 ? 'Near south office' : 'Main lobby',
    status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Claimed' : 'Pending',
  }));

  // Filter, sort, and search state
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'Active' | 'Claimed' | 'Pending'>('all');
  const [sortOrder, setSortOrder] = React.useState<'latest' | 'oldest'>('latest');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);

  // Filtering and searching
  const filteredItems = (items || defaultItems)
    .filter(item => statusFilter === 'all' ? true : item.status === statusFilter)
    .filter(item => {
      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return (
        item.id.toLowerCase().includes(s) ||
        item.description.toLowerCase().includes(s) ||
        item.date.toLowerCase().includes(s) ||
        item.location.toLowerCase().includes(s) ||
        item.status.toLowerCase().includes(s)
      );
    });

  // Sorting (by id, assuming higher id = newer)
  const sortedItems = filteredItems.sort((a, b) => {
    const aNum = parseInt(a.id.replace('#', ''));
    const bNum = parseInt(b.id.replace('#', ''));
    return sortOrder === 'latest' ? bNum - aNum : aNum - bNum;
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const filteredCount = filteredItems.length;

  return (
    <Card className={compact ? "p-0 shadow-none bg-gray-50 border-0" : "border-0"} style={compact ? { boxShadow: "none" } : { boxShadow: "none" }}>
      <CardHeader className={compact ? "pb-1" : "pb-2"}>
        <div className={compact ? "flex flex-col md:flex-row md:items-center md:justify-between gap-2" : "flex flex-col md:flex-row md:items-center md:justify-between gap-4"}>
          {/* Title */}
          <CardTitle className={compact ? "text-sm md:text-base font-semibold mb-5" : "text-base md:text-lg font-semibold mb-5"}>
            Latest Founds <span className="text-cyan-500">+{filteredCount}</span>
          </CardTitle>

          {/* Search, Status, Sort */}
          <div className={compact ? "flex flex-wrap gap-1 items-center mb-2" : "flex flex-wrap gap-2 items-center mb-4"}>
            {/* Search Input */}
            <div className="relative">
              <Search className={compact ? "absolute left-2 top-2 w-3.5 h-3.5 text-gray-400" : "absolute left-3 top-2.5 w-4 h-4 text-gray-400"} />
              <Input
                placeholder="Search..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className={compact ? "pl-7 pr-2 h-7 w-32 text-xs" : "pl-9 pr-3 h-9 w-48"}
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v as 'all' | 'Active' | 'Claimed' | 'Pending'); setPage(1); }}>
              <SelectTrigger className={compact ? "h-7 w-20 text-xs" : "h-9 w-28 text-sm"}>
                <SelectValue>Status</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Claimed">Claimed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select value={sortOrder} onValueChange={v => { setSortOrder(v as 'latest' | 'oldest'); setPage(1); }}>
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
              {paginatedItems.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-muted/20 transition"
                >
                  <td className={compact ? "py-2 px-2 font-medium text-foreground" : "py-3 px-4 font-medium text-foreground"}>
                    {item.id}
                  </td>
                  <td className={compact ? "py-2 px-2" : "py-3 px-4"}>{item.description}</td>
                  <td className={compact ? "py-2 px-2" : "py-3 px-4"}>
                    {item.date}
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
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setPage(1);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
