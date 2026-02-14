from .ingredient_features import build_ingredient_feature_vector

def predict_health_risk(ingredient: str, conditions: list[str]):
    data = build_ingredient_feature_vector(ingredient)
    f = data["features"]

    conditions = conditions or []
    conds = [c.lower() for c in conditions]

    # ---- scoring (0..100) ----
    # start neutral
    score = 60

    # diabetes stricter on sugar + refined carbs
    if "diabetes" in conds:
        score -= int(35 * f["sugar"] + 20 * f["refined_carb"])

    # pcos stricter on processed + refined carbs
    if "pcos" in conds:
        score -= int(25 * f["processed"] + 15 * f["refined_carb"])

    # pcos/menstrual (optional)
    if "menstrual" in conds or "pcod" in conds:
        score -= int(18 * f["processed"])

    # fiber/protein improve
    score += int(12 * f["high_fiber"] + 10 * f["high_protein"])

    # clamp
    score = max(0, min(100, score))

    # verdict
    if score <= 35:
        verdict = "harmful"
    elif score >= 75:
        verdict = "safe"
    else:
        verdict = "neutral"

    # explanation + alternatives
    explanation_parts = []
    alternatives = []

    if f["sugar"] > 0:
        explanation_parts.append("High sugar → spikes insulin / worsens metabolic markers.")
        alternatives += ["stevia", "erythritol", "coconut sugar (small)"]

    if f["refined_carb"] > 0:
        explanation_parts.append("Refined carbs → higher glycemic load.")
        alternatives += ["brown rice", "millets", "whole wheat"]

    if f["processed"] > 0.7:
        explanation_parts.append("Highly processed → inflammation risk.")
        alternatives += ["home-cooked", "less processed options"]

    if f["high_fiber"] > 0:
        explanation_parts.append("Fiber helps stabilize glucose & improves gut health.")

    if not explanation_parts:
        explanation_parts.append("No strong risk signals from heuristic nutrition profile.")

    return {
        "ingredient": data["ingredient"],
        "conditions": conditions,
        "verdict": verdict,
        "score": score,
        "explanation": " ".join(explanation_parts),
        "alternatives": list(dict.fromkeys(alternatives))[:6],
        # debug (optional) – keep it, frontend ignore karega
        "debug": {
            "features": data["features"],
            "flavordb_url": data.get("flavordb", {}).get("url"),
            "recipedb_url": data.get("recipedb", {}).get("url"),
        },
    }
