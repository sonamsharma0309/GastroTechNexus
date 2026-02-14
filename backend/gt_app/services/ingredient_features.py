import os
import re
import requests
from dotenv import load_dotenv

# .env backend/run.py se load hota hai, but safe side:
load_dotenv()


def _norm(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip()).lower()


def _flavordb_headers():
    token = os.getenv("FLAVORDB_TOKEN", "")
    return {"Authorization": f"Bearer {token}"} if token else {}


def _recipedb_headers():
    # Postman me RecipeDB Bearer token use ho raha hai.
    # Kuch endpoints ApiKey bhi maang sakte hain, so dono bhej dete hain.
    token = os.getenv("RECIPEDB_TOKEN", "")
    h = {}
    if token:
        h["Authorization"] = f"Bearer {token}"
        h["ApiKey"] = token
    return h


def _flavordb_entity_by_alias(ingredient: str):
    base = (os.getenv("FLAVORDB_BASE_URL") or "").rstrip("/")
    if not base:
        return None

    url = f"{base}/entities/by-entity-alias-readable"
    try:
        r = requests.get(
            url,
            params={"entity_alias_readable": ingredient, "page": 0, "size": 5},
            headers=_flavordb_headers(),
            timeout=15,
        )
        if r.status_code != 200:
            return None

        data = r.json()
        content = data.get("content") or []
        # best match: exact readable name first
        ing_l = ingredient.lower()
        best = None
        for item in content:
            if (item.get("entity_alias_readable") or "").strip().lower() == ing_l:
                best = item
                break
        return best or (content[0] if content else None)
    except Exception:
        return None


def build_ingredient_feature_vector(ingredient: str):
    """
    Returns:
      {
        ingredient: str,
        features: { sugar, refined_carb, processed, high_fiber, high_protein } in 0..1,
        flavordb: { url, entity } ,
        recipedb: { url }  (optional/placeholder)
      }
    """
    raw = ingredient or ""
    ing = _norm(raw)

    # IMPORTANT: multi input like "sugar,rice" -> take first for now
    # (later we can return list analysis)
    if "," in ing:
        ing = _norm(ing.split(",")[0])

    # ---- base heuristic (works even if API down) ----
    sugar_words = {
        "sugar", "brown sugar", "white sugar", "caster sugar", "icing sugar",
        "jaggery", "gur", "molasses", "honey", "glucose syrup", "corn syrup"
    }
    refined_carb_words = {
        "white rice", "rice", "maida", "refined flour", "noodles", "pasta",
        "white bread", "bread", "biscuit", "cookies"
    }
    processed_words = {
        "chips", "soda", "soft drink", "instant noodles", "packaged",
        "processed", "fast food"
    }
    high_fiber_words = {
        "oats", "beans", "lentils", "chickpeas", "spinach", "broccoli",
        "apple", "guava", "salad"
    }
    high_protein_words = {
        "egg", "eggs", "chicken", "fish", "paneer", "tofu", "soy", "lentils"
    }

    f = {
        "sugar": 1.0 if ing in sugar_words else 0.0,
        "refined_carb": 1.0 if ing in refined_carb_words else 0.0,
        "processed": 1.0 if ing in processed_words else 0.0,
        "high_fiber": 1.0 if ing in high_fiber_words else 0.0,
        "high_protein": 1.0 if ing in high_protein_words else 0.0,
    }

    # ---- FlavorDB real signal ----
    flavordb_entity = _flavordb_entity_by_alias(ing)
    flavordb_url = None
    if os.getenv("FLAVORDB_BASE_URL"):
        flavordb_url = (
            os.getenv("FLAVORDB_BASE_URL").rstrip("/")
            + "/entities/by-entity-alias-readable"
            + f"?entity_alias_readable={ing}&page=0&size=5"
        )

    if flavordb_entity:
        cat = _norm(flavordb_entity.get("category_readable") or flavordb_entity.get("category") or "")
        name = _norm(flavordb_entity.get("entity_alias_readable") or "")

        # Additive / sweetener types => processed + sugar bump
        if "additive" in cat:
            f["processed"] = max(f["processed"], 0.7)
        if "sweet" in name or name == "sugar":
            f["sugar"] = max(f["sugar"], 1.0)

    # ---- RecipeDB (optional placeholder for now) ----
    recipedb_url = None
    if os.getenv("RECIPEDB_BASE_URL"):
        recipedb_url = os.getenv("RECIPEDB_BASE_URL").rstrip("/") + "/recipe/recipeofday"

    return {
        "ingredient": ing,
        "features": f,
        "flavordb": {"url": flavordb_url, "entity": flavordb_entity},
        "recipedb": {"url": recipedb_url},
    }
