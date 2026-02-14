from flask import Blueprint, request, jsonify
from gt_app.services.ml_service import predict_health_risk

bp = Blueprint("ml", __name__, url_prefix="/api/ml")

@bp.post("/predict")
def ml_predict():
    data = request.get_json()

    ingredient = data.get("ingredient", "")
    conditions = data.get("conditions", [])

    if not ingredient:
        return jsonify({"error": "Ingredient required"}), 400

    result = predict_health_risk(ingredient, conditions)

    return jsonify(result)
