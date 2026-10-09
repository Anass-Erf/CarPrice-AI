import hashlib
import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from backend.app.config import MODEL_PATH
from backend.app.main import app
from backend.app.prediction import load_pipeline

BASELINES = json.loads(Path(__file__).with_name("baseline.json").read_text())


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.mark.parametrize("baseline", BASELINES)
def test_matches_original_streamlit(client, baseline):
    response = client.post("/predict", json=baseline["input"])
    assert response.status_code == 200, response.text
    assert response.json() == {
        "predicted_price": round(baseline["predicted_price"], 2),
        "currency": "MAD",
    }


@pytest.mark.parametrize(
    "field,value",
    [
        ("Kilométrage", -1),
        ("Kilométrage", 500001),
        ("Kilométrage", "NaN"),
        ("Puissance", 100),
        ("Puissance", 0),
        ("Model_Year", 2026),
        ("Model_Year", 1990),
        ("Model_Year", 2018.5),
        ("Nb_portes", 5),
        ("Transmission", "unknown"),
        ("État", "perfect"),
        ("Carburant", "water"),
        ("Origine", "unknown"),
        ("Première_main", "maybe"),
        ("Marque", "unknown"),
        ("Model", "unknown"),
        ("Model", "duster"),
        ("unexpected", 123),
    ],
)
def test_invalid_values(client, field, value):
    response = client.post("/predict", json={**BASELINES[0]["input"], field: value})
    assert response.status_code == 422


@pytest.mark.parametrize("field", BASELINES[0]["input"])
def test_missing_fields(client, field):
    payload = dict(BASELINES[0]["input"])
    del payload[field]
    assert client.post("/predict", json=payload).status_code == 422


def test_health_metadata_and_cors(client):
    assert client.get("/health").json() == {"status": "ok"}
    metadata = client.get("/metadata").json()
    assert metadata["reference_year"] == 2025
    assert len(metadata["brands"]) == 71
    assert "clio" in metadata["brands"]["renault"]
    response = client.options(
        "/predict",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert (
        "access-control-allow-origin"
        not in client.get(
            "/health", headers={"Origin": "https://untrusted.example"}
        ).headers
    )


def test_artifact_unchanged_and_missing_file_error(tmp_path, monkeypatch):
    assert (
        hashlib.sha256(MODEL_PATH.read_bytes()).hexdigest()
        == "81d1cef2cf0b08f7b46feacc7b364376a571e1df6c35bb04c00ab869a484b297"
    )
    monkeypatch.chdir(tmp_path)
    assert load_pipeline().named_steps["model"].n_estimators == 400
    with pytest.raises(RuntimeError, match="artifact missing"):
        load_pipeline(tmp_path / "missing.joblib")


def test_inference_failure_is_readable(client, monkeypatch):
    def fail(_):
        raise RuntimeError("internal sensitive detail")

    monkeypatch.setattr(app.state.predictor, "predict", fail)
    response = client.post("/predict", json=BASELINES[0]["input"])
    assert response.status_code == 503
    assert "internal sensitive" not in response.text


def test_pipeline_is_reused(client):
    pipeline = app.state.predictor.pipeline
    for _ in range(2):
        assert client.post("/predict", json=BASELINES[0]["input"]).status_code == 200
        assert app.state.predictor.pipeline is pipeline
