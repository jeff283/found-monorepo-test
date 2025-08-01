'use client';

import { ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// ...existing code...

interface Note {
  name: string;
  message: string;
  date: string;
  time: string;
}

export function Notes() {
  const notes: Note[] = Array(3).fill({
    name: 'Tomas bounce',
    message: 'Multiple similar claims found for a black backpack. Cross-check photos before final match',
    date: 'July 24',
    time: '10:00 AM',
  });

  return (
    <Card className="border-transparent shadow-none bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Notes</CardTitle>
            <p className="text-sm text-muted-foreground opacity-70">
              Internal communication threads or updates
            </p>
          </div>
          <ChevronRight
            className="w-4 h-5 text-cyan-500"
            aria-label="See more notes"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col divide-y divide-dashed divide-muted-foreground/30 px-4 pb-4">
        {notes.map((note, index) => (
          <div key={index} className="py-4 space-y-1">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm text-foreground">{note.name}</p>
              <p className="text-xs text-muted-foreground">
                {note.date} &nbsp; {note.time}
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-snug opacity-70">
              {note.message}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
