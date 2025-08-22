'use client';

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Clock, X, Paperclip } from "lucide-react";
import { DashboardHeader } from "@/components/common/dashboard-header";
import { studentNavItems, defaultStudentUser } from "@/components/students/dashboard-header.config";

/* ---------- Types ---------- */
type ClaimStatus = "Unclaimed" | "Pending" | "Approved" | "Denied";
type MatchDetail = {
  id: string;
  item: string;
  location: string;
  foundDate: string;      // human (e.g., "June 17, 2025") or format as you wish
  description: string;
  images: string[];
  confidence: number;     // 0..100
  reportRef: string;      // the student's report this matched to
  reportTitle: string;
  claimStatus: ClaimStatus;
};

/* ---------- Page ---------- */
export default function MatchDetailPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [match, setMatch]   = useState<MatchDetail | null>(null);
  const [showClaim, setShowClaim] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // Add the mock array here
  const MOCK: MatchDetail[] = [
    { id: "m1", item: "Black AirPods Pro", location: "Info Desk – Library", foundDate: "2h ago", description: "Black AirPods Pro in case, found at Info Desk.", images: [], confidence: 96, reportRef: "USA-USA-30224", reportTitle: "Black AirPods Pro", claimStatus: "Unclaimed" },
    { id: "m2", item: "Black Earbuds", location: "Student Center", foundDate: "Yesterday", description: "Black Earbuds found at Student Center.", images: [], confidence: 57, reportRef: "USA-USA-30224", reportTitle: "Black AirPods Pro", claimStatus: "Pending" },
    { id: "m3", item: "Blue Hydro Flask", location: "Gym Reception", foundDate: "2d ago", description: "Blue Hydro Flask found at Gym Reception.", images: [], confidence: 66, reportRef: "USA-USA-16497", reportTitle: "Blue Hydro Flask", claimStatus: "Denied" },
    { id: "m4", item: "Lenovo ThinkPad", location: "IT Helpdesk", foundDate: "3d ago", description: "Lenovo ThinkPad found at IT Helpdesk.", images: [], confidence: 41, reportRef: "USA-USA-98765", reportTitle: "Red Backpack", claimStatus: "Unclaimed" },
    { id: "m5", item: "Casio FX-991EX", location: "Room B204", foundDate: "Yesterday", description: "Casio FX-991EX calculator found in Room B204.", images: [], confidence: 93, reportRef: "USA-USA-16497", reportTitle: "Blue Hydro Flask", claimStatus: "Approved" },
    { id: "m6", item: "Lenovo ThinkPad", location: "IT Helpdesk", foundDate: "3d ago", description: "Lenovo ThinkPad found at IT Helpdesk.", images: [], confidence: 81, reportRef: "USA-USA-98765", reportTitle: "Red Backpack", claimStatus: "Unclaimed" },
    { id: "m7", item: "Apple Watch", location: "Gym Reception", foundDate: "1h ago", description: "Apple Watch found at Gym Reception.", images: [], confidence: 85, reportRef: "USA-USA-30224", reportTitle: "Apple Watch", claimStatus: "Approved" },
    // Add more as needed
  ];

  useEffect(() => {
    let alive = true;
    setLoading(true);

    // Find the match in MOCK by matchId
    const found = MOCK.find(m => m.id === String(matchId));
    if (!alive) return;
    if (found) {
      setMatch(found);
    } else {
      setMatch(null);
    }
    setLoading(false);

    return () => { alive = false; };
  }, [matchId]);

  const status = useMemo<ClaimStatus>(() => {
    if (claimSubmitted) return "Pending";
    return match?.claimStatus ?? "Unclaimed";
  }, [match?.claimStatus, claimSubmitted]);

  function handleStartClaim() {
    // TODO: POST /api/students/matches/:id/claim with form values
    // await fetch(..., { method:"POST", body: JSON.stringify(form) })
    setShowClaim(false);
    setClaimSubmitted(true);
  }

  function handleReject() {
    // optional: POST /api/students/matches/:id/reject
    setRejecting(true);
    setTimeout(() => {
      setRejecting(false);
      router.push("/students/matches"); // back to list after rejecting
    }, 600);
  }

  return (
    <div className="space-y-6">
      <DashboardHeader navItems={studentNavItems} user={defaultStudentUser} />

      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-0 space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </button>

        {/* Summary card */}
        <div className="rounded-2xl border bg-card p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="headline-1 break-words">{match?.item ?? "Loading…"}</h1>
              {!loading && (
                <p className="caption-small text-muted-foreground">
                  Found at <span className="text-foreground">{match?.location}</span> • {match?.foundDate}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ConfidencePill value={match?.confidence ?? 0} />
              <ClaimStatusPill status={status} />
            </div>
          </div>

          {/* quick links */}
          {!loading && match && (
            <div className="mt-3 caption-small text-muted-foreground">
              Matched to report{" "}
              <Link href={`/students/my-reports/${match.reportRef}`} className="text-primary">
                {match.reportRef}
              </Link>{" "}
              <span className="text-muted-foreground">•</span>{" "}
              <Link href={`/students/my-reports/${match.reportRef}`} className="text-primary">
                View report
              </Link>
            </div>
          )}
        </div>

        {/* Content grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: evidence / description */}
          <div className="md:col-span-2 space-y-6">
            {/* Images */}
            {/* <div className="rounded-2xl border bg-card p-4 md:p-5"> */}
              {/* <h3 className="title-3 mb-3">Photos</h3>
              {loading ? (
                <div className="grid grid-cols-2 gap-3 animate-pulse">
                  <div className="h-32 rounded bg-muted" />
                  <div className="h-32 rounded bg-muted" />
                </div>
              ) : match?.images?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {match.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt="" className="h-32 w-full rounded-lg object-cover" />
                  ))}
                </div>
              ) : (
                <p className="caption-small text-muted-foreground">No photos provided.</p>
              )}
            </div> */}

            {/* Description */}
            <div className="rounded-2xl border bg-card p-4 md:p-5">
              <h3 className="headline-1 font-semibold mb-2">Description</h3>
              <p className="caption-small text-muted-foreground">{loading ? "…" : match?.description}</p>
            </div>

            {/* Similarity breakdown (optional visual stub) */}
            <div className="rounded-2xl border bg-card p-4 md:p-5">
              <h3 className="headline-1 mb-3">Why this might be a match</h3>
              <ul className="space-y-2 caption-small">
                <li>• Color and form factor match</li>
                <li>• Location near where you reported losing it</li>
                <li>• Time window overlaps your loss time</li>
              </ul>
              <p className="caption-small text-muted-foreground mt-2">
                Confidence is an AI score; staff will verify your claim before release.
              </p>
            </div>
          </div>

          {/* Right: claim card */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border bg-card p-4 md:p-5 sticky top-4">
              <h3 className="headline-1 mb-3">Claim this item</h3>

              {status === "Pending" ? (
                <div className="rounded-md bg-teal-50 text-secondary px-3 py-2 mb-3">
                  <p className="caption-small">
                    <strong>Claim submitted.</strong> Staff will review and contact you with next steps.
                  </p>
                </div>
              ) : null}

              <div className="grid gap-2 mb-3">
                <div className="caption-small text-muted-foreground">
                  By claiming, you’ll provide proof of ownership (serials, photos, notes). Staff will verify before pickup.
                </div>
              </div>

              <div className="grid gap-2">
                <button
                  disabled={status !== "Unclaimed"}
                  onClick={() => setShowClaim(true)}
                  className="rounded-md bg-primary text-primary-foreground px-3 py-2 button-text-small disabled:opacity-60"
                >
                  {status === "Unclaimed" ? "This is my item" : "Claim in review"}
                </button>

                <button
                  onClick={handleReject}
                  disabled={rejecting}
                  className="rounded-md border px-3 py-2 button-text-small hover:bg-muted disabled:opacity-60"
                >
                  {rejecting ? "Submitting…" : "Not my item"}
                </button>
              </div>
            </div>

            {/* small help */}
            <div className="rounded-2xl border bg-card p-4 md:p-5">
              <p className="button-text-small mb-1">Have questions?</p>
              <p className="caption-small text-muted-foreground">
                You can also track this match from your report page, or contact support.
              </p>
              {match && (
                <Link href={`/students/my-reports/${match.reportRef}`} className="button-text-small text-primary mt-2 inline-block">
                  Go to report →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claim dialog (simple inline modal) */}
      {showClaim && match && (
        <ClaimDialog
          onClose={() => setShowClaim(false)}
          onSubmit={handleStartClaim}
          defaultValues={{
            serialNumber: "",
            contact: "",
            pickupNotes: "",
            notes: "",
            files: [],
          }}
        />
      )}
    </div>
  );
}

/* ---------- UI helpers ---------- */

function ConfidencePill({ value }: { value: number }) {
  let tone = "bg-muted text-muted-foreground";
  if (value >= 80) tone = "bg-teal-100 text-secondary";
  else if (value >= 50) tone = "bg-accent text-secondary";
  return <span className={`caption-small px-2 py-1 rounded-full inline-block ${tone}`}>{value}% match</span>;
}

function ClaimStatusPill({ status }: { status: "Unclaimed" | "Pending" | "Approved" | "Denied" }) {
  const tone =
    status === "Approved" ? "bg-teal-100 text-secondary" :
    status === "Pending"  ? "bg-muted text-muted-foreground" :
    status === "Denied"   ? "bg-destructive/10 text-destructive" :
                            "bg-accent text-secondary";
  const Icon = status === "Approved" ? BadgeCheck : Clock;
  return (
    <span className={`caption-small px-2 py-1 rounded-full inline-flex items-center gap-1 ${tone}`}>
      <Icon className="size-4" /> {status}
    </span>
  );
}

/* ---------- Claim dialog (headless, no external dep) ---------- */

type ClaimFormValues = {
  serialNumber?: string;
  contact: string;          // email or phone
  pickupNotes?: string;     // preferred time/location or "I'll pick at front desk"
  notes?: string;           // anything else helpful
  files: File[];            // proof photos/screenshots
};

function ClaimDialog({
  onClose,
  onSubmit,
  defaultValues,
}: {
  onClose: () => void;
  onSubmit: (values: ClaimFormValues) => void;
  defaultValues: ClaimFormValues;
}) {
  const [values, setValues] = useState<ClaimFormValues>(defaultValues);
  const [submitting, setSubmitting] = useState(false);
  const [agree, setAgree] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setValues(v => ({ ...v, files }));
  }

  async function submit() {
    if (!values.contact || !agree) return;
    setSubmitting(true);
    // simulate upload
    setTimeout(() => {
      setSubmitting(false);
      onSubmit(values);
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-4 md:p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="title-3">Submit a claim</h3>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="caption-small">
            Serial number / unique identifier (optional)
            <input
              type="text"
              value={values.serialNumber ?? ""}
              onChange={(e) => setValues(v => ({ ...v, serialNumber: e.target.value }))}
              placeholder="e.g., S/N C02ZK..."
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="caption-small">
            Contact (email or phone)
            <input
              type="text"
              value={values.contact}
              onChange={(e) => setValues(v => ({ ...v, contact: e.target.value }))}
              placeholder="name@school.edu or +1 555 123 4567"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="caption-small">
            Pickup notes (optional)
            <input
              type="text"
              value={values.pickupNotes ?? ""}
              onChange={(e) => setValues(v => ({ ...v, pickupNotes: e.target.value }))}
              placeholder="When/where you can pick up"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="caption-small">
            Notes for staff (optional)
            <textarea
              value={values.notes ?? ""}
              onChange={(e) => setValues(v => ({ ...v, notes: e.target.value }))}
              placeholder="Describe stickers, scratches, case, passcode hint, etc."
              className="mt-1 w-full rounded-md border px-3 py-2 min-h-[90px]"
            />
          </label>

          <div className="caption-small">
            Proof photos / screenshots (optional)
            <label className="mt-1 flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer hover:bg-muted">
              <Paperclip className="size-4" />
              <span>Attach files</span>
              <input type="file" className="hidden" multiple onChange={handleFile} />
            </label>
            {values.files?.length ? (
              <p className="mt-1 caption-small text-muted-foreground">{values.files.length} file(s) selected</p>
            ) : null}
          </div>

          <label className="mt-2 inline-flex items-center gap-2 caption-small">
            <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
            I confirm the information is accurate and I am the rightful owner.
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button className="rounded-md border px-3 py-2 button-text-small hover:bg-muted" onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={!values.contact || !agree || submitting}
            onClick={submit}
            className="rounded-md bg-primary text-primary-foreground px-3 py-2 button-text-small disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit claim"}
          </button>
        </div>
      </div>
    </div>
  );
}
