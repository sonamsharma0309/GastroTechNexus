import { INGREDIENT_DB, DEFAULT_INGREDIENT } from "../data/ingredientDB.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function normalize(str) {
  return String(str || "").trim().toLowerCase();
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function profilePenalty(profile) {
  // Profile conditions increase sensitivity
  const p = {
    diabetes: profile?.diabetes ? 0.22 : 0,
    pcos: profile?.pcos ? 0.12 : 0,
    pcod: profile?.pcod ? 0.10 : 0,
    menstrual: profile?.menstrualPhase ? 0.08 : 0,
  };
  return p.diabetes + p.pcos + p.pcod + p.menstrual;
}

function scoreFromRisk(baseScore, risks, profile) {
  // Higher risk reduces score, plus penalty for selected conditions
  const pen = profilePenalty(profile);

  // weighted metabolic impact
  const impact =
    0.42 * risks.diabetes + 0.34 * risks.inflammation + 0.24 * risks.hormonal;

  const score = baseScore - 100 * (impact * 0.55 + pen * 0.35);
  return clamp(Math.round(score), 3, 98);
}

function verdictFromScore(score) {
  if (score >= 80) return { label: "SAFE", tone: "safe" };
  if (score >= 55) return { label: "CAUTION", tone: "caution" };
  return { label: "HARMFUL", tone: "harmful" };
}

export async function analyzeIngredientSim(input, profile) {
  const key = normalize(input);
  const data = INGREDIENT_DB[key] ?? {
    ...DEFAULT_INGREDIENT,
    label: input ? input : DEFAULT_INGREDIENT.label,
  };

  // cinematic scan
  await sleep(600);
  await sleep(500);
  await sleep(500);

  const healthScore = scoreFromRisk(data.baseScore, data.risks, profile);
  const verdict = verdictFromScore(healthScore);

  // generate condition-specific warning
  let warning = "";
  if (profile?.diabetes && data.risks.diabetes > 0.6) {
    warning = "High insulin impact detected for Diabetes profile.";
  } else if ((profile?.pcos || profile?.pcod) && data.risks.hormonal > 0.55) {
    warning = "Potential hormonal disruption for PCOS/PCOD profile.";
  } else if (profile?.menstrualPhase && data.risks.inflammation > 0.55) {
    warning = "Inflammation risk may be higher in this cycle phase.";
  }

  return {
    id: crypto.randomUUID(),
    input: input || "",
    canonical: key,
    ...data,
    healthScore,
    verdict,
    warning,
    ts: Date.now(),
  };
}

export function generateRecipeSim(ingredientsRaw, profile) {
  const list = ingredientsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const items = list.map((name) => {
    const k = normalize(name);
    const data = INGREDIENT_DB[k] ?? { ...DEFAULT_INGREDIENT, label: name };
    const score = scoreFromRisk(data.baseScore, data.risks, profile);
    const verdict = verdictFromScore(score);
    const replaced =
      verdict.tone === "harmful" ? (data.alternative || "Whole-food option") : null;

    return {
      name: data.label,
      key: k,
      score,
      verdict,
      substitute: replaced,
    };
  });

  const harmful = items.filter((x) => x.verdict.tone === "harmful");
  const safe = items.filter((x) => x.verdict.tone !== "harmful");

  const title = harmful.length
    ? "Smart Balanced Bowl"
    : "AI Clean Nutrition Plate";

  const steps = [
    "Prep ingredients and wash greens thoroughly.",
    "Swap flagged items with AI-recommended alternatives.",
    "Cook with low-oil method; prefer steaming/sautéing.",
    "Finish with anti-inflammatory spices (turmeric, cumin).",
    "Serve with fiber-first order: greens → protein → carbs.",
  ];

  return {
    id: crypto.randomUUID(),
    title,
    imageHint: "futuristic healthy bowl",
    ingredients: items,
    safeCount: safe.length,
    harmfulCount: harmful.length,
    substitutions: harmful.map((h) => ({ from: h.name, to: h.substitute })),
    steps,
    ts: Date.now(),
  };
}
