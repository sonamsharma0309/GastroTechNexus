from flask import current_app
from ..utils.http import get_json


def fetch_recipe_of_day():
    base = current_app.config["RECIPEDB_BASE_URL"]
    token = current_app.config["RECIPEDB_TOKEN"]

    url = f"{base}/recipe/recipeofday"
    headers = {"Authorization": f"Bearer {token}"}

    return get_json(url, headers=headers)
