"""Runtime paths are independent of the directory used to launch Uvicorn."""

import os
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
MODEL_PATH = Path(os.environ.get("MODEL_PATH", MODEL_DIR / "best_xgb_model.joblib"))
CATALOG_PATH = MODEL_DIR / "catalog.json"
REFERENCE_YEAR = 2025
CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")
    if origin.strip()
]
