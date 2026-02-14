import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, AlertTriangle, CheckCircle2, Replace, PlugZap } from "lucide-react";

import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";

import HealthScoreRing from "../components/charts/HealthScoreRing.jsx";
import RiskRadar from "../components/charts/RiskRadar.jsx";

import { useAI } from "../context/AIContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { pingHealth } from "../services/api.js";

// --- helper: map backend ML response -> UI result shape used by your page
function mapBackendToUI(payload) {
  // backend ML payload sample:
  // {
  //   ingredient, verdict, score, explanation, alternatives: [...], conditions: [...]
  // }
  const ingredient = payload?.ingredient || "Ingredient";
  const score = Number(payload?.score ?? 0);
  const verdictRaw = String(payload?.verdict || "unknown").toLowerCase();

  const tone =
    verdictRaw === "harmful" ? "harmful" : verdictRaw === "safe" ? "safe" : "neutral";

  const verdictLabel =
    verdictRaw === "harmful" ? "HARMFUL" : verdictRaw === "safe" ? "SAFE" : "UNKNOWN";

  const alternatives = Array.isArray(payload?.alternatives)
    ? payload.alternatives
    : payload?.alternatives
    ? [String(payload.alternatives)]
    : [];

  // basic risk values for radar (tweak later if you want)
  const risks = {
    diabetes: tone === "harmful" ? 0.82 : 0.28,
    inflammation: tone === "harmful" ? 0.62 : 0.32,
    hormonal: tone === "harmful" ? 0.72 : 0.30,
  };

  return {
    id: crypto.randomUUID?.() || String(Date.now()),
    ts: Date.now(),
    label: ingredient,
    healthScore: score,
    verdict: { tone, label: verdictLabel },
    why: payload?.explanation || "No explanation returned.",
    alternative: alternatives.length ? alternatives.join(", ") : "No alternative available.",
    warning: tone === "harmful" ? "This ingredient may be risky for your selected profile." : "",
    risks,
    _raw: payload,
  };
}

export default function IngredientAnalyzer() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { analyzeIngredient, analyses, activeConditions } = useAI();
  const toast = useToast();

  // ✅ backend link state (like dashboard)
  const [backend, setBackend] = useState({ state: "checking", ms: null });

  const backendLabel =
    backend.state === "ok" ? "Connected" : backend.state === "checking" ? "Linking…" : "Offline";

  const dotClass =
    backend.state === "ok"
      ? "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.65)]"
      : backend.state === "checking"
      ? "bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.55)] animate-pulse"
      : "bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.55)]";

  const apiBase = useMemo(() => {
    return import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";
  }, []);

  const checkBackend = async () => {
    const t0 = performance.now();
    try {
      setBackend({ state: "checking", ms: null });
      const data = await pingHealth();
      const ms = Math.round(performance.now() - t0);
      if (data?.status === "ok") setBackend({ state: "ok", ms });
      else setBackend({ state: "fail", ms });
    } catch {
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

  // ✅ NOW CALLS ML ENDPOINT
  async function callBackendAnalyze(ingredient, conditions) {
    const res = await fetch(`${apiBase}/api/ml/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredient, conditions }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Backend error: ${res.status}`);
    }
    return res.json();
  }

  async function onAnalyze() {
    if (!q.trim()) return toast.warn("Enter an ingredient name.");
    setLoading(true);
    setResult(null);

    try {
      // ✅ try backend ML first
      const conds = Array.isArray(activeConditions) ? activeConditions : [];
      const backendPayload = await callBackendAnalyze(q.trim(), conds);
      const ui = mapBackendToUI(backendPayload);

      setResult(ui);
      toast.success(`Backend ML: ${ui.verdict?.label} (${ui.healthScore})`);
      setBackend((p) => ({ ...p, state: "ok" }));
    } catch (e) {
      // ✅ fallback to simulated AI if backend fails
      try {
        const r = await analyzeIngredient(q);
        setResult(r);
        toast.warn("Backend ML unavailable → using simulated AI");
      } catch {
        toast.error("Analysis failed. Try again.");
      }
      setBackend((p) => ({ ...p, state: "fail" }));
    } finally {
      setLoading(false);
    }
  }

  const tone = result?.verdict?.tone || "neutral";

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-white/55">Ingredient Analyzer</div>
          <div className="text-2xl md:text-3xl font-extrabold">Neural Ingredient Scan</div>
          <div className="mt-2 text-white/65 text-sm">
            Type ingredient → ML scan → score + explanation + safer alternative
          </div>
        </div>

        {/* ✅ Backend ML badge */}
        <Badge tone="neutral">
          <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
          <PlugZap size={14} />
          Backend ML • {backendLabel}
        </Badge>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="text-sm font-semibold">Scan Input</div>

          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try: sugar, turmeric, spinach, white rice..."
            />
            <Button onClick={onAnalyze} disabled={loading}>
              {loading ? "AI analyzing..." : "Analyze"}
            </Button>
            <Button variant="ghost" onClick={checkBackend} disabled={loading}>
              Refresh Link
            </Button>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="grid md:grid-cols-3 gap-3">
                <Skeleton className="h-[150px]" />
                <Skeleton className="h-[150px]" />
                <Skeleton className="h-[150px]" />
              </div>
            ) : null}

            <AnimatePresence>
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.35 }}
                  className="mt-4 grid md:grid-cols-3 gap-4"
                >
                  <div className="md:col-span-1 glass rounded-2xl border border-white/10 p-4">
                    <HealthScoreRing value={result.healthScore} tone={tone} />
                    <div className="mt-4 flex justify-center">
                      <Badge tone={tone}>
                        {tone === "harmful" ? (
                          <AlertTriangle size={14} />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        {result.verdict.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="glass rounded-2xl border border-white/10 p-4">
                      <div className="text-sm font-semibold">{result.label}</div>
                      <div className="mt-2 text-sm text-white/70">{result.why}</div>

                      {result.warning ? (
                        <div className="mt-3 glass rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
                          <div className="font-semibold flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Profile Alert
                          </div>
                          <div className="text-red-100/80">{result.warning}</div>
                        </div>
                      ) : null}

                      <div className="mt-3 flex items-center gap-2 text-sm text-white/75">
                        <Replace size={16} className="text-sky-200" />
                        <span className="font-semibold">Alternative:</span>
                        <span className="text-white/70">{result.alternative}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <RiskRadar risks={result.risks} />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Recent Scans</div>
          <div className="mt-3 space-y-2">
            {analyses.slice(0, 6).map((a) => (
              <button
                key={a.id}
                onClick={() => setResult(a)}
                className="w-full text-left glass rounded-2xl border border-white/10 p-3 hover:bg-white/7 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{a.label}</div>
                  <Badge tone={a.verdict.tone}>{a.healthScore}</Badge>
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {new Date(a.ts).toLocaleTimeString()}
                </div>
              </button>
            ))}
            {!analyses.length ? <div className="text-sm text-white/55">No scans yet.</div> : null}
          </div>
        </Card>
      </div>

      <div className="mt-4 text-xs text-white/50 flex items-center gap-2">
        <FlaskConical size={14} />
        Backend API: <span className="text-white/70">{apiBase}</span>
      </div>
    </div>
  );
}
