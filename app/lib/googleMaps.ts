// Minimal Google Maps JS loader, mirroring the catering-widget's approach:
// load the script once, share a single promise across callers.

let isLoading = false;
let isLoaded = false;
const callbacks: (() => void)[] = [];

export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isLoaded || window.google?.maps?.places) {
      isLoaded = true;
      resolve();
      return;
    }

    if (isLoading) {
      callbacks.push(resolve);
      return;
    }

    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      isLoaded = true;
      resolve();
      return;
    }

    isLoading = true;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoading = false;
      isLoaded = true;
      resolve();
      callbacks.forEach((cb) => cb());
      callbacks.length = 0;
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });
}

export interface ParsedAddress {
  line1: string;
  city: string;
  postcode: string;
  lat: number;
  lng: number;
  formatted: string;
}

// Turn a Places result into the flat address shape our form uses.
export function parsePlaceResult(
  place: google.maps.places.PlaceResult,
): ParsedAddress | null {
  const lat = place.geometry?.location?.lat();
  const lng = place.geometry?.location?.lng();
  if (lat === undefined || lng === undefined) return null;

  let line1 = "";
  let city = "";
  let postcode = "";
  place.address_components?.forEach((c) => {
    if (c.types.includes("street_number")) line1 = c.long_name + " ";
    if (c.types.includes("route")) line1 += c.long_name;
    if (c.types.includes("postal_town") || c.types.includes("locality"))
      city = c.long_name;
    if (c.types.includes("postal_code")) postcode = c.long_name;
  });

  const trimmedLine1 = line1.trim() || place.formatted_address || "";

  return {
    line1: trimmedLine1,
    city,
    postcode,
    lat,
    lng,
    formatted: place.formatted_address ?? trimmedLine1,
  };
}
