# ml-health/model.py

from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier


def create_diabetes_model():
    """
    Powerful model for diabetes prediction using XGBoost
    """

    model = XGBClassifier(
        n_estimators=500,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )

    return model


def create_pcos_model():
    """
    Powerful model for PCOS prediction using optimized RandomForest
    """

    model = RandomForestClassifier(
        n_estimators=600,
        max_depth=12,
        min_samples_split=3,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )

    return model
