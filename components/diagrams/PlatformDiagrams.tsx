// Block diagrams of the two HashCash platforms, drawn as geometry (no screenshots exist: product names
// and interfaces are withheld). Each shows the real structure stated on Saif's CV and nothing more.
// They use the --page-* tokens, which ink fields never remap, and sit on their own sheet.

const box = "fill-[var(--sheet-tone)]";
const ink = "fill-[var(--page-ink)]";
const spot = "fill-[var(--page-accent)]";

function Block({ x, y, w, label, sub, strong }: { x: number; y: number; w: number; label: string; sub?: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={64} className={strong ? spot : box} />
      <text x={x + 14} y={y + (sub ? 28 : 38)} className={strong ? "fill-[var(--page-accent-ink)]" : ink} fontSize="17" fontWeight="700">
        {label}
      </text>
      {sub && (
        <text x={x + 14} y={y + 49} className={strong ? "fill-[var(--page-accent-ink)]" : "fill-[var(--page-muted)]"} fontSize="14">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g className={ink}>
      <rect x={x1} y={y - 1.5} width={x2 - x1 - 8} height={3} />
      <path d={`M${x2} ${y}l-10 -7v14z`} />
    </g>
  );
}

export function RagDiagram() {
  return (
    <svg viewBox="0 0 800 500" role="img" aria-label="Diagram: each tenant's documents go through ingestion, chunking and embeddings into that tenant's own vector store; semantic search answers only from the asking tenant's store." className="h-auto w-full">
      {["Tenant A", "Tenant B", "Tenant C"].map((t, i) => (
        <Block key={t} x={0} y={40 + i * 150} w={170} label={t} sub="documents" />
      ))}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={170} x2={250} y={72 + i * 150} />
      ))}
      <rect x={250} y={40} width={230} height={364} className="fill-[var(--page-ink)]" />
      <text x={270} y={80} className="fill-[var(--sheet)]" fontSize="19" fontWeight="800">
        One pipeline
      </text>
      {["Ingest", "Chunk", "Embed", "Store"].map((s, i) => (
        <g key={s}>
          <rect x={270} y={104 + i * 72} width={190} height={56} className="fill-[var(--sheet)]" />
          <text x={286} y={138 + i * 72} className={ink} fontSize="17" fontWeight="700">
            {s}
          </text>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={480} x2={560} y={72 + i * 150} />
      ))}
      {["A", "B", "C"].map((t, i) => (
        <Block key={t} x={560} y={40 + i * 150} w={240} label={`Vector store ${t}`} sub="pgvector, isolated" strong={i === 0} />
      ))}
      <text x={560} y={496} className="fill-[var(--page-muted)]" fontSize="14">
        Search is scoped to the asking tenant.
      </text>
    </svg>
  );
}

export function McpDiagram() {
  return (
    <svg viewBox="0 0 800 500" role="img" aria-label="Diagram: AI agents and coding assistants call a read-only MCP server, which exposes search and retrieval tools over organisational knowledge; nothing an agent calls can change data." className="h-auto w-full">
      {["AI agent", "Coding assistant", "Chat client"].map((t, i) => (
        <Block key={t} x={0} y={40 + i * 150} w={210} label={t} />
      ))}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={210} x2={300} y={72 + i * 150} />
      ))}
      <rect x={300} y={40} width={230} height={364} className="fill-[var(--page-accent)]" />
      <text x={320} y={80} className="fill-[var(--page-accent-ink)]" fontSize="19" fontWeight="800">
        MCP server
      </text>
      <text x={320} y={104} className="fill-[var(--page-accent-ink)]" fontSize="14">
        read-only boundary
      </text>
      {["search", "retrieve", "list sources"].map((s, i) => (
        <g key={s}>
          <rect x={320} y={128 + i * 80} width={190} height={60} className="fill-[var(--sheet)]" />
          <text x={336} y={164 + i * 80} className={ink} fontSize="17" fontWeight="700">
            {s}
          </text>
        </g>
      ))}
      <Arrow x1={530} x2={600} y={222} />
      <Block x={600} y={190} w={200} label="Organisational" sub="knowledge" />
      <text x={600} y={300} className="fill-[var(--page-muted)]" fontSize="14">
        Agents never touch raw
      </text>
      <text x={600} y={320} className="fill-[var(--page-muted)]" fontSize="14">
        systems or credentials.
      </text>
    </svg>
  );
}
