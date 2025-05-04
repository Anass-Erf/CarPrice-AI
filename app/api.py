# app/api.py

from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import sys
import os
# Add parent directory to path to import custom_transformers
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from custom_transformers import binary_map, FrequencyEncoder

# Load the model
model = joblib.load(os.path.join("..", "models", "best_xgb_model.joblib"))

app = FastAPI(title="Car Price Prediction API")

class CarFeatures(BaseModel):
    Kilométrage: int
    Puissance: int
    Model_Year: int
    Nb_portes: int
    Première_main: str
    Transmission: str
    État: str
    Carburant: str
    Origine: str
    Marque: str
    Model: str

@app.post("/predict")
def predict_price(data: CarFeatures):
    df = pd.DataFrame([data.dict()])
    df["Car_Age"] = 2025 - df["Model_Year"]
    df.drop(columns=["Model_Year"], inplace=True)

    prediction = model.predict(df)[0]
    return {"prix_estimé (MAD)": round(prediction, 2)}

# uvicorn api:app --reload
