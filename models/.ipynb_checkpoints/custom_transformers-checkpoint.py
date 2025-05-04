# custom_transformers.py

from sklearn.base import BaseEstimator, TransformerMixin

def binary_map(X):
    return X.replace({
        'oui': 1, 'non': 0,
        'Oui': 1, 'Non': 0,
        'automatique': 1, 'manuelle': 0,
        'Automatique': 1, 'Manuelle': 0
    })

class FrequencyEncoder(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.freq_maps = {}

    def fit(self, X, y=None):
        for col in X.columns:
            self.freq_maps[col] = X[col].value_counts(normalize=True).to_dict()
        return self

    def transform(self, X):
        X_encoded = X.copy()
        for col in X.columns:
            X_encoded[col] = X[col].map(self.freq_maps[col])
        return X_encoded
