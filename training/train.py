"""Fit a fresh copy of the original pipeline; never overwrite the shipped model."""

import argparse
import hashlib
import json
import platform
from importlib.metadata import version
from pathlib import Path

import joblib
import pandas as pd
from sklearn.base import clone
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from backend.app.config import MODEL_PATH
from backend.app.prediction import load_pipeline
from backend.app.preprocessing import prepare_features

ROOT = Path(__file__).resolve().parents[1]


def train(data_path: Path, output_dir: Path, fit_all: bool = False) -> dict:
    data = pd.read_csv(data_path).drop_duplicates().dropna()
    if data.empty:
        raise ValueError("No complete training rows found.")
    # Clone discards fitted statistics and trees while retaining the original recipe.
    pipeline = clone(load_pipeline())
    features = prepare_features(data.drop(columns="Price"))
    target = data["Price"]
    if fit_all:
        train_x, train_y = features, target
    else:
        train_x, test_x, train_y, test_y = train_test_split(
            features, target, test_size=0.2, random_state=42
        )
    pipeline.fit(train_x, train_y)
    report = {
        "dataset_sha256": hashlib.sha256(data_path.read_bytes()).hexdigest(),
        "rows": len(data),
        "train_rows": len(train_x),
        "seed": 42,
        "runtime": {
            "python": platform.python_version(),
            **{
                name: version(name)
                for name in ["scikit-learn", "xgboost", "pandas", "numpy"]
            },
        },
        "evaluation": "none (full-data fit)"
        if fit_all
        else "80/20 split of historically cleaned snapshot",
        "caveat": "Historical cleaning/imputation happened before this split. Evaluate from raw data before claiming independent generalization.",
    }
    if not fit_all:
        predictions = pipeline.predict(test_x)
        report.update(
            test_rows=len(test_x),
            mae=float(mean_absolute_error(test_y, predictions)),
            rmse=float(mean_squared_error(test_y, predictions) ** 0.5),
            r2=float(r2_score(test_y, predictions)),
        )
    output_dir.mkdir(parents=True, exist_ok=False)
    joblib.dump(pipeline, output_dir / "pipeline.joblib", compress=3)
    (output_dir / "metrics.json").write_text(json.dumps(report, indent=2) + "\n")
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--data", type=Path, default=ROOT / "data/processed/cars_preprocessed.csv"
    )
    parser.add_argument(
        "--output", type=Path, default=ROOT / "training/runs/evaluation"
    )
    parser.add_argument(
        "--fit-all",
        action="store_true",
        help="Follow the original full-data fitting recipe; no test metrics.",
    )
    args = parser.parse_args()
    if args.output.resolve() == MODEL_PATH.parent.resolve():
        parser.error(
            "Use a separate run directory, not the deployed artifact directory."
        )
    if args.output.exists():
        parser.error("Output already exists; choose a new run directory.")
    print(json.dumps(train(args.data, args.output, args.fit_all), indent=2))
