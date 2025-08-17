'use client';

import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Copy, BadgeCheck, Clock } from "lucide-react";
import { DashboardHeader } from "@/components/common/dashboard-header";
import { studentNavItems, defaultStudentUser } from "@/components/students/dashboard-header.config";
import { MatchesPreviewTable } from "@/components/students/MatchesPreviewTable";

type Report = {
  id: string;
  title: string;
  status: "Open" | "Matched" | "Closed";
  createdAt: string;
  updatedAt: string;
  lastSeenPlace: string;
  lastSeenTime: string;
  description?: string;
};

type MatchRow = {
  id: string;
  item: string;
  location: string;
  confidence: number;
  updatedAt: string;
  imageUrl?: string;
};

export default function TrackReportPage() {
  const { referenceId } = useParams<{ referenceId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [matches, setMatches] = useState<MatchRow[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        // TODO: replace with real API calls:
        // const r = await fetch(`/api/students/reports/${referenceId}`).then(r => r.json());
        // const m = await fetch(`/api/students/reports/${referenceId}/matches`).then(r => r.json());

        const r: Report = {
          id: String(referenceId),
          title: "Black AirPods Pro",
          status: "Matched",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastSeenPlace: "Main Library Entrance",
          lastSeenTime: "Today, 10:42",
          description: "Left in reading area, small scratch on case.",
        };

        const m: MatchRow[] = [
          { id: "m1", item: "Black AirPods Pro", location: "Info Desk - Library", confidence: 82, updatedAt: "2h ago" },
          { id: "m2", item: "Black Earbuds",     location: "Student Center",       confidence: 57, updatedAt: "Yesterday" },
        ];

        if (!alive) return;
        setReport(r);
        setMatches(m);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [referenceId]);

  const steps = useMemo(() => ([
    { label: "Reported",           done: true },
    { label: "Under review",       done: report?.status !== "Open" },
    { label: "Matched",            done: report?.status === "Matched" || report?.status === "Closed" },
    { label: "Claim in progress",  done: false }, // set to true when a claim exists
    { label: "Returned / Closed",  done: report?.status === "Closed" },
  ]), [report?.status]);

  function copyRef() {
    navigator.clipboard.writeText(String(referenceId));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  if (!referenceId) notFound();

  return (
    <div className="space-y-6">
      <DashboardHeader navItems={studentNavItems} user={defaultStudentUser} />

      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-0 space-y-6">
        {/* Back + reference */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back
          </button>

          <div className="flex items-center gap-2">
            <span className="caption-small text-muted-foreground">Reference ID</span>
            <code className="rounded-md bg-muted px-2 py-1">{referenceId}</code>
            <button
              onClick={copyRef}
              className="caption-small inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-muted"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border bg-card p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="title-2">{report?.title ?? "Loading…"}</h1>
              <p className="caption-small text-muted-foreground">
                Created today • Last updated just now
              </p>
            </div>
            <StatusPill status={report?.status ?? "Open"} />
          </div>

          {/* Steps */}
          <ul className="mt-6 flex flex-wrap gap-3">
            {steps.map((s, i) => (
              <li key={i} className="inline-flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${s.done ? "bg-teal-500" : "bg-muted"}`} />
                <span className={`caption-small ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Matches */}
          <div className="md:col-span-2">
            <MatchesPreviewTable rows={matches} isLoading={loading} seeAllHref="/students/matches" />
          </div>

          {/* Details + actions */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-xl border p-4">
              <h3 className="title-3 mb-3">Report details</h3>

              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-4 w-56 rounded bg-muted" />
                  <div className="h-20 w-full rounded bg-muted" />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="caption-small"><span className="text-muted-foreground">Last seen:</span> {report?.lastSeenPlace}</p>
                  <p className="caption-small"><span className="text-muted-foreground">Time:</span> {report?.lastSeenTime}</p>
                  {report?.description && <p className="caption-small text-muted-foreground">{report.description}</p>}
                </div>
              )}

              <div className="mt-4 grid gap-2">
                <button className="button-text-small rounded-md border px-3 py-2 hover:bg-muted" disabled={report?.status !== "Open"}>
                  Edit report
                </button>
                <button className="button-text-small rounded-md border px-3 py-2 hover:bg-muted">
                  Withdraw
                </button>
                <button className="button-text-small rounded-md px-3 py-2 bg-primary text-primary-foreground">
                  Mark as found
                </button>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <p className="button-text-small mb-1">Want to see everything?</p>
              <Link href="/students/my-reports" className="button-text-small text-primary">
                View all my reports →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* tiny UI */
function StatusPill({ status }: { status: "Open" | "Matched" | "Closed" }) {
  const tone =
    status === "Matched" ? "bg-teal-100 text-secondary" :
    status === "Closed"  ? "bg-destructive/10 text-destructive" :
                           "bg-muted text-muted-foreground";
  const Icon = status === "Matched" ? BadgeCheck : Clock;
  return (
    <span className={`caption-small px-2 py-1 rounded-full inline-flex items-center gap-1 ${tone}`}>
      <Icon className="size-4" /> {status}
    </span>
  );
}
