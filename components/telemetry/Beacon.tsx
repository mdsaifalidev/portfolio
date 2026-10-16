"use client";

import { useEffect } from "react";

/** Sends one anonymous visit ping per browser session (production builds only). */
export function TelemetryBeacon() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    try {
      if (sessionStorage.getItem("telemetry:sent")) return;
      sessionStorage.setItem("telemetry:sent", "1");
    } catch {
      return; // storage blocked: skip rather than count every page view
    }
    navigator.sendBeacon?.("/api/telemetry");
  }, []);
  return null;
}
