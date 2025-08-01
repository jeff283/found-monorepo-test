'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export type FilterValues = {
  type: string;
  status: string;
  reportDateFrom: string;
  reportDateTo: string;
  lostDateFrom: string;
  lostDateTo: string;
};

type FilterDropdownProps = {
  onApply: (filters: FilterValues) => void;
};

export function FilterDropdown({ onApply }: FilterDropdownProps) {
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [reportDateFrom, setReportDateFrom] = useState('');
  const [reportDateTo, setReportDateTo] = useState('');
  const [lostDateFrom, setLostDateFrom] = useState('');
  const [lostDateTo, setLostDateTo] = useState('');

  const handleApply = () => {
    onApply({
      type,
      status,
      reportDateFrom,
      reportDateTo,
      lostDateFrom,
      lostDateTo,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="border border-input bg-background text-foreground px-3 flex items-center justify-center"
        >
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="rounded-xl w-[280px] p-4 shadow-lg">
        <div className="text-base font-medium mb-4">Filter</div>

        {/* Type Filter */}
        <div className="mb-3">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All type</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="bags">Bags</SelectItem>
              <SelectItem value="cards">ID Cards</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="mb-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="claimed">Claimed</SelectItem>
              <SelectItem value="unclaimed">Unclaimed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Report Date */}
<div className="mb-3">
  <div className="text-sm font-medium mb-1">Report date</div>
  <div className="flex gap-2">
    <div className="flex-1 min-w-0">
      <Input
        type="date"
        className="w-full"
        value={reportDateFrom}
        onChange={(e) => setReportDateFrom(e.target.value)}
      />
    </div>
    <div className="flex-1 min-w-0">
      <Input
        type="date"
        className="w-full"
        value={reportDateTo}
        onChange={(e) => setReportDateTo(e.target.value)}
      />
    </div>
  </div>
</div>

{/* Lost Date */}
<div className="mb-4">
  <div className="text-sm font-medium mb-1">Lost date</div>
  <div className="flex gap-2">
    <div className="flex-1 min-w-0">
      <Input
        type="date"
        className="w-full"
        value={lostDateFrom}
        onChange={(e) => setLostDateFrom(e.target.value)}
      />
    </div>
    <div className="flex-1 min-w-0">
      <Input
        type="date"
        className="w-full"
        value={lostDateTo}
        onChange={(e) => setLostDateTo(e.target.value)}
      />
    </div>
  </div>
</div>


        {/* Apply Button */}
        <Button
          variant="ghost"
          className="w-full text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border rounded-md"
          onClick={handleApply}
        >
          Apply filter
        </Button>
      </PopoverContent>
    </Popover>
  );
}
