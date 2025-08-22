'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search as SearchIcon } from "lucide-react";
import Image from "next/image";

type Match = {
  id: string;
  item: string;
  location: string;
  confidence: number; 
  updatedAt: string;  
  imageUrl?: string;  
};

export function MatchesPreviewTable({
  rows,
  seeAllHref = "/students/matches",
  isLoading = false, 
}: {
  rows: Match[];
  seeAllHref?: string;
  isLoading?: boolean;
}) {
  // --- Toolbar state ---
  const [query, setQuery] = useState("");
  const [minConfidence, setMinConfidence] = useState(0); // 0, 50, 80 quick filter
  const [sortBy, setSortBy] = useState<"confidence" | "updated">("confidence");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const r = rows.filter(r =>
      (r.confidence >= minConfidence) &&
      (q === "" || r.item.toLowerCase().includes(q) || r.location.toLowerCase().includes(q))
    );
    r.sort((a, b) =>
      sortBy === "confidence" ? b.confidence - a.confidence : 0 // (server can send recency)
    );
    return r.slice(0, 5);
  }, [rows, query, minConfidence, sortBy]);

  function clearFilters() {
    setQuery("");
    setMinConfidence(0);
    setSortBy("confidence");
  }

  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm w-full max-w-full overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-4 md:p-5 border-b rounded-t-2xl">
        <h3 className="text-base md:text-lg font-semibold">
          Possible matches
          <span className="ml-2 caption-small text-muted-foreground align-middle">
            ({Math.min(5, rows.length)})
          </span>
        </h3>
        <Link href={seeAllHref} className="button-text-small text-primary inline-flex items-center gap-1">
          See all <ChevronRight className="size-4" />
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 px-4 md:px-5 py-3 border-b">
        <div className="relative flex-1 min-w-[180px] md:min-w-[220px]">
          <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search item or location…"
            disabled={isLoading}
            className="w-full rounded-lg border px-9 py-2 bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-60 text-sm md:text-base"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="caption-small text-muted-foreground">Min conf.</label>
          <select
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            disabled={isLoading}
            className="rounded-lg border bg-background px-2 py-2 disabled:opacity-60 text-sm md:text-base"
          >
            <option value={0}>All</option>
            <option value={50}>≥ 50%</option>
            <option value={80}>≥ 80%</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="caption-small text-muted-foreground">Sort</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "confidence" | "updated")}
            disabled={isLoading}
            className="rounded-lg border bg-background px-2 py-2 disabled:opacity-60 text-sm md:text-base"
          >
            <option value="confidence">Confidence</option>
            <option value="updated">Updated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-b-2xl">
        <table className="w-full text-xs md:text-sm border-separate border-spacing-0 min-w-[480px]">
          <thead className="bg-muted/40">
            <tr className="[&_th]:px-3 md:[&_th]:px-5 [&_th]:py-2 md:[&_th]:py-3 text-left">
              <th>Item</th>
              <th className="hidden md:table-cell">Found at</th>
              <th>Confidence</th>
              <th className="hidden sm:table-cell">Updated</th>
              <th />
            </tr>
          </thead>

          <tbody className="[&_tr]:border-b [&_tr]:border-muted/60 [&_td]:px-3 md:[&_td]:px-5 [&_td]:py-2 md:[&_td]:py-3">
            {/* SKELETON STATE */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  <td className="py-4">
                    <div className="h-4 w-32 md:w-40 rounded bg-muted" />
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="h-4 w-24 md:w-32 rounded bg-muted" />
                  </td>
                  <td>
                    <div className="h-6 w-16 md:w-20 rounded-full bg-muted" />
                  </td>
                  <td className="hidden sm:table-cell">
                    <div className="h-4 w-12 md:w-16 rounded bg-muted" />
                  </td>
                  <td className="text-right">
                    <div className="h-4 w-12 md:w-16 rounded bg-muted inline-block" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              // EMPTY STATE + CTAs
              <tr>
                <td colSpan={5} className="py-8 md:py-10">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <p className="body-small text-muted-foreground">
                      No matches for your filters.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={clearFilters}
                        className="button-text-small rounded-md border px-3 py-2 hover:bg-muted"
                      >
                        Clear filters
                      </button>
                      <Link
                        href="/student/report-lost"
                        className="button-text-small inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-2"
                      >
                        Report Lost
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="font-medium">
                    <div className="flex items-center gap-2 md:gap-3">
                      {m.imageUrl && (
                        <Image
                          src={m.imageUrl}
                          alt=""
                          width={28}
                          height={28}
                          className="h-7 w-7 md:h-8 md:w-8 rounded-md object-cover"
                        />
                      )}
                      <span className="truncate max-w-[120px] md:max-w-none">{m.item}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">{m.location}</td>
                  <td><ConfidencePill value={m.confidence} /></td>
                  <td className="hidden sm:table-cell">{m.updatedAt}</td>
                  <td className="text-right">
                    <Link href={`/students/matches/${m.id}`} className="button-text-small text-primary">
                      Review &amp; claim
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConfidencePill({ value }: { value: number }) {
  let tone = "bg-gray-200 text-gray-700";      // Default: gray
  if (value >= 80) tone = "bg-green-100 text-green-700";   // High: green
  else if (value >= 50) tone = "bg-orange-100 text-orange-700"; // Medium: orange
  return (
    <span className={`caption-small px-2 py-1 rounded-full inline-block ${tone}`}>
      {value}% match
    </span>
  );
}