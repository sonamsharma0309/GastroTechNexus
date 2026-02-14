import csv
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "health_ingredients.csv")


def load_health_data():

    data = {}

    with open(DATA_PATH, mode='r') as file:

        reader = csv.DictReader(file)

        for row in reader:

            ingredient = row["ingredient"].lower()

            data[ingredient] = row

    return data


health_data = load_health_data()


def analyze_ingredients(ingredients, condition):

    condition = condition.lower()

    harmful = []
    safe = []
    alternatives = {}

    for ingredient in ingredients:

        ing = ingredient.lower()

        if ing in health_data:

            status = health_data[ing][condition]

            if status in ["harmful", "avoid"]:

                harmful.append(ing)

                alternatives[ing] = health_data[ing]["alternative"]

            else:

                safe.append(ing)

        else:

            safe.append(ing)

    return {
        "harmful": harmful,
        "safe": safe,
        "alternatives": alternatives
    }


# test run
if __name__ == "__main__":

    result = analyze_ingredients(
        ["milk", "sugar", "banana"],
        "diabetes"
    )

    print(result)
