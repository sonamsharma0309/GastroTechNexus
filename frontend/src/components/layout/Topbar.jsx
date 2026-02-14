import React from "react";
import { Link } from "react-router-dom";
import { Mic, Sparkles } from "lucide-react";
import Button from "../ui/Button.jsx";
import Badge from "../ui/Badge.jsx";
import { useAI } from "../../context/AIContext.jsx";

export default function Topbar() {
  const { activeConditions } = useAI();

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-4">
        <div className="glass-strong rounded-2xl border border-white/12 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-extrabold text-gradient text-lg">
              GastroTechNexus AI
            </Link>
            <Badge tone="neutral">
              <Sparkles size={14} /> Live Sim
            </Badge>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {activeConditions.slice(0, 3).map((c) => (
              <Badge key={c} tone="neutral">{c}</Badge>
            ))}
            {activeConditions.length > 3 ? (
              <Badge tone="neutral">+{activeConditions.length - 3}</Badge>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" className="relative overflow-hidden">
              <span className="absolute inset-0 opacity-20"
                style={{ background: "radial-gradient(circle at 30% 20%, rgba(0,190,255,.5), transparent 55%)" }}
              />
              <Mic size={16} className="relative" />
              <span className="relative hidden sm:inline">Voice (Sim)</span>
            </Button>
            <Link to="/app/profile">
              <Button>Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
