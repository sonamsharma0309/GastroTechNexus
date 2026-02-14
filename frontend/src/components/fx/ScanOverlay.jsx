import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingText from "./TypingText.jsx";

export default function ScanOverlay({ open, stage, progress }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-[min(680px,92vw)] rounded-3xl glass-strong border border-white/12 p-6 overflow-hidden"
            initial={{ scale: 0.98, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 16, opacity: 0 }}
          >
            <div className="absolute inset-0 opacity-40"
              style={{
                background:
                  "linear-gradient(120deg, rgba(160,90,255,.22), transparent 35%), linear-gradient(240deg, rgba(0,190,255,.18), transparent 40%)",
              }}
            />
            <div className="relative">
              <div className="text-sm text-white/70">AI Scan Mode</div>
              <div className="mt-2 text-2xl font-extrabold text-gradient">
                GastroTechNexus Neural Analyzer
              </div>

              <div className="mt-5 glass rounded-2xl border border-white/10 p-4">
                <div className="text-white/80">
                  <TypingText text={stage || "Scanning..."} />
                </div>

                <div className="mt-4 h-3 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(3, Math.min(100, progress || 0))}%`,
                      background:
                        "linear-gradient(90deg, rgba(160,90,255,1), rgba(0,190,255,1), rgba(0,255,170,1))",
                      boxShadow: "0 0 24px rgba(0,190,255,.25)",
                      transition: "width 220ms ease",
                    }}
                  />
                </div>

                <div className="mt-3 text-xs text-white/50">
                  {Math.min(100, progress || 0)}% • metabolic graph computation
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-xs text-white/60">
                <div className="glass rounded-xl p-3 border border-white/10">Signal Noise Filter</div>
                <div className="glass rounded-xl p-3 border border-white/10">Hormonal Vector Scan</div>
                <div className="glass rounded-xl p-3 border border-white/10">Insulin Impact Model</div>
              </div>
            </div>

            {/* scanning line */}
            <motion.div
              className="absolute left-0 right-0 h-14 opacity-60"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(0,190,255,.22), transparent)",
              }}
              animate={{ top: ["-10%", "110%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
