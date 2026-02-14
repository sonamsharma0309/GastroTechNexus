import React from "react";
import { cn } from "../../utils/cn.js";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 outline-none",
        "focus:border-white/20 focus:ring-2 focus:ring-purple-500/20 transition",
        "placeholder:text-white/35",
        className
      )}
      {...props}
    />
  );
}
