"use client";

import FoundlyButton from "@/admin/components/custom/FoundlyButton";

export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen flex-col">
      <div className="flex flex-col items-center gap-4">
        <h1 className="title-1">Hello Admin</h1>
        <FoundlyButton variant="default" href="https://foundlyhq.com">
          Click Him
        </FoundlyButton>
      </div>
    </main>
  );
}
