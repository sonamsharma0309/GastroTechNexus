import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

export default function AIOrb() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        className="fixed bottom-5 right-5 z-[70] h-14 w-14 rounded-full glass-strong border border-white/12 soft-glow flex items-center justify-center"
        onClick={() => setOpen((s) => !s)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-80"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(160,90,255,.55), transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,190,255,.45), transparent 55%), radial-gradient(circle at 50% 90%, rgba(0,255,170,.25), transparent 60%)",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 40px rgba(0,190,255,.22)", "0 0 0 rgba(0,0,0,0)"] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <Sparkles className="relative text-white/90" size={22} />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed bottom-24 right-5 z-[70] w-[min(360px,92vw)] glass-strong border border-white/12 rounded-2xl p-4"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-white/70" />
                <div className="text-sm font-semibold">AI Assistant (Sim)</div>
              </div>
              <button
                className="text-white/50 hover:text-white/80 text-sm"
                onClick={() => setOpen(false)}
              >
                close
              </button>
            </div>

            <div className="mt-3 text-xs text-white/60">
              Ask anything like: “Is sugar safe for diabetes?” (UI simulation)
            </div>

            <div className="mt-3 flex gap-2">
              <Input placeholder="Type your question..." />
              <Button size="md" className="whitespace-nowrap">
                Send
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
