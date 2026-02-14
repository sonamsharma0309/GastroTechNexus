from flask import Blueprint, jsonify, request

bp = Blueprint("health", __name__)

@bp.get("/health")
def health():
    return jsonify({"status": "ok"})


@bp.post("/api/analyze")
def analyze_ingredient():
    """
    Simple simulated AI analyzer.
    Input JSON:
      {
        "ingredient": "sugar",
        "conditions": ["PCOS","Diabetes"],
        "phase": "Menstrual"   (optional)
      }
    """
    body = request.get_json(silent=True) or {}
    ingredient = (body.get("ingredient") or "").strip().lower()
    conditions = body.get("conditions") or []
    phase = body.get("phase") or ""

    if not ingredient:
        return jsonify({"error": "ingredient is required"}), 400

    # Mini knowledge base (hackathon-safe)
    db = {
        "sugar": {
            "base": "harmful",
            "reason": "High glycemic load; spikes insulin and worsens metabolic markers.",
            "alternatives": ["stevia", "erythritol", "coconut sugar (small)"],
            "score": 22,
            "tags": ["diabetes", "pcos"],
        },
        "white rice": {
            "base": "harmful",
            "reason": "Refined carbs; raises blood glucose quickly.",
            "alternatives": ["brown rice", "quinoa", "cauliflower rice"],
            "score": 28,
            "tags": ["diabetes"],
        },
        "turmeric": {
            "base": "beneficial",
            "reason": "Anti-inflammatory; may support hormonal balance and insulin sensitivity.",
            "alternatives": ["ginger", "cinnamon"],
            "score": 86,
            "tags": ["pcos", "pcod"],
        },
        "spinach": {
            "base": "safe",
            "reason": "Nutrient dense; low GI; supports micronutrient needs.",
            "alternatives": ["kale", "fenugreek leaves"],
            "score": 92,
            "tags": ["diabetes", "pcos", "pcod"],
        },
    }

    item = db.get(ingredient)
    if not item:
        # fallback unknown ingredient
        return jsonify({
            "ingredient": ingredient,
            "verdict": "unknown",
            "score": 60,
            "explanation": "Ingredient not in database yet. Treat as neutral; verify portion size and processing level.",
            "alternatives": [],
            "conditions": conditions,
            "phase": phase,
        })

    verdict = item["base"]
    score = int(item["score"])

    # Condition-based strictness (tiny logic)
    cond_lower = [c.lower() for c in conditions]
    if "diabetes" in cond_lower and "diabetes" in item.get("tags", []):
        score = max(5, score - 10)
        if verdict == "safe":
            verdict = "caution"
    if ("pcos" in cond_lower or "pcod" in cond_lower) and ("pcos" in item.get("tags", []) or "pcod" in item.get("tags", [])):
        # if beneficial, slightly boost
        if verdict == "beneficial":
            score = min(98, score + 4)

    return jsonify({
        "ingredient": ingredient,
        "verdict": verdict,                 # safe | caution | harmful | beneficial | unknown
        "score": score,                     # 0-100
        "explanation": item["reason"],
        "alternatives": item["alternatives"],
        "conditions": conditions,
        "phase": phase,
    })
