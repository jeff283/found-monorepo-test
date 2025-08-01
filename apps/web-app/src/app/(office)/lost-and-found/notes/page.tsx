'use client';

import { DashboardHeader } from '@/components/lost-and-found-dashboard/dashboard-header';
import { TableHeader } from '@/components/lost-and-found-dashboard/notes/TableHeader';
import Notes from '@/components/lost-and-found-dashboard/notes/notes';

const mockUser = {
  name: "Victor Musembi",
  role: "Institution Admin",
  avatar: "/avatars/avatar-1.webp",
};

const NOTES_DATA = new Array(30).fill(null).map((_, i) => ({
  name: 'Tomas bounce',
  role: 'Administrator',
  content:
    'Multiple similar claims have been found for a black backpack. Please carefully cross-check the provided photos and details to ensure an accurate match before confirming the final claim.',
  date: 'July 24',
  time: '10:00 AM',
  id: i + 1,
}));

export default function NotesPage() {
  return (
    <div>
      <DashboardHeader user={mockUser} />
      <main className="p-6 md:p-10">
        <TableHeader onFilterApply={() => {}} />
        <div className="mt-8">
          <Notes notes={NOTES_DATA} />
        </div>
        {/* Pagination */}
      </main>
    </div>
  );
}
