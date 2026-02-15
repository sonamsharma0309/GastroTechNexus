from gt_app.utils.http import get_json

def fetch_recipe_of_day():
    url = "http://cosylab.iiitd.edu.in:6969/recipe2-api/recipe/recipeofday"
    try:
        return get_json(url, timeout=20)
    except Exception:
        return {
            "Recipe_title": "RecipeDB temporarily unavailable",
            "message": "Upstream RecipeDB timed out. Showing fallback.",
            "img_url": "https://geniuskitchen.sndimg.com/gk/img/gk-shareGraphic.png"
        }
