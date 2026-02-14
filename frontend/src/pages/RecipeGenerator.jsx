import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Sparkles } from "lucide-react";

import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";

import { useAI } from "../context/AIContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function RecipeGenerator() {
  const [raw, setRaw] = useState("");
  const [last, setLast] = useState(null);

  const { generateRecipe, recipes } = useAI();
  const toast = useToast();

  function onGenerate() {
    if (!raw.trim()) return toast.warn("Enter ingredients separated by comma.");
    const r = generateRecipe(raw);
    setLast(r);
    toast.success("Smart recipe generated with substitutions.");
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-white/55">Recipe Generator</div>
          <div className="text-2xl md:text-3xl font-extrabold">Smart Recipe Synthesizer</div>
          <div className="mt-2 text-white/65 text-sm">
            Harmful ingredients auto-replaced → substitutions shown dynamically
          </div>
        </div>
        <Badge tone="neutral">
          <Sparkles size={14} /> AI Chef (Sim)
        </Badge>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="text-sm font-semibold">Input Ingredients</div>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <Input
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Example: sugar, spinach, milk, white rice"
            />
            <Button onClick={onGenerate}>
              <Wand2 size={16} /> Generate Smart Recipe
            </Button>
          </div>

          <AnimatePresence>
            {last ? (
              <motion.div
                key={last.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.35 }}
                className="mt-5"
              >
                <div className="glass rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs text-white/55">Generated</div>
                      <div className="text-xl font-extrabold">{last.title}</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge tone={last.harmfulCount ? "caution" : "safe"}>
                        Safe: {last.safeCount}
                      </Badge>
                      <Badge tone={last.harmfulCount ? "harmful" : "safe"}>
                        Harmful: {last.harmfulCount}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="glass rounded-2xl border border-white/10 p-4">
                      <div className="text-sm font-semibold">Ingredients</div>
                      <ul className="mt-2 space-y-2 text-sm text-white/70">
                        {last.ingredients.map((i) => (
                          <li key={i.key} className="flex items-center justify-between gap-2">
                            <span>{i.name}</span>
                            <Badge tone={i.verdict.tone}>{i.verdict.label}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="glass rounded-2xl border border-white/10 p-4">
                      <div className="text-sm font-semibold">Substitutions</div>
                      {last.substitutions.length ? (
                        <ul className="mt-2 space-y-2 text-sm text-white/70">
                          {last.substitutions.map((s, idx) => (
                            <li key={idx} className="flex items-start justify-between gap-3">
                              <span className="text-red-200/90">{s.from}</span>
                              <span className="text-white/40">→</span>
                              <span className="text-emerald-200/90">{s.to}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-2 text-sm text-white/55">
                          No harmful ingredients detected. Clean build ✅
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 glass rounded-2xl border border-white/10 p-4">
                    <div className="text-sm font-semibold">Steps</div>
                    <ol className="mt-2 space-y-2 text-sm text-white/70 list-decimal list-inside">
                      {last.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Card>

        <Card>
          <div className="text-sm font-semibold">History</div>
          <div className="mt-3 space-y-2">
            {recipes.slice(0, 6).map((r) => (
              <button
                key={r.id}
                onClick={() => setLast(r)}
                className="w-full text-left glass rounded-2xl border border-white/10 p-3 hover:bg-white/7 transition"
              >
                <div className="font-semibold">{r.title}</div>
                <div className="mt-1 flex gap-2">
                  <Badge tone={r.harmfulCount ? "caution" : "safe"}>Safe {r.safeCount}</Badge>
                  <Badge tone={r.harmfulCount ? "harmful" : "safe"}>Harm {r.harmfulCount}</Badge>
                </div>
              </button>
            ))}
            {!recipes.length ? (
              <div className="text-sm text-white/55">No recipes yet.</div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
