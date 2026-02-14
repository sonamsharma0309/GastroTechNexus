import React from "react";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import CountUpStat from "../components/charts/CountUpStat.jsx";
import RiskRadar from "../components/charts/RiskRadar.jsx";
import { useAI } from "../context/AIContext.jsx";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { analyses, warnings, recipes, activeConditions, clearAll } = useAI();

  const last = analyses[0];
  const risk = last?.risks || { diabetes: 0.35, inflammation: 0.35, hormonal: 0.35 };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-white/55">AI Command Center</div>
          <div className="text-2xl md:text-3xl font-extrabold">
            Futuristic Nutrition Intelligence
          </div>
          <div className="mt-2 text-white/65 text-sm">
            Profile-aware analysis • live alerts • substitutions • persistent state
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {activeConditions.length ? (
              activeConditions.map((c) => <Badge key={c} tone="neutral">{c}</Badge>)
            ) : (
              <Badge tone="neutral">Set your profile for better accuracy</Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link to="/app/analyzer"><Button>Analyze</Button></Link>
          <Button variant="ghost" onClick={clearAll}>Clear Data</Button>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card>
          <div className="text-xs text-white/55">Analyzed Ingredients</div>
          <div className="mt-2 text-4xl font-extrabold">
            <CountUpStat value={analyses.length} />
          </div>
          <div className="mt-2 text-white/55 text-sm">
            Stored in localStorage — reload safe
          </div>
        </Card>

        <Card>
          <div className="text-xs text-white/55">Active Warnings</div>
          <div className="mt-2 text-4xl font-extrabold">
            <CountUpStat value={warnings.length} />
          </div>
          <div className="mt-2 text-white/55 text-sm">
            Auto-generated from profile + risks
          </div>
        </Card>

        <Card>
          <div className="text-xs text-white/55">Generated Recipes</div>
          <div className="mt-2 text-4xl font-extrabold">
            <CountUpStat value={recipes.length} />
          </div>
          <div className="mt-2 text-white/55 text-sm">
            Substitutions applied automatically
          </div>
        </Card>
      </div>

      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <RiskRadar risks={risk} />

        <Card>
          <div className="text-sm font-semibold">Latest Activity</div>
          <div className="mt-3 space-y-2">
            {analyses.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="glass rounded-2xl border border-white/10 p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{a.label}</div>
                  <div className="text-xs text-white/55">{new Date(a.ts).toLocaleString()}</div>
                </div>
                <Badge tone={a.verdict?.tone || "neutral"}>
                  {a.verdict?.label || "UNKNOWN"} • {a.healthScore}
                </Badge>
              </div>
            ))}

            {!analyses.length ? (
              <div className="text-sm text-white/55">
                No data yet. Start with Analyzer.
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
