from flask import Blueprint, jsonify
from ..services.recipe_db_service import fetch_recipe_of_day

bp = Blueprint("recipes", __name__, url_prefix="/api/recipes")

@bp.get("/recipe-of-day")
def recipe_of_day():
    data = fetch_recipe_of_day()
    return jsonify(data)
