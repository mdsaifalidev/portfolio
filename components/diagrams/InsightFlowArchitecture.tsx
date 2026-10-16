// InsightFlow service topology, from the project's docs/ARCHITECTURE.md.
// Colours come from theme tokens via Tailwind fill/stroke utilities, so it works in both themes.

type Box = { x: number; y: number; title: string; sub: string; accent?: boolean };

const W = 200;
const H = 56;

const boxes: Box[] = [
  { x: 260, y: 16, title: "web | Next.js 16", sub: "UI, RSC data loading" },
  { x: 260, y: 116, title: "gateway | nginx", sub: "routing, rate limits, SSE" },
  { x: 40, y: 226, title: "auth-node | Fastify", sub: "sessions, RS256 JWT, JWKS" },
  { x: 260, y: 226, title: "data-py | FastAPI", sub: "uploads, queries, SSE" },
  { x: 480, y: 226, title: "data-worker | ARQ", sub: "ingest, facts, AI brief", accent: true },
  { x: 40, y: 346, title: "PostgreSQL", sub: "auth + analytics schemas" },
  { x: 260, y: 346, title: "Object storage", sub: "raw files + Parquet (S3 API)" },
  { x: 480, y: 346, title: "Redis", sub: "jobs, pub/sub, rate limits" },
];

// [x1, y1, x2, y2, label?, labelX?, labelY?]
const edges: [number, number, number, number, string?, number?, number?][] = [
  [360, 72, 360, 112],
  [320, 172, 160, 222],
  [360, 172, 360, 222],
  [140, 282, 140, 342],
  [310, 282, 210, 342],
  [360, 282, 360, 342, "8 MB chunks", 368, 316],
  [460, 254, 476, 254],
  [580, 282, 580, 342, "progress", 588, 316],
  [520, 282, 420, 342],
];

export function InsightFlowArchitecture() {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="InsightFlow architecture diagram"
      className="overflow-x-auto border border-border bg-surface/40 p-4 focus-visible:outline-accent"
    >
      <svg
        viewBox="0 0 720 418"
        role="img"
        aria-labelledby="if-arch-title if-arch-desc"
        className="mx-auto block w-full min-w-[600px] max-w-[720px]"
      >
        <title id="if-arch-title">InsightFlow architecture</title>
        <desc id="if-arch-desc">
          The Next.js web app talks to an nginx gateway, which routes to a Fastify auth service and a
          FastAPI data service. The data service enqueues ingest jobs for an ARQ worker. Auth uses
          PostgreSQL; the data service and worker use PostgreSQL, S3-compatible object storage and Redis.
        </desc>
        <defs>
          <marker id="if-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-muted" />
          </marker>
        </defs>

        {edges.map(([x1, y1, x2, y2, label, lx, ly], i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={1.25} className="stroke-muted" markerEnd="url(#if-arrow)" />
            {label && (
              <text x={lx} y={ly} fontSize={10} className="fill-muted">
                {label}
              </text>
            )}
          </g>
        ))}

        {boxes.map((b) => (
          <g key={b.title}>
            <rect
              x={b.x}
              y={b.y}
              width={W}
              height={H}
              rx={8}
              strokeWidth={b.accent ? 1.5 : 1}
              className={b.accent ? "fill-surface stroke-accent" : "fill-surface stroke-border"}
            />
            <text x={b.x + W / 2} y={b.y + 24} textAnchor="middle" fontSize={12.5} fontWeight={600} className={b.accent ? "fill-accent" : "fill-text"}>
              {b.title}
            </text>
            <text x={b.x + W / 2} y={b.y + 42} textAnchor="middle" fontSize={10.5} className="fill-muted">
              {b.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
