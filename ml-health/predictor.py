import joblib
import numpy as np
import pandas as pd


# paths
DIABETES_MODEL_PATH = "ml-health/diabetes_model.pkl"
PCOS_MODEL_PATH = "ml-health/pcos_model.pkl"
INGREDIENT_PATH = "ml-health/data/health_ingredients.csv"


# load models
diabetes_model = joblib.load(DIABETES_MODEL_PATH)
pcos_model = joblib.load(PCOS_MODEL_PATH)


# load ingredient database
ingredient_db = pd.read_csv(INGREDIENT_PATH)


# ----------------------------
# ML prediction functions
# ----------------------------

def predict_diabetes_risk(features):

    features = np.array(features).reshape(1, -1)

    prob = diabetes_model.predict_proba(features)[0][1]

    return prob


def predict_pcos_risk(features):

    features = np.array(features).reshape(1, -1)

    prob = pcos_model.predict_proba(features)[0][1]

    return prob


# ----------------------------
# Ingredient Risk Engine
# ----------------------------

def ingredient_risk_score(ingredient):

    match = ingredient_db[
        ingredient_db["ingredient"].str.lower() == ingredient.lower()
    ]

    if match.empty:
        return 10   # unknown ingredient default risk

    diabetes_risk = match.iloc[0]["diabetes_risk"]
    pcos_risk = match.iloc[0]["pcos_risk"]

    score = (diabetes_risk * 50) + (pcos_risk * 50)

    return score


def risk_level(score):

    if score < 20:
        return "SAFE"

    elif score < 50:
        return "MODERATE"

    elif score < 80:
        return "HIGH"

    else:
        return "CRITICAL"


# ----------------------------
# Full Food Analysis Engine
# ----------------------------

def analyze_food(ingredients):

    harmful = []
    safe = []
    alternatives = {}

    total_score = 0

    for ingredient in ingredients:

        score = ingredient_risk_score(ingredient)

        total_score += score

        if score >= 50:
            harmful.append(ingredient)

            match = ingredient_db[
                ingredient_db["ingredient"].str.lower() == ingredient.lower()
            ]

            if not match.empty:
                alternatives[ingredient] = match.iloc[0]["alternative"]

        else:
            safe.append(ingredient)

    avg_score = total_score / len(ingredients)

    return {

        "risk_score": round(avg_score, 2),

        "risk_level": risk_level(avg_score),

        "harmful": harmful,

        "safe": safe,

        "alternatives": alternatives
    }


# ----------------------------
# test
# ----------------------------

if __name__ == "__main__":

    food = ["sugar", "milk", "banana", "butter"]

    result = analyze_food(food)

    print("\nFOOD ANALYSIS RESULT:")
    print(result)
