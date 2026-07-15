import { type BookingDetails, EMPTY_DETAILS } from "./bookingStore";

const SAMPLE_EVENTS = [
  "Annual Gala",
  "Summer Mixer",
  "Product Launch",
  "Team Offsite",
  "Investor Dinner",
  "Holiday Party",
  "Founders Brunch",
  "Client Appreciation",
];

const SAMPLE_NAMES = [
  "Alice Chen",
  "Marcus Bell",
  "Priya Shah",
  "Tomás Rivera",
  "Emma Carter",
  "Hiroshi Tanaka",
];

const SAMPLE_ORGS = ["Northwind Labs", "Helix Studio", "Forkcast Events", "Acme Co.", ""];

// Paired so the sample carries real London coordinates — hasValidAddress()
// rejects an address without lat/lng, so Auto-fill needs them too.
const SAMPLE_ADDRESSES = [
  { line1: "12 Camden High St", postcode: "NW1 0LU", lat: 51.5375, lng: -0.1425 },
  { line1: "44 Brick Lane", postcode: "E1 6RF", lat: 51.5205, lng: -0.0715 },
  { line1: "8 Old Compton St", postcode: "W1D 4TQ", lat: 51.5132, lng: -0.131 },
  { line1: "120 Shoreditch High St", postcode: "E1 6JN", lat: 51.5245, lng: -0.078 },
  { line1: "27 Borough Road", postcode: "SE1 0AA", lat: 51.4985, lng: -0.1005 },
] as const;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Fake but plausible booking details for demoing the form. */
export function generateSample(): BookingDetails {
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 7 + Math.floor(Math.random() * 30));

  // The form takes a single date, so the event always starts and ends same-day.
  const startHour = 10 + Math.floor(Math.random() * 6); // 10–15
  const endHour = Math.min(19, startHour + 2 + Math.floor(Math.random() * 3));

  const name = pick(SAMPLE_NAMES);
  const emailLocal = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z]+/g, ".");
  const address = pick(SAMPLE_ADDRESSES);

  return {
    ...EMPTY_DETAILS,
    name,
    phone: `+44 20 ${1000 + Math.floor(Math.random() * 9000)} ${1000 + Math.floor(Math.random() * 9000)}`,
    email: `${emailLocal}@example.com`,
    org: pick(SAMPLE_ORGS),
    eventName: pick(SAMPLE_EVENTS),
    eventDate: `${eventDate.getFullYear()}-${pad2(eventDate.getMonth() + 1)}-${pad2(eventDate.getDate())}`,
    startTime: `${pad2(startHour)}:00`,
    endTime: `${pad2(endHour)}:00`,
    line1: address.line1,
    city: "London",
    postcode: address.postcode,
    lat: address.lat,
    lng: address.lng,
  };
}
