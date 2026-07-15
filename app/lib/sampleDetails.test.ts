import { describe, it, expect } from "vitest";
import { generateSample } from "./sampleDetails";
import { hasValidAddress } from "./bookingStore";

const RUNS = 200;

function samples() {
  return Array.from({ length: RUNS }, () => generateSample());
}

describe("generateSample", () => {
  it("always produces an address the form accepts", () => {
    for (const s of samples()) {
      expect(hasValidAddress(s)).toBe(true);
    }
  });

  it("fills every required field", () => {
    for (const s of samples()) {
      expect(s.name).not.toBe("");
      expect(s.phone).not.toBe("");
      expect(s.eventName).not.toBe("");
      expect(s.eventDate).not.toBe("");
      expect(s.startTime).not.toBe("");
      expect(s.endTime).not.toBe("");
    }
  });

  it("emits dates as YYYY-MM-DD and times as HH:MM", () => {
    for (const s of samples()) {
      expect(s.eventDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.startTime).toMatch(/^\d{2}:\d{2}$/);
      expect(s.endTime).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it("ends after it starts, on the same day", () => {
    for (const s of samples()) {
      expect(s.endTime > s.startTime).toBe(true);
    }
  });

  it("schedules the event in the future", () => {
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    for (const s of samples()) {
      expect(s.eventDate > todayIso).toBe(true);
    }
  });

  it("produces a parseable date, not a rollover artifact", () => {
    for (const s of samples()) {
      const [y, m, d] = s.eventDate.split("-").map(Number);
      const parsed = new Date(y, m - 1, d);
      expect(parsed.getFullYear()).toBe(y);
      expect(parsed.getMonth()).toBe(m - 1);
      expect(parsed.getDate()).toBe(d);
    }
  });

  it("varies between calls", () => {
    const names = new Set(samples().map((s) => s.eventName));
    expect(names.size).toBeGreaterThan(1);
  });
});
