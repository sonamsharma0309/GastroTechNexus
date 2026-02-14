import React from "react";
import { cn } from "../../utils/cn.js";

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/8 border border-white/10",
        className
      )}
    />
  );
}
