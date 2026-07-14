"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadGoogleMapsScript,
  parsePlaceResult,
  type ParsedAddress,
} from "./lib/googleMaps";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
// Match the catering-widget default (UK). Set to null for worldwide search.
const COUNTRY_RESTRICTION: string | null = "gb";

interface AddressAutocompleteProps {
  onSelect: (address: ParsedAddress) => void;
  onClear?: () => void;
  hasValidAddress?: boolean;
  error?: string;
}

export default function AddressAutocomplete({
  onSelect,
  onClear,
  hasValidAddress,
  error,
}: AddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justSelectedRef = useRef(false);

  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!API_KEY) return;
    loadGoogleMapsScript(API_KEY).then(() => {
      if (!window.google?.maps?.places) return;
      autocompleteServiceRef.current =
        new google.maps.places.AutocompleteService();
      const div = document.createElement("div");
      placesServiceRef.current = new google.maps.places.PlacesService(div);
    });
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    if (!query.trim() || !autocompleteServiceRef.current) {
      setPredictions([]);
      setActiveIndex(-1);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      autocompleteServiceRef.current!.getPlacePredictions(
        {
          input: query,
          ...(COUNTRY_RESTRICTION
            ? { componentRestrictions: { country: COUNTRY_RESTRICTION } }
            : {}),
        },
        (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            setPredictions(results);
            setActiveIndex(-1);
            setOpen(true);
          } else {
            setPredictions([]);
            setActiveIndex(-1);
            setOpen(false);
          }
        },
      );
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (
    prediction: google.maps.places.AutocompletePrediction,
  ) => {
    justSelectedRef.current = true;
    setOpen(false);
    setActiveIndex(-1);
    setPredictions([]);
    setQuery(prediction.description);
    placesServiceRef.current?.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["address_components", "geometry", "formatted_address", "name"],
      },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry
        ) {
          const parsed = parsePlaceResult(place);
          if (parsed) onSelect(parsed);
        }
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || predictions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, predictions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSelect(predictions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClear = () => {
    setQuery("");
    setPredictions([]);
    setActiveIndex(-1);
    setOpen(false);
    onClear?.();
  };

  return (
    <div ref={containerRef}>
      <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
        Search address<span className="text-[var(--accent)]"> *</span>
      </span>
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing an address…"
          autoComplete="new-password"
          className={`w-full rounded-lg border bg-white px-3 py-2.5 pr-16 text-sm text-[var(--foreground)] outline-none transition placeholder:text-black/30 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 ${
            error
              ? "border-[var(--accent)]"
              : hasValidAddress
                ? "border-green-500"
                : "border-black/15"
          }`}
        />
        {hasValidAddress && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] hover:opacity-80"
          >
            Change
          </button>
        )}
        {open && predictions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-black/10 bg-white shadow-lg">
            {predictions.map((p, idx) => (
              <button
                key={p.place_id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(p);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors ${
                  idx === activeIndex ? "bg-black/5" : "hover:bg-black/5"
                }`}
              >
                <svg
                  className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-black/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">
                    {p.structured_formatting.main_text}
                  </p>
                  <p className="truncate text-xs text-black/50">
                    {p.structured_formatting.secondary_text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-[var(--accent)]">{error}</p>
      ) : hasValidAddress ? (
        <p className="mt-1 text-xs text-green-600">Address selected</p>
      ) : (
        <p className="mt-1 text-xs text-black/50">
          Please select an address from the dropdown
        </p>
      )}
    </div>
  );
}
