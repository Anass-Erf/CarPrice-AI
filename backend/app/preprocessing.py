"""Original fitted-transformer behavior shared by inference and training."""

import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

from .config import REFERENCE_YEAR


def binary_map(X: pd.DataFrame) -> pd.DataFrame:
    return X.replace(
        {
            "oui": 1,
            "non": 0,
            "Oui": 1,
            "Non": 0,
            "automatique": 1,
            "manuelle": 0,
            "Automatique": 1,
            "Manuelle": 0,
        }
    )


class FrequencyEncoder(BaseEstimator, TransformerMixin):
    def __init__(self) -> None:
        self.freq_maps = {}

    def fit(self, X: pd.DataFrame, y=None) -> "FrequencyEncoder":
        for col in X.columns:
            self.freq_maps[col] = X[col].value_counts(normalize=True).to_dict()
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_encoded = X.copy()
        for col in X.columns:
            X_encoded[col] = X[col].map(self.freq_maps[col])
        return X_encoded


def prepare_features(frame: pd.DataFrame) -> pd.DataFrame:
    """Keep the original model's reference year, even as the calendar advances."""
    result = frame.copy()
    result["Car_Age"] = REFERENCE_YEAR - result["Model_Year"]
    return result.drop(columns=["Model_Year"])
