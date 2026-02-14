# ml-health/train.py

import joblib

from model import create_diabetes_model, create_pcos_model
from utils import load_diabetes_data, load_pcos_data


DIABETES_MODEL_PATH = "ml-health/diabetes_model.pkl"
PCOS_MODEL_PATH = "ml-health/pcos_model.pkl"


def train_diabetes():

    print("\nTraining Diabetes Model (XGBoost)...")

    X_train, X_test, y_train, y_test = load_diabetes_data()

    model = create_diabetes_model()

    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)

    print("Diabetes Accuracy:", accuracy)

    joblib.dump(model, DIABETES_MODEL_PATH)

    print("Saved:", DIABETES_MODEL_PATH)


def train_pcos():

    print("\nTraining PCOS Model (Advanced RandomForest)...")

    X_train, X_test, y_train, y_test = load_pcos_data()

    model = create_pcos_model()

    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)

    print("PCOS Accuracy:", accuracy)

    joblib.dump(model, PCOS_MODEL_PATH)

    print("Saved:", PCOS_MODEL_PATH)


if __name__ == "__main__":

    print("\nSTARTING ADVANCED TRAINING...")

    train_diabetes()

    train_pcos()

    print("\nADVANCED TRAINING COMPLETED SUCCESSFULLY")
