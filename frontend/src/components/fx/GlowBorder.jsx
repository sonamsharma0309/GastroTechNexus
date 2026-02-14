import React from "react";
import { cn } from "../../utils/cn.js";

export default function GlowBorder({ className = "", children }) {
  return (
    <div className={cn("neon-border rounded-2xl", className)}>
      {children}
    </div>
  );
}
