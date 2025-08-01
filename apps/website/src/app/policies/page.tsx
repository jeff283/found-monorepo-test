import type { Metadata } from "next";

export default function FoundlyTermsPrivacyPolicy() {
  return (
    <div className="font-host bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Title */}
        <h1 className="title-1 text-center mb-12">
          Foundly: Terms of Use and Privacy Policy
        </h1>

        {/* Introduction */}
        <div className="space-y-6 mb-12">
          <p className="body-1 text-center">
            This version of our terms, privacy policy, and claim verification
            approach was written to be understandable, practical, and focused on
            doing the right thing. If you have questions, just email{" "}
            <a
              href="mailto:support@foundlyhq.com"
              className="text-primary hover:underline"
            >
              support@foundlyhq.com
            </a>{" "}
            — we&apos;re happy to help.
          </p>
        </div>

        <hr className="border-border mb-12" />

        {/* Section 1: Terms of Service */}
        <section className="space-y-6 mb-12">
          <h2 className="title-3 mb-6">Terms of Service</h2>

          <p className="body-1 mb-8">
            Thanks for using Foundly. We&apos;ve written these terms to make it
            clear how we work and what you can expect when you use our platform.
            If you continue using Foundly, you&apos;re agreeing to follow these
            terms.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="headline-2 mb-4">Your Responsibilities</h3>
              <p className="body-1">
                Only submit honest, accurate reports. That means including real
                photos and truthful details about items you&apos;ve lost or
                found. If we detect misleading claims or abuse of the system, we
                reserve the right to deactivate your account.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">How Institutions Use Foundly</h3>
              <p className="body-1">
                Schools, hotels, offices, and other partners use Foundly to
                manage their lost & found. Their staff can see, match, and
                resolve item reports created at their locations. They&apos;re
                responsible for using the platform respectfully and complying
                with local privacy rules.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Our Role</h3>
              <p className="body-1">
                Foundly connects people with their belongings — but we
                don&apos;t physically hold items, guarantee matches, or act as a
                delivery service. Think of us as the digital layer that makes
                the whole process easier and more transparent.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Data Use</h3>
              <p className="body-1">
                We log actions like submissions, updates, and match history.
                This helps admins trace records and improve security. If a
                report violates our terms, we may remove it.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Fair Use</h3>
              <p className="body-1">
                Don&apos;t use Foundly to spam, harass, or collect data from
                others. Keep it clean, respectful, and focused on helping lost
                items get home.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-border mb-12" />

        {/* Section 2: Privacy Policy */}
        <section className="space-y-6 mb-12">
          <h2 className="title-3 mb-6">Privacy Policy</h2>

          <p className="body-1 mb-8">
            At Foundly, we believe privacy should be simple and clear.
            Here&apos;s what we collect, why we collect it, and how we protect
            your information.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="headline-2 mb-4">What We Collect</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li className="body-1">
                  Item reports: What was lost or found, where, when, and any
                  photos you upload
                </li>
                <li className="body-1">
                  Contact info: Just enough (like your email) so we can notify
                  you about matches
                </li>
                <li className="body-1">
                  Login credentials: If you sign in with Google or your
                  school/work account
                </li>
                <li className="body-1">
                  Admin actions: We keep a record of who matched, edited, or
                  resolved reports
                </li>
              </ul>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Why We Collect It</h3>
              <p className="body-1 mb-3">We collect data to:</p>
              <ul className="space-y-2 list-disc list-inside mb-4">
                <li className="body-1">Help you get your stuff back faster</li>
                <li className="body-1">
                  Give institutions tools to manage reports more easily
                </li>
                <li className="body-1">
                  Improve our matching system over time
                </li>
              </ul>
              <p className="body-1">
                Sometimes, we share anonymized usage trends with our partners to
                help them understand what&apos;s working.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Who Can See Your Info</h3>
              <ul className="space-y-2 list-disc list-inside mb-4">
                <li className="body-1">
                  Admins at locations you interact with (e.g., campus security
                  at your school)
                </li>
                <li className="body-1">
                  Our support team, only when it&apos;s needed to help fix or
                  investigate something
                </li>
              </ul>
              <p className="body-1 font-semibold">
                We never sell your data. Period.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Data Retention</h3>
              <p className="body-1">
                We store lost/found reports for up to 180 days. Institutions may
                choose to delete them sooner. If something is deleted, it&apos;s
                permanently wiped from our systems within 30 days.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Security</h3>
              <p className="body-1">
                We use encrypted storage, secure servers, and industry-standard
                practices to protect your data. Want your info gone? Just email
                us at{" "}
                <a
                  href="mailto:support@foundlyhq.com"
                  className="text-primary hover:underline"
                >
                  support@foundlyhq.com
                </a>{" "}
                — we&apos;ll handle the rest.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-border mb-12" />

        {/* Section 3: Claim Verification Policy */}
        <section className="space-y-6 mb-12">
          <h2 className="title-3 mb-6">Claim Verification Policy</h2>

          <p className="body-1 mb-8">
            At Foundly, getting your item back matters — but so does making sure
            it goes to the right person. Here&apos;s how we handle ownership
            claims in a fair, secure, and consistent way.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="headline-2 mb-4">Step 1: Claim Submission</h3>
              <p className="body-1 mb-3">
                When someone believes they&apos;ve found their item,
                they&apos;re asked to submit:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li className="body-1">
                  A clear photo of the item if possible (or similar if the item
                  is missing)
                </li>
                <li className="body-1">
                  Their contact information (email or phone number)
                </li>
                <li className="body-1">
                  Time, date, and location they lost or believe the item was
                  lost
                </li>
              </ul>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Step 2: Admin Review</h3>
              <p className="body-1 mb-3">
                Admins at the institution (e.g., a school, hotel, or venue)
                compare the user&apos;s info with the details on file,
                including:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li className="body-1">Description accuracy</li>
                <li className="body-1">
                  Metadata like timestamps or upload location
                </li>
                <li className="body-1">
                  Any unique identifying details (e.g., stickers, initials, case
                  color)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="headline-2 mb-4">
                Step 3: Verification Questions
              </h3>
              <p className="body-1 mb-3">
                If the match is unclear, admins may request:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li className="body-1">Proof of purchase or a receipt</li>
                <li className="body-1">
                  A selfie with the item if it&apos;s a common item (e.g.,
                  backpack, water bottle)
                </li>
                <li className="body-1">
                  An item password, serial number, or screen lock code (for
                  electronics)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Step 4: Final Decision</h3>
              <p className="body-1">
                Admins make the final call on whether to release an item.
                Foundly provides tools and suggestions, but doesn&apos;t
                override local policies. Disputes or duplicate claims are noted
                in the admin log for reference.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">
                Step 5: Archive & Recordkeeping
              </h3>
              <p className="body-1 mb-3">
                Once an item is returned, the case is closed and stored in the
                admin dashboard with:
              </p>
              <ul className="space-y-2 list-disc list-inside mb-4">
                <li className="body-1">Time and date of match</li>
                <li className="body-1">Who resolved it</li>
                <li className="body-1">Supporting notes or attachments</li>
              </ul>
              <p className="body-1">
                This creates a clear record in case any questions come up later.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-border mb-12" />

        {/* Section 4: Liability Disclaimers */}
        <section className="space-y-6 mb-12">
          <h2 className="title-3 mb-6">Liability Disclaimers</h2>

          <p className="body-1 mb-8">
            We want you to feel confident using Foundly — but it&apos;s also
            important to be transparent about what we can and can&apos;t take
            responsibility for.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="headline-2 mb-4">
                Foundly is a Digital Tool, Not a Courier
              </h3>
              <p className="body-1">
                Foundly helps people and institutions manage and track lost and
                found items. We don&apos;t physically hold, transport, or
                inspect items ourselves. The platform facilitates connections —
                the rest is handled locally by the reporting party and
                institution.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">No Guarantee of Recovery</h3>
              <p className="body-1">
                We do our best to help items get home, but we can&apos;t
                guarantee that every lost item will be found or returned.
                Matches are made based on the information users provide and what
                admins can verify.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">
                Admin Discretion and Local Policy
              </h3>
              <p className="body-1">
                Final decisions about item claims are made by the institution
                using Foundly. Foundly does not intervene in disputes between
                users or override local protocols. Each partner location (e.g.,
                a school, airport, or hotel) sets its own process for handling
                physical returns.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">
                Not Responsible for Incorrect Returns
              </h3>
              <p className="body-1">
                While we provide tools to support accurate matching, the
                ultimate responsibility for verifying ownership lies with the
                returning institution or individual. Foundly is not liable for
                items returned to the wrong person or for damages caused by
                false claims.
              </p>
            </div>

            <div>
              <h3 className="headline-2 mb-4">Use at Your Own Risk</h3>
              <p className="body-1">
                By using Foundly, you acknowledge that you do so at your own
                discretion. We&apos;re committed to protecting your data and
                creating a safe experience, but we can&apos;t control every
                human interaction or physical handoff.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-border">
          <p className="body-1">
            If you have any concerns or run into an issue, we&apos;re always
            here to help — email us at{" "}
            <a
              href="mailto:support@foundlyhq.com"
              className="text-primary hover:underline"
            >
              support@foundlyhq.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Foundly: Terms of Use and Privacy Policy",
  description:
    "Understand Foundly's terms of service, privacy policy, and claim verification process. We prioritize transparency and user trust.",
  robots: "index, follow",
  authors: [{ name: "Foundly Team" }],
  publisher: "Foundly",
  alternates: {
    canonical: "https://foundlyhq.com/policies",
  },
  openGraph: {
    title: "Foundly: Terms of Use and Privacy Policy",
    description:
      "Understand Foundly's terms of service, privacy policy, and claim verification process. We prioritize transparency and user trust.",
    url: "https://foundlyhq.com/policies",
    siteName: "Foundly",
    type: "website",
    images: [
      {
        url: "https://foundlyhq.com/og-image.png",
        width: 500,
        height: 540,
        alt: "Foundly - Smarter Lost and Found",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Foundly: Terms of Use and Privacy Policy",
    description:
      "Understand Foundly's terms of service, privacy policy, and claim verification process.",
    images: [
      {
        url: "https://foundlyhq.com/og-image.png",
        width: 500,
        height: 540,
        alt: "Foundly - Smarter Lost and Found",
      },
    ],
    site: "@FoundlyHQ",
  },
};
