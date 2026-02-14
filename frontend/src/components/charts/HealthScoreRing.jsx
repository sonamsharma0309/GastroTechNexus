import React from "react";

export default function HealthScoreRing({ value = 0, size = 132, stroke = 10, tone = "safe" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;

  const color =
    tone === "harmful"
      ? "rgba(255,90,90,0.95)"
      : tone === "caution"
      ? "rgba(0,190,255,0.95)"
      : "rgba(0,255,170,0.95)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-extrabold">{pct}</div>
        <div className="text-[11px] text-white/60 -mt-1">Health Score</div>
      </div>
    </div>
  );
}
