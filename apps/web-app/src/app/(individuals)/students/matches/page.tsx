'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/common/dashboard-header";
import { studentNavItems, defaultStudentUser } from "@/components/students/dashboard-header.config";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";

/* ===== Types ===== */
type ClaimStatus = "Unclaimed" | "Pending" | "Approved" | "Denied";
type MatchRow = {
  id: string;
  item: string;
  imageUrl?: string;
  location: string;
  confidence: number;   // 0..100
  updatedAt: string;    // human "2h ago"
  reportRef: string;    // which report we matched to
  reportTitle: string;  // title of the student's report
  claimStatus: ClaimStatus;
};

/* ===== Mock data (swap with fetch) ===== */
const MOCK: MatchRow[] = [
  { id: "m1", item: "Black AirPods Pro", location: "Info Desk – Library", confidence: 82, updatedAt: "2h ago", reportRef: "USA-USA-30224", reportTitle: "Black AirPods Pro", claimStatus: "Unclaimed" },
  { id: "m2", item: "Black Earbuds",     location: "Student Center",      confidence: 57, updatedAt: "Yesterday", reportRef: "USA-USA-30224", reportTitle: "Black AirPods Pro", claimStatus: "Pending" },
  { id: "m3", item: "Blue Hydro Flask",  location: "Gym Reception",       confidence: 66, updatedAt: "2d ago", reportRef: "USA-USA-16497", reportTitle: "Blue Hydro Flask", claimStatus: "Denied" },
  { id: "m4", item: "Lenovo ThinkPad",   location: "IT Helpdesk",         confidence: 41, updatedAt: "3d ago", reportRef: "USA-USA-98765", reportTitle: "Red Backpack", claimStatus: "Unclaimed" },
  { id: "m5", item: "Casio FX-991EX",    location: "Room B204",           confidence: 73, updatedAt: "Yesterday", reportRef: "USA-USA-16497", reportTitle: "Blue Hydro Flask", claimStatus: "Approved" },
];

/* ===== Page ===== */
export default function MatchesPage() {
  // data
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  // toolbar state
  const [query, setQuery] = useState("");
  const [reportFilter, setReportFilter] = useState<string>("All");
  const [minConf, setMinConf] = useState(0);
  const [claim, setClaim] = useState<"All" | ClaimStatus>("All");
  const [sortBy, setSortBy] = useState<"confidence" | "updated" | "item">("confidence");
  const [groupByReport, setGroupByReport] = useState(false);

  // pagination (client)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // swap with your fetcher (TanStack Query, etc.)
    setLoading(true);
    const t = setTimeout(() => { setRows(MOCK); setLoading(false); }, 150);
    return () => clearTimeout(t);
  }, []);

  const reportOptions = useMemo(() => {
    const set = Array.from(new Set(rows.map(r => `${r.reportRef} — ${r.reportTitle}`)));
    return set;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const r = rows.filter(r =>
      r.confidence >= minConf &&
      (q === "" || r.item.toLowerCase().includes(q) || r.location.toLowerCase().includes(q)) &&
      (reportFilter === "All" || `${r.reportRef} — ${r.reportTitle}` === reportFilter) &&
      (claim === "All" || r.claimStatus === claim)
    );
    // sort
    r.sort((a, b) => {
      if (sortBy === "confidence") return b.confidence - a.confidence;
      if (sortBy === "item") return a.item.localeCompare(b.item);
      return 0; // if you send latest-first from server, keep it
    });
    return r;
  }, [rows, query, minConf, reportFilter, claim, sortBy]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="space-y-6">
      <DashboardHeader navItems={studentNavItems} user={defaultStudentUser} />

      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-0 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="title-2">All Matches</h1>
          <ConfidenceLegend />
        </div>

        {/* Toolbar */}
        <div className="rounded-2xl border bg-card p-4 md:p-5 sticky top-2 z-[1]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search item or location…"
                className="w-full rounded-lg border px-9 py-2 bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Select
              label="Report"
              value={reportFilter}
              onChange={(v) => { setReportFilter(v); setPage(1); }}
              options={["All", ...reportOptions]}
            />
            <Select
              label="Min conf."
              value={String(minConf)}
              onChange={(v) => { setMinConf(Number(v)); setPage(1); }}
              options={["0","50","80"]}
              display={["All","≥ 50%","≥ 80%"]}
            />
            <Select
              label="Claim"
              value={claim}
              onChange={(v) => { setClaim(v as "All" | "Unclaimed" | "Pending" | "Approved" | "Denied"); setPage(1); }}
              options={["All","Unclaimed","Pending","Approved","Denied"]}
            />
            <Select
              label="Sort"
              value={sortBy}
              onChange={(v) => setSortBy(v as "confidence" | "item" | "updated")}
              options={["confidence","item","updated"]}
              display={["Confidence","Item","Updated"]}
            />

            <label className="ml-auto inline-flex items-center gap-2 caption-small">
              <input
                type="checkbox"
                className="accent-current"
                checked={groupByReport}
                onChange={(e) => setGroupByReport(e.target.checked)}
              />
              Group by report
            </label>
          </div>
        </div>

        {/* Grouped view */}
        {groupByReport ? (
          <GroupedByReportView loading={loading} data={slice} />
        ) : (
          <FlatCardView loading={loading} data={slice} />
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="caption-small text-muted-foreground">
            Showing {(pageSafe - 1) * pageSize + 1}-{Math.min(pageSafe * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="inline-flex items-center gap-2">
            <button
              className="rounded-md border px-2 py-1 disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={pageSafe <= 1}
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="caption-small">Page {pageSafe} / {totalPages}</span>
            <button
              className="rounded-md border px-2 py-1 disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={pageSafe >= totalPages}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Views ===== */
function GroupedByReportView({ loading, data }: { loading: boolean; data: MatchRow[] }) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-5">
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 w-64 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center text-muted-foreground">
        No matches for your current filters.
      </div>
    );
  }

  // group by reportRef
  const groups = data.reduce<Record<string, MatchRow[]>>((acc, row) => {
    (acc[row.reportRef] ||= []).push(row);
    return acc;
  }, {});
  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([ref, rows]) => (
        <div key={ref} className="rounded-2xl border bg-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <p className="button-text-small">Report <code className="bg-muted px-1.5 py-0.5 rounded">{ref}</code></p>
              <p className="caption-small text-muted-foreground">{rows[0].reportTitle}</p>
            </div>
            <Link href={`/students/my-reports/${ref}`} className="button-text-small text-primary">Track report →</Link>
          </div>
          <FlatCardView loading={false} data={rows} />
        </div>
      ))}
    </div>
  );
}

