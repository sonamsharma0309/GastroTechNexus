import React, { useMemo } from "react";

export default function RiskRadar({ risks = { diabetes: 0.4, inflammation: 0.4, hormonal: 0.4 } }) {
  const points = useMemo(() => {
    const keys = ["diabetes", "inflammation", "hormonal"];
    const vals = keys.map((k) => Math.max(0, Math.min(1, risks[k] ?? 0.4)));
    // triangle radar
    const center = { x: 110, y: 105 };
    const radius = 70;
    const angles = [-90, 30, 150].map((a) => (a * Math.PI) / 180);

    const coords = vals.map((v, i) => ({
      x: center.x + Math.cos(angles[i]) * radius * v,
      y: center.y + Math.sin(angles[i]) * radius * v,
    }));

    const d = `M ${coords[0].x} ${coords[0].y} L ${coords[1].x} ${coords[1].y} L ${coords[2].x} ${coords[2].y} Z`;
    return { d, coords };
  }, [risks]);

  return (
    <div className="glass rounded-2xl border border-white/10 p-4">
      <div className="text-sm font-semibold">Health Risk Radar</div>
      <div className="text-xs text-white/55">Insulin • Inflammation • Hormonal</div>

      <svg width="220" height="210" className="mt-3">
        {/* grid */}
        {[0.33, 0.66, 1].map((m, i) => (
          <polygon
            key={i}
            points={`110,35 ${110 + 70 * m},${105 + 40.4 * m} ${110 - 70 * m},${105 + 40.4 * m}`}
            fill="transparent"
            stroke="rgba(255,255,255,0.10)"
          />
        ))}

        {/* axis */}
        <line x1="110" y1="105" x2="110" y2="35" stroke="rgba(255,255,255,0.12)" />
        <line x1="110" y1="105" x2="180" y2="145" stroke="rgba(255,255,255,0.12)" />
        <line x1="110" y1="105" x2="40" y2="145" stroke="rgba(255,255,255,0.12)" />

        {/* value */}
        <path
          d={points.d}
          fill="rgba(0,190,255,0.14)"
          stroke="rgba(0,190,255,0.85)"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 10px rgba(0,190,255,.25))" }}
        />

        {points.coords.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="rgba(0,255,170,0.9)" />
        ))}

        {/* labels */}
        <text x="110" y="20" textAnchor="middle" fill="rgba(255,255,255,.65)" fontSize="11">
          Insulin
        </text>
        <text x="196" y="165" textAnchor="end" fill="rgba(255,255,255,.65)" fontSize="11">
          Inflammation
        </text>
        <text x="24" y="165" textAnchor="start" fill="rgba(255,255,255,.65)" fontSize="11">
          Hormonal
        </text>
      </svg>
    </div>
  );
}
