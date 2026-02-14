import React from "react";
import { cn } from "../../utils/cn.js";

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  as: Comp = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 active:scale-[0.98] select-none";
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };
  const variants = {
    primary:
      "neon-border glass-strong soft-glow hover:brightness-110 hover:shadow-[0_0_40px_rgba(0,190,255,.18)]",
    ghost:
      "glass hover:bg-white/10 border border-white/10 hover:border-white/20",
    danger:
      "bg-red-500/15 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/45",
  };

  return (
    <Comp
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
