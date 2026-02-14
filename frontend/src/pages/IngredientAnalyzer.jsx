import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, AlertTriangle, CheckCircle2, Replace } from "lucide-react";

import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";

import HealthScoreRing from "../components/charts/HealthScoreRing.jsx";
import RiskRadar from "../components/charts/RiskRadar.jsx";

import { useAI } from "../context/AIContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function IngredientAnalyzer() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { analyzeIngredient, analyses } = useAI();
  const toast = useToast();

  async function onAnalyze() {
    if (!q.trim()) return toast.warn("Enter an ingredient name.");
    setLoading(true);
    setResult(null);

    try {
      const r = await analyzeIngredient(q);
      setResult(r);
      toast.success(`AI Report: ${r.verdict?.label} (${r.healthScore})`);
    } catch {
      toast.error("Analysis failed. Try again.");
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
          <div className="text-2xl md:text-3xl font-extrabold">
            Neural Ingredient Scan
          </div>
          <div className="mt-2 text-white/65 text-sm">
            Type ingredient → AI scan overlay → score + explanation + safer alternative
          </div>
        </div>

        <Badge tone="neutral">
          <FlaskConical size={14} /> Simulated AI
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
                      <div className="text-sm font-semibold">
                        {result.label}
                      </div>
                      <div className="mt-2 text-sm text-white/70">
                        {result.why}
                      </div>

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
            {!analyses.length ? (
              <div className="text-sm text-white/55">No scans yet.</div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
