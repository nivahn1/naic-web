// Deterministic network / constellation motif — echoes the National AI
// Consortium's map-of-connected-nodes identity. Computed once at module load
// so server and client render identical markup (no hydration mismatch).

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1200;
const H = 700;
const rand = mulberry32(20260901);

const NODES = Array.from({ length: 46 }, () => ({
  x: Math.round(rand() * W),
  y: Math.round(rand() * H),
  r: 1 + rand() * 2.4,
}));

const EDGES: [number, number][] = [];
for (let i = 0; i < NODES.length; i++) {
  for (let j = i + 1; j < NODES.length; j++) {
    const dx = NODES[i].x - NODES[j].x;
    const dy = NODES[i].y - NODES[j].y;
    if (Math.hypot(dx, dy) < 190) EDGES.push([i, j]);
  }
}

export function Constellation({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g stroke="#a78bfa" strokeWidth="0.7" opacity="0.28">
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
          />
        ))}
      </g>
      <g fill="#c4b5fd">
        {NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} opacity={0.55 + (i % 5) * 0.09} />
        ))}
      </g>
    </svg>
  );
}
