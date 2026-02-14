import React from "react";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import CountUpStat from "../components/charts/CountUpStat.jsx";
import RiskRadar from "../components/charts/RiskRadar.jsx";
import { useAI } from "../context/AIContext.jsx";
import { Link } from "react-router-dom";
import { pingHealth } from "../services/api.js";

export default function Dashboard() {
  const { analyses, warnings, recipes, activeConditions, clearAll } = useAI();

  const last = analyses[0];
  const risk = last?.risks || { diabetes: 0.35, inflammation: 0.35, hormonal: 0.35 };

  // ✅ Backend connection state
  const [backend, setBackend] = React.useState({
    state: "checking", // checking | ok | fail
    ms: null,
  });

  const checkBackend = async () => {
    const t0 = performance.now();
    try {
      setBackend({ state: "checking", ms: null });
      const data = await pingHealth();
      const ms = Math.round(performance.now() - t0);

      if (data?.status === "ok") setBackend({ state: "ok", ms });
      else setBackend({ state: "fail", ms });
    } catch (e) {
      const ms = Math.round(performance.now() - t0);
      setBackend({ state: "fail", ms });
    }
  };

  React.useEffect(() => {
    checkBackend();
    const id = setInterval(checkBackend, 25000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dotClass =
    backend.state === "ok"
      ? "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.65)]"
      : backend.state === "checking"
      ? "bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.55)] animate-pulse"
      : "bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.55)]";

  const label =
    backend.state === "ok" ? "Connected" : backend.state === "checking" ? "Linking…" : "Offline";

  const sub =
    backend.state === "ok"
      ? `API OK • ${backend.ms ?? "--"}ms`
      : backend.state === "checking"
      ? "Handshake /health"
      : "Start backend: python run.py";

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
              activeConditions.map((c) => (
                <Badge key={c} tone="neutral">
                  {c}
                </Badge>
              ))
            ) : (
              <Badge tone="neutral">Set your profile for better accuracy</Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link to="/app/analyzer">
            <Button>Analyze</Button>
          </Link>
          <Button variant="ghost" onClick={clearAll}>
            Clear Data
          </Button>
        </div>
      </div>

      {/* ✅ Main stats row */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card>
          <div className="text-xs text-white/55">Analyzed Ingredients</div>
          <div className="mt-2 text-4xl font-extrabold">
            <CountUpStat value={analyses.length} />
          </div>
          <div className="mt-2 text-white/55 text-sm">Stored in localStorage — reload safe</div>
        </Card>

        <Card>
          <div className="text-xs text-white/55">Active Warnings</div>
          <div className="mt-2 text-4xl font-extrabold">
            <CountUpStat value={warnings.length} />
          </div>
          <div className="mt-2 text-white/55 text-sm">Auto-generated from profile + risks</div>
        </Card>

        <Card>
          <div className="text-xs text-white/55">Generated Recipes</div>
          <div className="mt-2 text-4xl font-extrabold">
            <CountUpStat value={recipes.length} />
          </div>
          <div className="mt-2 text-white/55 text-sm">Substitutions applied automatically</div>
        </Card>
      </div>

      {/* ✅ Lower section: Radar + Right column (Latest Activity + Backend card) */}
      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <RiskRadar risks={risk} />

        <div className="space-y-4">
          {/* ✅ Backend Bridge (side panel style) */}
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-white/55">🔗 System Link</div>
                <div className="text-lg font-semibold mt-1">Backend Bridge</div>
                <div className="mt-2 text-sm text-white/70">
                  Status: <span className="font-semibold text-white/90">{label}</span>
                </div>
                <div className="mt-1 text-xs text-white/55">{sub}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
                <Button variant="ghost" onClick={checkBackend}>
                  Refresh
                </Button>
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400/60 via-cyan-400/50 to-purple-400/55"
                style={{
                  width:
                    backend.state === "ok"
                      ? "100%"
                      : backend.state === "checking"
                      ? "55%"
                      : "12%",
                  transition: "width 450ms ease",
                }}
              />
            </div>

            <div className="mt-3 text-xs text-white/55">
              ✅ Tip: Backend chal raha ho toh Analyzer real API se data la sakta hai.
            </div>
          </Card>

          {/* ✅ Latest Activity (same as you had) */}
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
                    <div className="text-xs text-white/55">
                      {new Date(a.ts).toLocaleString()}
                    </div>
                  </div>
                  <Badge tone={a.verdict?.tone || "neutral"}>
                    {a.verdict?.label || "UNKNOWN"} • {a.healthScore}
                  </Badge>
                </div>
              ))}

              {!analyses.length ? (
                <div className="text-sm text-white/55">No data yet. Start with Analyzer.</div>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
