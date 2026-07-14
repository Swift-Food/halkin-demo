// Shared booking details, persisted in sessionStorage so the /form and
// /catering routes can hand off state across a navigation (and survive a
// refresh / back-forward).

export type BookingDetails = {
  name: string;
  phone: string;
  eventName: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  line1: string;
  city: string;
  postcode: string;
  lat?: number;
  lng?: number;
};

export const EMPTY_DETAILS: BookingDetails = {
  name: "",
  phone: "",
  eventName: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  line1: "",
  city: "",
  postcode: "",
};

const KEY = "halkin.booking";

export function loadDetails(): BookingDetails {
  if (typeof window === "undefined") return EMPTY_DETAILS;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return EMPTY_DETAILS;
    return { ...EMPTY_DETAILS, ...JSON.parse(raw) };
  } catch {
    return EMPTY_DETAILS;
  }
}

export function saveDetails(details: BookingDetails): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(details));
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

// A real Places selection always carries coordinates; city/postcode are
// best-effort (Google often omits postal_code / postal_town). The widget
// itself only requires numeric lat/lng to accept a delivery address
// (getUsableInitialAddress), so we gate on the same signal here rather than
// on postcode — otherwise a valid pick with no postcode is silently dropped
// before it ever reaches the widget.
export function hasValidAddress(d: BookingDetails): boolean {
  return Boolean(
    d.line1 && typeof d.lat === "number" && typeof d.lng === "number",
  );
}
