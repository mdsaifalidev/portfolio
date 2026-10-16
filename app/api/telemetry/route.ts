import { getStats, recordVisit } from "@/lib/telemetry";

/** Records one visit (sent once per browser session by components/telemetry/Beacon.tsx). */
export async function POST(req: Request) {
  try {
    await recordVisit(req.headers);
  } catch (err) {
    console.error("[telemetry] record failed", err);
  }
  return new Response(null, { status: 204 });
}

/** Aggregate counters for the telemetry section. Cached briefly at the edge. */
export async function GET() {
  try {
    const stats = await getStats();
    if (!stats) return Response.json({ error: "unavailable" }, { status: 503 });
    return Response.json(stats, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (err) {
    console.error("[telemetry] stats failed", err);
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
