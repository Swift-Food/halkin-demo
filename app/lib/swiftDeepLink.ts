import type { BookingDetails } from "./bookingStore";

export const SWIFT_BASE_URL = "https://swiftfood.uk";
export const SWIFT_EVENT_ORDER_PATH = "/event-order";
export const HALKIN_PARTNER_SLUG = "halkin";

/**
 * Builds a deep-link to the Swift branded catering page from Halkin booking
 * details. Inverse of the website's parseInitialDataFromParams. Only non-empty
 * values are appended. URLSearchParams percent-encodes correctly (a leading "+"
 * in a phone number becomes "%2B", which the website parser round-trips).
 */
export function buildSwiftDeepLink(details: BookingDetails): string {
  const params = new URLSearchParams();
  params.set("partner", HALKIN_PARTNER_SLUG);

  const set = (key: string, value: string | undefined | null) => {
    if (value !== undefined && value !== null && value.trim() !== "") {
      params.set(key, value);
    }
  };

  set("eventName", details.eventName);
  set("startDate", details.eventDate);
  set("endDate", details.eventDate);
  set("startTime", details.startTime);
  set("endTime", details.endTime);
  set("line1", details.line1);
  set("city", details.city);
  set("postcode", details.postcode);
  if (typeof details.lat === "number" && Number.isFinite(details.lat)) {
    params.set("lat", String(details.lat));
  }
  if (typeof details.lng === "number" && Number.isFinite(details.lng)) {
    params.set("lng", String(details.lng));
  }
  set("name", details.name);
  set("phone", details.phone);
  set("email", details.email);
  set("org", details.org);

  return `${SWIFT_BASE_URL}${SWIFT_EVENT_ORDER_PATH}?${params.toString()}`;
}
