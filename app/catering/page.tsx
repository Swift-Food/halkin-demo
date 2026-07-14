"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteHeader from "../SiteHeader";
import {
  type BookingDetails,
  loadDetails,
  hasValidAddress,
} from "../lib/bookingStore";
import { buildSwiftDeepLink } from "../lib/swiftDeepLink";

export default function CateringPage() {
  const router = useRouter();
  const [details, setDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const loaded = loadDetails();
    // Guard: if someone lands here without completing the form, send them back.
    if (!loaded.name && !hasValidAddress(loaded)) {
      router.replace("/form");
      return;
    }
    setDetails(loaded);
  }, [router]);

  if (!details) {
    return (
      <div className="min-h-screen bg-[#f7f7f8]">
        <SiteHeader />
      </div>
    );
  }

  const address = hasValidAddress(details)
    ? [details.line1, details.city, details.postcode].filter(Boolean).join(", ")
    : "";

  const rows: { label: string; value: string }[] = [
    { label: "Event", value: details.eventName },
    { label: "Date", value: details.eventDate },
    { label: "Start time", value: details.startTime },
    { label: "End time", value: details.endTime },
    { label: "Address", value: address },
    { label: "Name", value: details.name },
    { label: "Phone", value: details.phone },
    { label: "Email", value: details.email },
    { label: "Organization", value: details.org },
  ].filter((row) => row.value);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <SiteHeader />

      <div className="border-b border-[var(--accent)]/10 bg-[var(--accent-soft)]">
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          <Link
            href="/form"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]/80 transition-colors hover:text-[var(--accent)]"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to details
          </Link>

          <nav
            aria-label="Progress"
            className="flex items-center gap-3 sm:gap-4"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span className="text-sm text-[var(--accent)]/70">Details</span>
            </span>

            <span className="h-px w-6 bg-[var(--accent)]/20 sm:w-10" aria-hidden />

            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white ring-4 ring-[var(--accent)]/15">
                2
              </span>
              <span className="text-sm font-semibold text-[var(--accent)]">
                Catering
              </span>
            </span>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            <span className="h-px w-6 bg-[var(--accent)]" />
            Event Space Booking
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Review your details
          </h1>
          <p className="mt-3 text-base text-black/60">
            You&apos;ll continue on Swift to build your catering order for
            this event.
          </p>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <dl className="space-y-4">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b border-black/5 pb-4 last:border-none last:pb-0"
              >
                <dt className="text-sm text-black/50">{row.label}</dt>
                <dd className="text-right text-sm font-medium text-[var(--foreground)]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex items-center justify-between gap-4">
            <Link
              href="/form"
              className="text-sm font-medium text-[var(--accent)]/80 transition-colors hover:text-[var(--accent)]"
            >
              Edit details
            </Link>
            <button
              type="button"
              onClick={() =>
                window.open(buildSwiftDeepLink(details), "_blank", "noopener")
              }
              className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Continue on Swift
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
