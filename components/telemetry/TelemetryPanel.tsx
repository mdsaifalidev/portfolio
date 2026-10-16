"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TelemetryStats } from "@/lib/telemetry";

type WorldDots = { width: number; height: number; dots: [number, number, string][] };
type State =
  | { status: "idle" | "loading" }
  | { status: "ready"; world: WorldDots; stats: TelemetryStats | null };

const regionNames = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en"], { type: "region" }) : null;
const countryName = (code: string) => {
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};
const fmt = new Intl.NumberFormat("en");

/** Loads the map and counters only when scrolled into view, so they cost nothing on first load. */
export function TelemetryPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setState({ status: "loading" });
        const [world, stats] = await Promise.all([
          fetch("/telemetry/world-dots.json").then((r) => r.json() as Promise<WorldDots>),
          fetch("/api/telemetry")
            .then((r) => (r.ok ? (r.json() as Promise<TelemetryStats>) : null))
            .catch(() => null),
        ]);
        setState({ status: "ready", world, stats });
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = state.status === "ready" ? state.stats : null;
  const top = useMemo(
    () =>
      Object.entries(stats?.countries ?? {})
        .map(([code, n]) => [code, Number(n)] as const)
        .sort((a, b) => b[1] - a[1]),
    [stats],
  );
  const max = top[0]?.[1] ?? 1;
  const countByCode = new Map(top);

  const ready = state.status === "ready";
  const n = (v: number | undefined) => (v === undefined ? "..." : fmt.format(v));

  return (
    <div ref={ref}>
      {/* The ledger reads as one sentence: units tested to date. */}
      <p className="num max-w-[30ch] text-step-2 leading-[1.15] tracking-[-0.015em]" aria-live="polite">
        {stats && stats.visits === 0 ? (
          "No visits recorded yet. The count starts once the site is live."
        ) : stats ? (
          <>
            <span className="font-bold">{n(stats.visits)}</span> visits from <span className="font-bold">{n(stats.uniques)}</span>{" "}
            {stats.uniques === 1 ? "visitor" : "visitors"} in <span className="font-bold">{n(top.length)}</span>{" "}
            {top.length === 1 ? "country" : "countries"}
          </>
        ) : ready ? (
          "The counters are offline right now."
        ) : (
          "Counting visits..."
        )}
      </p>

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-8">
          {ready ? (
            <svg
              viewBox={`0 0 ${state.world.width} ${state.world.height}`}
              className="block h-auto w-full"
              role="img"
              aria-label={
                top.length
                  ? `World map highlighting visitors from ${top.length} ${top.length === 1 ? "country" : "countries"}.`
                  : "World map; no visits recorded yet."
              }
            >
              {state.world.dots.map(([x, y, code], i) => {
                const count = countByCode.get(code);
                return count ? (
                  <circle key={i} cx={x} cy={y} r={3.6} className="fill-accent" opacity={0.45 + 0.55 * (count / max)} />
                ) : (
                  <circle key={i} cx={x} cy={y} r={2.6} className="fill-[color-mix(in_srgb,var(--text),transparent_78%)]" />
                );
              })}
            </svg>
          ) : (
            <div className="aspect-[1000/389] w-full bg-[color-mix(in_srgb,var(--text),transparent_92%)]" aria-hidden="true" />
          )}
        </div>

        <div className="lg:col-span-3 lg:col-start-10">
          <p className="font-bold">Top countries</p>
          {!ready ? (
            <p className="mt-3 text-muted">Loading...</p>
          ) : !stats ? (
            <p className="mt-3 text-muted">Counters are offline right now.</p>
          ) : top.length === 0 ? (
            <p className="mt-3 text-muted">None yet.</p>
          ) : (
            <ol className="num mt-3 space-y-2">
              {top.slice(0, 8).map(([code, count]) => (
                <li key={code} className="flex items-baseline gap-2">
                  <span className="truncate">{countryName(code)}</span>
                  <span aria-hidden="true" className="mb-1 flex-1 border-b-4 border-dotted border-[color-mix(in_srgb,var(--text),transparent_70%)]" />
                  <span>{fmt.format(count)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
