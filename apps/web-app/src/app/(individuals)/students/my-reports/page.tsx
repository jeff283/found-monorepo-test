'use client';

import { Suspense, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/common/dashboard-header";
import { studentNavItems, defaultStudentUser } from "@/components/students/dashboard-header.config";
import { Search as SearchIcon, ChevronRight } from "lucide-react";

/* ==== Types ==== */
type ReportStatus = "Open" | "Matched" | "Closed";
type Report = {
  id: string;
  referenceId: string;
  title: string;
  status: ReportStatus;
  createdAt: string;   // ISO
  updatedAt?: string;  // optional
  lastSeenPlace?: string;
  lastSeenTime?: string;
  description?: string;
};

// Toolbar unions (for clean onChange typing)
type StatusFilter = "All" | ReportStatus;
type SortKey = "createdAt" | "status" | "title";

/* ==== Mock data (swap with your fetch) ==== */
const mock: Report[] = [
  { id: "1", referenceId: "USA-USA-30224", title: "Black AirPods Pro", status: "Matched", createdAt: "2025-08-17T10:00:00Z", updatedAt: "2025-08-17T12:00:00Z", lastSeenPlace: "Main Library Entrance", lastSeenTime: "Today, 10:42", description: "Small scratch on case." },
  { id: "2", referenceId: "USA-USA-16497", title: "Blue Hydro Flask",  status: "Open",    createdAt: "2025-08-15T09:30:00Z", lastSeenPlace: "Student Center", lastSeenTime: "Yesterday, 17:10" },
  { id: "3", referenceId: "USA-USA-12345", title: "Lost Wallet",       status: "Closed",  createdAt: "2025-08-10T14:20:00Z", updatedAt: "2025-08-12T10:00:00Z" },
  { id: "4", referenceId: "USA-USA-98765", title: "Red Backpack",      status: "Open",    createdAt: "2025-08-05T11:15:00Z" },
];

/* ==== Page ==== */
export default function MyReportsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <MyReportsPage />
    </Suspense>
  );
}

