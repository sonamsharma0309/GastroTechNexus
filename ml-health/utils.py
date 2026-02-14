import pandas as pd
from sklearn.model_selection import train_test_split


DIABETES_PATH = "ml-health/data/diabetes.csv"
PCOS_PATH = "ml-health/data/pcos.csv"


def load_diabetes_data():

    df = pd.read_csv(DIABETES_PATH)

    print("Diabetes dataset loaded:", df.shape)

    X = df.drop("Outcome", axis=1)
    y = df["Outcome"]

    return train_test_split(X, y, test_size=0.2, random_state=42)


def load_pcos_data():

    df = pd.read_csv(PCOS_PATH)

    print("PCOS dataset loaded:", df.shape)

    df.columns = df.columns.str.strip()

    # find target column
    target = None
    for col in df.columns:
        if "PCOS" in col:
            target = col
            break

    if target is None:
        raise Exception("PCOS column not found")

    # CLEAN EACH COLUMN PROPERLY
    for col in df.columns:

        # remove dots like "1.99."
        df[col] = df[col].astype(str).str.replace('.', '', regex=False)

        # convert to numeric
        df[col] = pd.to_numeric(df[col], errors='coerce')

    # fill missing values instead of dropping all rows
    df = df.fillna(df.median())

    print("After cleaning:", df.shape)

    X = df.drop(target, axis=1)
    y = df[target]

    return train_test_split(X, y, test_size=0.2, random_state=42)
