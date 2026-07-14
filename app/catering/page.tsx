"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { InitialData } from "@swift-food-services/catering-widget";
import SiteHeader from "../SiteHeader";
import CateringWidgetClient from "../CateringWidgetClient";
import {
  type BookingDetails,
  loadDetails,
  hasValidAddress,
} from "../lib/bookingStore";

export default function CateringPage() {
  const router = useRouter();
  const [details, setDetails] = useState<BookingDetails | null>(null);

  // Measure the sticky navbar so the widget can offset its own sticky
  // elements (session bar, cart) to sit below it instead of underneath.
  const navRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const measure = () => setNavHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [details]);

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

  const initialData: InitialData = {
    eventName: details.eventName || undefined,
    eventStartDate: details.eventDate || undefined,
    eventEndDate: details.eventDate || undefined,
    eventStartTime: details.startTime || undefined,
    eventEndTime: details.endTime || undefined,
    contact: {
      name: details.name || undefined,
      phone: details.phone || undefined,
    },
    deliveryAddress: hasValidAddress(details)
      ? {
          line1: details.line1,
          city: details.city,
          postcode: details.postcode,
          ...(details.lat !== undefined && details.lng !== undefined
            ? { lat: details.lat, lng: details.lng }
            : {}),
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <SiteHeader headerRef={navRef} />

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

      <CateringWidgetClient
        initialData={initialData}
        stickyTopOffset={navHeight}
      />
    </div>
  );
}
