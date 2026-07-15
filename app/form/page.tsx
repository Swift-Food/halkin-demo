"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../SiteHeader";
import AddressAutocomplete from "../AddressAutocomplete";
import type { ParsedAddress } from "../lib/googleMaps";
import {
  type BookingDetails,
  EMPTY_DETAILS,
  loadDetails,
  saveDetails,
  hasValidAddress,
} from "../lib/bookingStore";
import { generateSample } from "../lib/sampleDetails";

export default function FormPage() {
  const router = useRouter();
  const [details, setDetails] = useState<BookingDetails>(EMPTY_DETAILS);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Rehydrate any previously entered details (e.g. after pressing Back).
  useEffect(() => {
    setDetails(loadDetails());
  }, []);

  const validAddress = hasValidAddress(details);

  const set =
    (key: keyof BookingDetails) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setDetails((d) => ({ ...d, [key]: e.target.value }));

  const handleAddressSelect = (address: ParsedAddress) => {
    setAddressError(null);
    setDetails((d) => ({
      ...d,
      line1: address.line1,
      city: address.city,
      postcode: address.postcode,
      lat: address.lat,
      lng: address.lng,
    }));
  };

  const handleAddressClear = () => {
    setDetails((d) => ({
      ...d,
      line1: "",
      city: "",
      postcode: "",
      lat: undefined,
      lng: undefined,
    }));
  };

  const handleAutofill = () => {
    setAddressError(null);
    setDetails(generateSample());
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validAddress) {
      setAddressError("Please select an address from the dropdown.");
      return;
    }
    saveDetails(details);
    router.push("/catering");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            <span className="h-px w-6 bg-[var(--accent)]" />
            Event Space Booking
          </span>
          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Let&apos;s plan your event
            </h1>
            <button
              type="button"
              onClick={handleAutofill}
              className="mt-1 flex-shrink-0 rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-black/40 hover:bg-black/[0.02]"
            >
              Auto-fill
            </button>
          </div>
          <p className="mt-3 text-base text-black/60">
            Share a few details and we&apos;ll tailor the right space and
            catering for your occasion.
          </p>
        </div>

        <form
          onSubmit={handleNext}
          className="rounded-xl border border-black/10 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-6">
            <fieldset>
              <legend className="text-sm font-semibold text-[var(--foreground)]">
                Contact
              </legend>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input
                    type="text"
                    required
                    value={details.name}
                    onChange={set("name")}
                    placeholder="Jane Doe"
                    className={inputClass}
                  />
                </Field>
                <Field label="Contact number" required>
                  <input
                    type="tel"
                    required
                    value={details.phone}
                    onChange={set("phone")}
                    placeholder="+44 7700 900000"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email (optional)">
                  <input
                    type="email"
                    value={details.email}
                    onChange={set("email")}
                    placeholder="jane@example.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Organization (optional)">
                  <input
                    type="text"
                    value={details.org}
                    onChange={set("org")}
                    placeholder="Acme Ltd"
                    className={inputClass}
                  />
                </Field>
              </div>
            </fieldset>

            <div className="h-px bg-black/5" />

            <fieldset>
              <legend className="text-sm font-semibold text-[var(--foreground)]">
                Event
              </legend>
              <div className="mt-4 grid grid-cols-1 gap-5">
                <Field label="Event name" required>
                  <input
                    type="text"
                    required
                    value={details.eventName}
                    onChange={set("eventName")}
                    placeholder="Annual Summer Gala"
                    className={inputClass}
                  />
                </Field>

                <Field label="Event date" required>
                  <input
                    type="date"
                    required
                    value={details.eventDate}
                    onChange={set("eventDate")}
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Start time" required>
                    <input
                      type="time"
                      required
                      value={details.startTime}
                      onChange={set("startTime")}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="End time" required>
                    <input
                      type="time"
                      required
                      value={details.endTime}
                      onChange={set("endTime")}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <AddressAutocomplete
                  onSelect={handleAddressSelect}
                  onClear={handleAddressClear}
                  hasValidAddress={validAddress}
                  error={addressError ?? undefined}
                />

                {validAddress && (
                  <div className="rounded-lg border border-black/10 bg-[#f7f7f8] px-4 py-3 text-sm">
                    <p className="font-medium text-[var(--foreground)]">
                      {details.line1}
                    </p>
                    <p className="text-black/60">
                      {[details.city, details.postcode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </fieldset>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-xs text-black/40">Step 1 of 2 · Details</p>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Continue →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-black/30 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
        {label}
        {required && <span className="text-[var(--accent)]"> *</span>}
      </span>
      {children}
    </label>
  );
}
