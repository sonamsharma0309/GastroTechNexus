import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Activity, Droplet, CalendarHeart } from "lucide-react";

import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import { useAI } from "../context/AIContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const phaseOptions = ["Follicular", "Ovulation", "Luteal", "Menstrual"];

function ToggleCard({ title, icon: Icon, active, onClick, desc }) {
  return (
    <button
      onClick={onClick}
      className={`text-left glass rounded-2xl border p-4 transition hover:bg-white/7 ${
        active ? "border-white/22" : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-white/70" />
          <div className="font-semibold">{title}</div>
        </div>
        <Badge tone={active ? "safe" : "neutral"}>{active ? "ON" : "OFF"}</Badge>
      </div>
      <div className="mt-2 text-sm text-white/60">{desc}</div>
    </button>
  );
}

export default function HealthProfile() {
  const { profile, setProfile, activeConditions } = useAI();
  const toast = useToast();

  function toggle(key) {
    setProfile((p) => ({ ...p, [key]: !p[key] }));
  }

  function setPhase(v) {
    setProfile((p) => ({ ...p, menstrualPhase: p.menstrualPhase === v ? "" : v }));
  }

  function save() {
    toast.success("Profile saved (localStorage).");
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-white/55">Health Profile</div>
          <div className="text-2xl md:text-3xl font-extrabold">Condition Intelligence</div>
          <div className="mt-2 text-white/65 text-sm">
            These settings affect warnings, score sensitivity & substitutions.
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={save}>Save</Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {activeConditions.length ? activeConditions.map((c) => (
          <Badge key={c} tone="neutral">{c}</Badge>
        )) : <Badge tone="neutral">No conditions selected</Badge>}
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="text-sm font-semibold">Select Conditions</div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <ToggleCard
              title="PCOS"
              icon={HeartPulse}
              active={profile.pcos}
              onClick={() => toggle("pcos")}
              desc="Hormonal & metabolic sensitivity increased."
            />
            <ToggleCard
              title="PCOD"
              icon={Activity}
              active={profile.pcod}
              onClick={() => toggle("pcod")}
              desc="Triggers risk penalty for refined carbs."
            />
            <ToggleCard
              title="Diabetes"
              icon={Droplet}
              active={profile.diabetes}
              onClick={() => toggle("diabetes")}
              desc="Insulin impact weighted higher."
            />
            <div className="glass rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-2">
                <CalendarHeart size={18} className="text-white/70" />
                <div className="font-semibold">Menstrual Phase</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {phaseOptions.map((ph) => {
                  const on = profile.menstrualPhase === ph;
                  return (
                    <button
                      key={ph}
                      onClick={() => setPhase(ph)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                        on
                          ? "bg-white/10 border-white/18"
                          : "bg-white/5 border-white/10 hover:bg-white/8"
                      }`}
                    >
                      {ph}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-white/50">
                Selected:{" "}
                <span className="text-white/75">
                  {profile.menstrualPhase || "None"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card>
            <div className="text-sm font-semibold">Risk Indicators</div>
            <div className="mt-3 text-sm text-white/65">
              Based on your profile, AI will be stricter for:
            </div>

            <div className="mt-4 space-y-3">
              <div className="glass rounded-2xl border border-white/10 p-4">
                <div className="font-semibold">Insulin Sensitivity</div>
                <div className="text-sm text-white/60">
                  {profile.diabetes ? "High sensitivity enabled." : "Normal sensitivity."}
                </div>
              </div>

              <div className="glass rounded-2xl border border-white/10 p-4">
                <div className="font-semibold">Hormonal Stability</div>
                <div className="text-sm text-white/60">
                  {(profile.pcos || profile.pcod)
                    ? "Enhanced hormonal risk detection."
                    : "Standard hormonal detection."}
                </div>
              </div>

              <div className="glass rounded-2xl border border-white/10 p-4">
                <div className="font-semibold">Inflammation Shield</div>
                <div className="text-sm text-white/60">
                  {profile.menstrualPhase ? `Cycle-aware adjustments: ${profile.menstrualPhase}` : "Cycle phase not selected."}
                </div>
              </div>
            </div>

            <div className="mt-5 text-xs text-white/50">
              ✅ Profile persists after reload (localStorage)
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