// Rename your original export to MyReportsPage:
function MyReportsPage() {
  const searchParams = useSearchParams();

  // Replace with your data fetching (TanStack Query etc.)
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // initial selection via ?selected=USA-USA-30224 (optional)
  const selectedFromQuery = searchParams.get("selected") || undefined;
  const [selectedRefId, setSelectedRefId] = useState<string | undefined>(selectedFromQuery);

  useEffect(() => {
    // fetch here; using mock for now
    setLoading(true);
    const timer = setTimeout(() => { setReports(mock); setLoading(false); }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedRefId && reports.length) {
      // default to first report
      setSelectedRefId(reports[0].referenceId);
    }
  }, [reports, selectedRefId]);

  // toolbar state
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<SortKey>("createdAt");

  // derived rows
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const r = reports.filter(r =>
      (status === "All" || r.status === status) &&
      (q === "" || r.title.toLowerCase().includes(q) || r.referenceId.toLowerCase().includes(q))
    );
    // sort
    r.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      // createdAt desc
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return r;
  }, [reports, query, status, sortBy]);

  const selected =
    filtered.find(r => r.referenceId === selectedRefId) ||
    reports.find(r => r.referenceId === selectedRefId);

  return (
    <div className="space-y-6">
      <DashboardHeader navItems={studentNavItems} user={defaultStudentUser} />

      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-0">
        <h1 className="headline-1 mb-4">My Reports</h1>

        {/* Toolbar */}
        <div className="rounded-2xl border bg-card p-4 md:p-5 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or reference ID…"
                className="w-full rounded-lg border px-9 py-2 bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="caption-small text-muted-foreground">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                className="rounded-lg border bg-background px-2 py-2"
              >
                <option>All</option>
                <option>Open</option>
                <option>Matched</option>
                <option>Closed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="caption-small text-muted-foreground">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-lg border bg-background px-2 py-2"
              >
                <option value="createdAt">Newest</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Master–detail */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* List */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border bg-card overflow-hidden">
              <table className="w-full text-sm border-separate border-spacing-0">
                <thead className="bg-muted/40">
                  <tr className="[&_th]:px-5 [&_th]:py-3 text-left">
                    <th>Item</th>
                    <th className="hidden md:table-cell">Reference</th>
                    <th>Status</th>
                    <th className="hidden sm:table-cell">Created</th>
                    <th />
                  </tr>
                </thead>
                <tbody className="[&_tr]:border-b [&_td]:px-5 [&_td]:py-3">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={`sk-${i}`} className="animate-pulse">
                        <td><div className="h-4 w-40 bg-muted rounded" /></td>
                        <td className="hidden md:table-cell"><div className="h-4 w-32 bg-muted rounded" /></td>
                        <td><div className="h-5 w-16 bg-muted rounded-full" /></td>
                        <td className="hidden sm:table-cell"><div className="h-4 w-24 bg-muted rounded" /></td>
                        <td><div className="h-4 w-16 bg-muted rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-muted-foreground">
                        No reports match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => {
                      const isSelected = r.referenceId === selectedRefId;
                      return (
                        <tr
                          key={r.referenceId}
                          onClick={() => setSelectedRefId(r.referenceId)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-accent/40" : "hover:bg-muted/30"
                          }`}
                          aria-selected={isSelected}
                        >
                          <td className="font-medium">{r.title}</td>
                          <td className="hidden md:table-cell">
                            <code className="rounded bg-muted px-2 py-0.5">{r.referenceId}</code>
                          </td>
                          <td><StatusPill status={r.status} /></td>
                          <td className="hidden sm:table-cell">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                          <td className="text-right">
                            <Link
                              href={`/students/my-reports/${r.referenceId}`}
                              className="button-text-small text-primary inline-flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Track <ChevronRight className="size-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preview pane */}
          <div className="md:col-span-1">
            <div className="rounded-2xl border bg-card p-4 md:p-5 sticky top-4">
              <h3 className="headline-1 mb-3">Selected report</h3>

              {!selected ? (
                <p className="caption-small text-muted-foreground">Select a report from the list to see details.</p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="button-text-small">{selected.title}</p>
                    <p className="caption-small text-muted-foreground">
                      Ref: <code className="bg-muted px-1.5 py-0.5 rounded">{selected.referenceId}</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusPill status={selected.status} />
                    <span className="caption-small text-muted-foreground">
                      {selected.updatedAt
                        ? `Updated ${new Date(selected.updatedAt).toLocaleString()}`
                        : `Created ${new Date(selected.createdAt).toLocaleString()}`}
                    </span>
                  </div>

                  {selected.lastSeenPlace && (
                    <p className="caption-small">
                      <span className="text-muted-foreground">Last seen:</span> {selected.lastSeenPlace}
                      {selected.lastSeenTime ? ` • ${selected.lastSeenTime}` : ""}
                    </p>
                  )}
                  {selected.description && (
                    <p className="caption-small text-muted-foreground">{selected.description}</p>
                  )}

                  <div className="grid gap-2 mt-2">
                    <Link
                      href={`/students/my-reports/${selected.referenceId}`}
                      className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-center button-text-small"
                    >
                      Track Report
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="rounded-md border px-3 py-2 button-text-small hover:bg-muted">
                        Edit
                      </button>
                      <button className="rounded-md border px-3 py-2 button-text-small hover:bg-muted">
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary card */}
            <div className="rounded-2xl border bg-card p-4 md:p-5 mt-4">
              <p className="button-text-small mb-1">Need to report something else?</p>
              <Link href="/students/report-lost" className="button-text-small text-primary">
                Report new item →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==== Tiny UI helpers ==== */
function StatusPill({ status }: { status: "Open" | "Matched" | "Closed" }) {
  const tone =
    status === "Matched" ? "bg-teal-100 text-secondary" :
    status === "Closed"  ? "bg-destructive/10 text-destructive" :
                           "bg-muted text-muted-foreground";
  return <span className={`caption-small px-2 py-1 rounded-full ${tone}`}>{status}</span>;
}
