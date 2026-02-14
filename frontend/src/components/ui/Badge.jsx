import React from "react";
import { cn } from "../../utils/cn.js";

const tones = {
  safe: "bg-emerald-500/12 border-emerald-400/25 text-emerald-200 shadow-[0_0_25px_rgba(0,255,170,.10)]",
  caution:
    "bg-sky-500/10 border-sky-400/20 text-sky-200 shadow-[0_0_25px_rgba(0,190,255,.10)]",
  harmful:
    "bg-red-500/12 border-red-400/25 text-red-200 shadow-[0_0_25px_rgba(255,90,90,.12)]",
  neutral: "bg-white/7 border-white/12 text-white/80",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        tones[tone] || tones.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
