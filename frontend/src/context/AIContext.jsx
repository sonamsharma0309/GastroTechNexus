import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../utils/storage.js";
import { analyzeIngredientSim, generateRecipeSim } from "../utils/aiSim.js";

const AIContext = createContext(null);

const LS_PROFILE = "gtnx_profile_v1";
const LS_ANALYSES = "gtnx_analyses_v1";
const LS_RECIPES = "gtnx_recipes_v1";
const LS_WARNINGS = "gtnx_warnings_v1";

const defaultProfile = {
  pcos: false,
  pcod: false,
  diabetes: false,
  menstrualPhase: "",
  goal: "Metabolic Balance",
};

export function AIProvider({ children }) {
  const [profile, setProfile] = useState(() => storage.get(LS_PROFILE, defaultProfile));
  const [analyses, setAnalyses] = useState(() => storage.get(LS_ANALYSES, []));
  const [recipes, setRecipes] = useState(() => storage.get(LS_RECIPES, []));
  const [warnings, setWarnings] = useState(() => storage.get(LS_WARNINGS, []));

  const [scanOpen, setScanOpen] = useState(false);
  const [scanStage, setScanStage] = useState("Initializing AI...");
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => storage.set(LS_PROFILE, profile), [profile]);
  useEffect(() => storage.set(LS_ANALYSES, analyses), [analyses]);
  useEffect(() => storage.set(LS_RECIPES, recipes), [recipes]);
  useEffect(() => storage.set(LS_WARNINGS, warnings), [warnings]);

  const activeConditions = useMemo(() => {
    const arr = [];
    if (profile.pcos) arr.push("PCOS");
    if (profile.pcod) arr.push("PCOD");
    if (profile.diabetes) arr.push("Diabetes");
    if (profile.menstrualPhase) arr.push(profile.menstrualPhase);
    return arr;
  }, [profile]);

  async function analyzeIngredient(input) {
    // cinematic scan overlay
    setScanOpen(true);
    setScanProgress(0);
    setScanStage("Booting neural scanner...");

    const stages = [
      "Scanning molecular structure...",
      "Analyzing metabolic impact...",
      "Checking hormonal interactions...",
      "Synthesizing safe alternatives...",
      "Finalizing report...",
    ];

    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(98, p + Math.floor(Math.random() * 7) + 2);
      setScanProgress(p);
      const idx = Math.min(stages.length - 1, Math.floor((p / 100) * stages.length));
      setScanStage(stages[idx]);
    }, 220);

    try {
      const result = await analyzeIngredientSim(input, profile);
      clearInterval(timer);
      setScanProgress(100);
      setScanStage("Report generated.");

      setAnalyses((prev) => [result, ...prev].slice(0, 30));

      if (result.warning) {
        const w = {
          id: crypto.randomUUID(),
          title: "Health Alert",
          message: result.warning,
          tone: result.verdict?.tone || "caution",
          ts: Date.now(),
        };
        setWarnings((prev) => [w, ...prev].slice(0, 50));
      }

      setTimeout(() => setScanOpen(false), 450);
      return result;
    } catch (e) {
      clearInterval(timer);
      setScanOpen(false);
      throw e;
    }
  }

  function generateRecipe(ingredientsRaw) {
    const recipe = generateRecipeSim(ingredientsRaw, profile);
    setRecipes((prev) => [recipe, ...prev].slice(0, 20));

    if (recipe.harmfulCount > 0) {
      const w = {
        id: crypto.randomUUID(),
        title: "Auto Substitution Applied",
        message: `${recipe.harmfulCount} harmful ingredient(s) replaced with safer options.`,
        tone: "caution",
        ts: Date.now(),
      };
      setWarnings((prev) => [w, ...prev].slice(0, 50));
    }
    return recipe;
  }

  function clearAll() {
    setAnalyses([]);
    setRecipes([]);
    setWarnings([]);
  }

  const value = {
    profile,
    setProfile,
    activeConditions,

    analyses,
    recipes,
    warnings,

    analyzeIngredient,
    generateRecipe,
    clearAll,

    scanOpen,
    scanStage,
    scanProgress,
    setScanOpen,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used inside AIProvider");
  return ctx;
}