function FlatCardView({ loading, data }: { loading: boolean; data: MatchRow[] }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-muted/40 p-6 animate-pulse h-40" />
        ))}
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
        No matches for your current filters.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data.map((m) => (
        <div key={m.id} className="rounded-xl border bg-card p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {m.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.imageUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
            )}
            <div>
              <div className="font-semibold">{m.item}</div>
              <div className="caption-small text-muted-foreground">{m.location}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ConfidencePill value={m.confidence} />
            <ClaimStatusPill status={m.claimStatus} />
            <span className="caption-small text-muted-foreground">{m.updatedAt}</span>
          </div>
          <div className="flex flex-col gap-1 mt-auto">
            <span className="caption-small text-muted-foreground">
              Matched to <code className="bg-muted px-1.5 py-0.5 rounded">{m.reportRef}</code>
            </span>
            <span className="caption-small">{m.reportTitle}</span>
          </div>
          <Link
            href={`/students/matches/${m.id}`}
            className="button-text-small text-primary mt-2 self-end"
          >
            Review &amp; claim
          </Link>
        </div>
      ))}
    </div>
  );
}

/* ===== UI helpers ===== */
function Select({
  label, value, onChange, options, display,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  display?: string[];
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="caption-small text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border bg-background px-2 py-2"
      >
        {options.map((o, i) => (
          <option key={o} value={o}>{display ? display[i] : o}</option>
        ))}
      </select>
    </div>
  );
}

function ConfidenceLegend() {
  return (
    <div className="hidden md:flex items-center gap-2">
      <span className="caption-small text-muted-foreground">Legend:</span>
      <span className="caption-small px-2 py-0.5 rounded-full bg-teal-100 text-secondary">≥80%</span>
      <span className="caption-small px-2 py-0.5 rounded-full bg-accent text-secondary">50–79%</span>
      <span className="caption-small px-2 py-0.5 rounded-full bg-muted text-muted-foreground">&lt;50%</span>
    </div>
  );
}

function ConfidencePill({ value }: { value: number }) {
  let tone = "bg-muted text-muted-foreground";
  if (value >= 80) tone = "bg-teal-100 text-secondary";
  else if (value >= 50) tone = "bg-accent text-secondary";
  return <span className={`caption-small px-2 py-1 rounded-full inline-block ${tone}`}>{value}% match</span>;
}

function ClaimStatusPill({ status }: { status: ClaimStatus }) {
  const tone =
    status === "Approved" ? "bg-teal-100 text-secondary" :
    status === "Pending"  ? "bg-muted text-muted-foreground" :
    status === "Denied"   ? "bg-destructive/10 text-destructive" :
                            "bg-accent text-secondary";
  return <span className={`caption-small px-2 py-1 rounded-full inline-block ${tone}`}>{status}</span>;
}
