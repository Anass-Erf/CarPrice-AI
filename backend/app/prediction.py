"""Load the original trusted pipeline and expose its supported input catalog."""

import json
import math
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.pipeline import Pipeline

from . import preprocessing
from .config import CATALOG_PATH, MODEL_PATH
from .schemas import CarFeatures


def load_pipeline(path: Path = MODEL_PATH) -> Pipeline:
    # The legacy pickle refers to this top-level module. Keep the artifact unchanged.
    sys.modules.setdefault("custom_transformers", preprocessing)
    if not path.is_file():
        raise RuntimeError(
            "Model artifact missing. Restore backend/models/best_xgb_model.joblib."
        )
    try:
        return joblib.load(path)
    except Exception as exc:
        raise RuntimeError(
            "Model could not load. Install the pinned backend requirements."
        ) from exc


class Predictor:
    def __init__(
        self, model_path: Path = MODEL_PATH, catalog_path: Path = CATALOG_PATH
    ):
        self.pipeline = load_pipeline(model_path)
        self.catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
        prep = self.pipeline.named_steps["prep"]
        frequencies = prep.named_transformers_["freq"].freq_maps
        # Detect an accidentally paired catalog/artifact before accepting requests.
        for brand, models in self.catalog["brands"].items():
            if brand not in frequencies["Marque"] or any(
                model not in frequencies["Model"] for model in models
            ):
                raise RuntimeError("Catalog and model artifact do not match.")

    def predict(self, data: CarFeatures) -> float:
        if data.Model not in self.catalog["brands"].get(data.Marque, []):
            raise ValueError("Choose a supported model for the selected brand.")
        frame = preprocessing.prepare_features(pd.DataFrame([data.model_dump()]))
        value = float(self.pipeline.predict(frame)[0])
        if not math.isfinite(value) or value < 0:
            raise RuntimeError("Model returned an invalid estimate.")
        return round(value, 2)
