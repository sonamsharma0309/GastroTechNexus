import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, FlaskConical, ShieldCheck } from "lucide-react";

import ParallaxBackground from "../components/fx/ParallaxBackground.jsx";
import ParticlesField from "../components/fx/ParticlesField.jsx";
import MouseFollower from "../components/fx/MouseFollower.jsx";
import TypingText from "../components/fx/TypingText.jsx";
import GlowBorder from "../components/fx/GlowBorder.jsx";

import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

import { useAI } from "../context/AIContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Landing() {
  const [ingredient, setIngredient] = useState("");
  const navigate = useNavigate();
  const { analyzeIngredient } = useAI();
  const toast = useToast();

  async function quickAnalyze() {
    if (!ingredient.trim()) return toast.warn("Type an ingredient first.");
    toast.info("Launching AI Scan Mode...");
    await analyzeIngredient(ingredient);
    navigate("/app/analyzer");
  }

  return (
    <div className="relative min-h-screen">
      <ParallaxBackground />
      <ParticlesField count={30} />
      <MouseFollower />

      <header className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-7 flex items-center justify-between">
        <div className="font-extrabold text-gradient text-xl">GastroTechNexus AI</div>
        <nav className="flex items-center gap-2">
          <Link to="/app">
            <Button variant="ghost">Open App</Button>
          </Link>
          <Link to="/app/profile">
            <Button>Set Profile</Button>
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-10 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass-strong border border-white/12 rounded-full px-4 py-2 text-xs text-white/70"
            >
              <Sparkles size={14} />
              Ultra-premium AI Nutrition Guardian
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight"
            >
              <span className="text-gradient">GastroTechNexus AI</span> — Your Intelligent Nutrition Guardian
            </motion.h1>

            <div className="mt-4 text-white/70 text-base md:text-lg">
              <TypingText
                text="Analyze ingredients, detect harmful foods, and generate safe recipes for PCOS, Diabetes & hormonal health — with futuristic AI scan mode."
                speed={16}
              />
            </div>

            <GlowBorder className="mt-7">
              <div className="glass-strong rounded-2xl p-4 border border-white/12">
                <div className="text-xs text-white/60 mb-2">Instant Ingredient Scan</div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                    placeholder="Try: sugar, turmeric, white rice, spinach..."
                    className="text-white"
                  />
                  <Button onClick={quickAnalyze} className="justify-center">
                    Analyze Ingredients <ArrowRight size={16} />
                  </Button>
                </div>
                <div className="mt-2 text-xs text-white/45">
                  (You’ll see fullscreen AI scan animation + results)
                </div>
              </div>
            </GlowBorder>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="glass rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/70 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-300" />
                Condition-aware warnings
              </div>
              <div className="glass rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/70 flex items-center gap-2">
                <FlaskConical size={16} className="text-sky-300" />
                Metabolic + hormonal impact
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative"
          >
            <Card className="rounded-3xl">
              <div className="text-xs text-white/60">Preview</div>
              <div className="mt-2 text-2xl font-extrabold">Neural Health Dashboard</div>
              <div className="mt-3 text-white/65 text-sm">
                Feels like an AI OS — live stats, risk radar, substitutions, alerts, scan mode.
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="glass rounded-2xl border border-white/10 p-4">
                  <div className="text-xs text-white/55">Live Alerts</div>
                  <div className="mt-2 text-3xl font-extrabold text-white/90">24</div>
                  <div className="text-xs text-white/45">auto-updating</div>
                </div>
                <div className="glass rounded-2xl border border-white/10 p-4">
                  <div className="text-xs text-white/55">Health Score</div>
                  <div className="mt-2 text-3xl font-extrabold text-gradient">88</div>
                  <div className="text-xs text-white/45">AI computed</div>
                </div>
              </div>

              <div className="mt-4 glass rounded-2xl border border-white/10 p-4">
                <div className="text-xs text-white/55">Micro-interactions</div>
                <div className="mt-2 text-sm text-white/65">
                  Hover glow • parallax • particles • scan overlay • typing • neon borders
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Link to="/app">
                  <Button>Open App</Button>
                </Link>
                <Link to="/app/analyzer">
                  <Button variant="ghost">Go Analyzer</Button>
                </Link>
              </div>
            </Card>

            <div className="absolute -inset-8 -z-10 opacity-50 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(160,90,255,.30), transparent 60%), radial-gradient(circle at 70% 60%, rgba(0,190,255,.22), transparent 55%), radial-gradient(circle at 50% 90%, rgba(0,255,170,.12), transparent 60%)",
              }}
            />
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pb-10 text-xs text-white/45">
        © {new Date().getFullYear()} GastroTechNexus AI • Futuristic Health Platform
      </footer>
    </div>
  );
}
