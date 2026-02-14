export const INGREDIENT_DB = {
  sugar: {
    label: "Sugar",
    tags: ["harmful"],
    risks: { diabetes: 0.95, inflammation: 0.7, hormonal: 0.65 },
    why: "Spikes blood glucose & insulin; increases inflammation and cravings.",
    alternative: "Stevia / Erythritol / Dates (small quantity)",
    baseScore: 18,
  },
  "white rice": {
    label: "White Rice",
    tags: ["harmful"],
    risks: { diabetes: 0.78, inflammation: 0.5, hormonal: 0.35 },
    why: "High glycemic load; can cause rapid glucose spikes.",
    alternative: "Brown rice / Quinoa / Cauliflower rice",
    baseScore: 32,
  },
  turmeric: {
    label: "Turmeric",
    tags: ["beneficial"],
    risks: { diabetes: 0.2, inflammation: 0.1, hormonal: 0.2 },
    why: "Curcumin may help inflammation and metabolic balance.",
    alternative: "Ginger (also anti-inflammatory)",
    baseScore: 92,
  },
  spinach: {
    label: "Spinach",
    tags: ["safe"],
    risks: { diabetes: 0.1, inflammation: 0.15, hormonal: 0.15 },
    why: "Fiber + micronutrients; low glycemic impact; supports metabolic health.",
    alternative: "Kale / Fenugreek leaves",
    baseScore: 88,
  },
  milk: {
    label: "Milk",
    tags: ["caution"],
    risks: { diabetes: 0.35, inflammation: 0.35, hormonal: 0.5 },
    why: "For some, dairy may worsen acne/inflammation and hormonal symptoms.",
    alternative: "Unsweetened almond / oat / soy milk",
    baseScore: 62,
  },
  bread: {
    label: "Refined Bread",
    tags: ["caution"],
    risks: { diabetes: 0.6, inflammation: 0.35, hormonal: 0.25 },
    why: "Refined flour can behave like sugar in the body.",
    alternative: "Whole grain / multigrain / millet roti",
    baseScore: 52,
  },
};

export const DEFAULT_INGREDIENT = {
  label: "Unknown Ingredient",
  tags: ["unknown"],
  risks: { diabetes: 0.35, inflammation: 0.35, hormonal: 0.35 },
  why: "No data found. Please verify spelling or try a common ingredient name.",
  alternative: "Try whole-food alternatives (less processed).",
  baseScore: 60,
};
