'use client';

import { useState } from 'react';
import { FileText, MessageSquareMore } from 'lucide-react';

import { Pagination } from '@/components/shared/Pagination';
import { Card, CardContent } from '@/components/ui/card';



type Note = {
  name: string;
  role: string;
  content: string;
  date: string;
  time: string;
  id?: number;
};

type NotesProps = {
  notes: Note[];
};

// For generating 30 identical notes
export const sampleNotes: Note[] = Array.from({ length: 50 }, (_, i) => ({
  name: 'Tomas bounce',
  role: 'Administrator',
  content:
    'Multiple similar claims have been found for a black backpack. Please carefully cross-check the provided photos and details to ensure an accurate match before confirming the final claim.',
  date: 'July 24',
  time: '10:00 AM',
  id: i + 1,
}));

export default function Notes({ notes }: NotesProps) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(notes.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedNotes = notes.slice(startIdx, endIdx);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {paginatedNotes.map((note: Note, index: number) => (
          <Card key={note.id ?? index} className="bg-white shadow-sm border rounded-md p-4">
            <CardContent className="p-0">
              <div className="mb-2 flex items-center gap-6">
                <p className="font-semibold text-sm">{note.name}</p>
                <span className="text-xs text-gray-400">{note.role}</span>
              </div>
              <p className="text-sm text-gray-400/80">{note.content}</p>
              <div className="flex items-center justify-between mt-4 text-gray-700 font-bold text-sm">
                <div className="flex gap-2">
                  <FileText className="w-4 h-4" />
                  <MessageSquareMore className="w-4 h-4" />
                </div>
                <span className="font-normal text-gray-400">
                  {note.date} {note.time}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
