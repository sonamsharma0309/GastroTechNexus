import React from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

import ParallaxBackground from "../fx/ParallaxBackground.jsx";
import ParticlesField from "../fx/ParticlesField.jsx";
import MouseFollower from "../fx/MouseFollower.jsx";
import AIOrb from "../fx/AIOrb.jsx";
import ScanOverlay from "../fx/ScanOverlay.jsx";

import { useAI } from "../../context/AIContext.jsx";

export default function AppShell({ children }) {
  const { scanOpen, scanStage, scanProgress } = useAI();

  return (
    <div className="relative min-h-screen">
      <ParallaxBackground />
      <ParticlesField />
      <MouseFollower />

      <Topbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pb-12">
        <div className="flex gap-5">
          <Sidebar />

          <section className="flex-1">
            <div className="glass rounded-3xl border border-white/10 p-4 md:p-6">
              {children}
            </div>
          </section>
        </div>
      </main>

      <AIOrb />
      <ScanOverlay open={scanOpen} stage={scanStage} progress={scanProgress} />
    </div>
  );
}
