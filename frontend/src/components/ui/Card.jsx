import React from "react";
import { cn } from "../../utils/cn.js";

export default function Card({ className = "", children }) {
  return (
    <div className={cn("glass rounded-2xl soft-glow p-5", className)}>
      {children}
    </div>
  );
}
