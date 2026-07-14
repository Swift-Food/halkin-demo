import { describe, it, expect } from "vitest";
import { buildSwiftDeepLink, SWIFT_BASE_URL } from "./swiftDeepLink";
import { EMPTY_DETAILS, type BookingDetails } from "./bookingStore";

const base = (over: Partial<BookingDetails> = {}): BookingDetails => ({
  ...EMPTY_DETAILS,
  ...over,
});

describe("buildSwiftDeepLink", () => {
  it("always includes partner=halkin and targets the event-order page", () => {
    const url = new URL(buildSwiftDeepLink(base()));
    expect(url.origin + url.pathname).toBe(`${SWIFT_BASE_URL}/event-order`);
    expect(url.searchParams.get("partner")).toBe("halkin");
  });

  it("omits empty fields", () => {
    const url = new URL(buildSwiftDeepLink(base({ eventName: "" })));
    expect(url.searchParams.has("eventName")).toBe(false);
  });

  it("omits lat/lng when they are not numeric", () => {
    const url = new URL(buildSwiftDeepLink(base()));
    expect(url.searchParams.has("lat")).toBe(false);
    expect(url.searchParams.has("lng")).toBe(false);
  });

  it("maps event date to both startDate and endDate", () => {
    const url = new URL(buildSwiftDeepLink(base({ eventDate: "2026-08-01" })));
    expect(url.searchParams.get("startDate")).toBe("2026-08-01");
    expect(url.searchParams.get("endDate")).toBe("2026-08-01");
  });

  it("maps contact + address fields including new email/org", () => {
    const url = new URL(
      buildSwiftDeepLink(
        base({
          name: "Jo",
          phone: "+447700900000",
          email: "jo@acme.com",
          org: "Acme",
          line1: "1 High St",
          city: "London",
          postcode: "E1 6AN",
          lat: 51.5,
          lng: -0.1,
        }),
      ),
    );
    expect(url.searchParams.get("name")).toBe("Jo");
    expect(url.searchParams.get("phone")).toBe("+447700900000");
    expect(url.searchParams.get("email")).toBe("jo@acme.com");
    expect(url.searchParams.get("org")).toBe("Acme");
    expect(url.searchParams.get("line1")).toBe("1 High St");
    expect(url.searchParams.get("city")).toBe("London");
    expect(url.searchParams.get("postcode")).toBe("E1 6AN");
    expect(url.searchParams.get("lat")).toBe("51.5");
    expect(url.searchParams.get("lng")).toBe("-0.1");
  });

  it("percent-encodes + in phone so the raw value round-trips", () => {
    const raw = buildSwiftDeepLink(base({ phone: "+447700900000" }));
    expect(raw).toContain("phone=%2B447700900000");
    expect(new URL(raw).searchParams.get("phone")).toBe("+447700900000");
  });
});
