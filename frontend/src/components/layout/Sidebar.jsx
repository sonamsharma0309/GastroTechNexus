import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FlaskConical, Wand2, User, Bell } from "lucide-react";
import { cn } from "../../utils/cn.js";
import Badge from "../ui/Badge.jsx";
import { useAI } from "../../context/AIContext.jsx";

const items = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/analyzer", label: "Ingredient Analyzer", icon: FlaskConical },
  { to: "/app/recipes", label: "Recipe Generator", icon: Wand2 },
  { to: "/app/profile", label: "Health Profile", icon: User },
  { to: "/app/alerts", label: "Alerts", icon: Bell },
];

export default function Sidebar() {
  const { activeConditions } = useAI();

  return (
    <aside className="hidden md:flex md:w-[280px] flex-col gap-4 p-4">
      <div className="glass-strong rounded-2xl p-4 border border-white/12">
        <div className="text-xs text-white/60">GastroTechNexus</div>
        <div className="text-xl font-extrabold text-gradient">AI Console</div>

        <div className="mt-3 flex flex-wrap gap-2">
          {activeConditions.length ? (
            activeConditions.map((c) => (
              <Badge key={c} tone="neutral">{c}</Badge>
            ))
          ) : (
            <Badge tone="neutral">No profile set</Badge>
          )}
        </div>
      </div>

      <nav className="glass rounded-2xl border border-white/10 p-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/app"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                "hover:bg-white/8",
                isActive ? "bg-white/10 border border-white/12" : "border border-transparent"
              )
            }
          >
            <Icon size={18} className="text-white/70" />
            <span className="font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="glass rounded-2xl border border-white/10 p-4 text-xs text-white/55">
        <div className="font-semibold text-white/70">Tip</div>
        Enter ingredient like: <span className="text-white/85">sugar</span>,{" "}
        <span className="text-white/85">turmeric</span>,{" "}
        <span className="text-white/85">white rice</span>
      </div>
    </aside>
  );
}
