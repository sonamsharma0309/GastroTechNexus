import React from "react";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useAI } from "../context/AIContext.jsx";

export default function Alerts() {
  const { warnings } = useAI();

  return (
    <div>
      <div className="text-xs text-white/55">Alerts & Recommendations</div>
      <div className="text-2xl md:text-3xl font-extrabold">AI Warning Stream</div>
      <div className="mt-2 text-white/65 text-sm">
        Auto-generated alerts from ingredient analysis + recipe substitutions.
      </div>

      <div className="mt-6">
        <Card>
          <div className="text-sm font-semibold">Live Feed</div>
          <div className="mt-3 space-y-2">
            {warnings.map((w) => (
              <div
                key={w.id}
                className="glass rounded-2xl border border-white/10 p-3 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-semibold">{w.title}</div>
                  <div className="text-sm text-white/65">{w.message}</div>
                  <div className="text-xs text-white/45 mt-1">
                    {new Date(w.ts).toLocaleString()}
                  </div>
                </div>
                <Badge tone={w.tone || "caution"}>{String(w.tone || "caution").toUpperCase()}</Badge>
              </div>
            ))}

            {!warnings.length ? (
              <div className="text-sm text-white/55">No alerts yet. Analyze something.</div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
