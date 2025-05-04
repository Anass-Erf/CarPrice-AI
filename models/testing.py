# testin.py
from custom_transformers import binary_map, FrequencyEncoder
import joblib
import pandas as pd

def main():
    model = joblib.load("best_xgb_model.joblib")
    # build df and call model.predict(df)

    
    # 2. Example input (change values as desired)
    input_data = {
        "Kilométrage":    [50000],
        "Puissance":      [100],
        "Model_Year":     [2018],
        "Nb_portes":      [4],
        "Première_main":  ["oui"],
        "Transmission":   ["manuelle"],
        "État":           ["bon"],
        "Carburant":      ["essence"],
        "Origine":        ["ww au maroc"],
        "Marque":         ["renault"],
        "Model":          ["clio"]
    }
    df = pd.DataFrame(input_data)

    # 3. Compute Car_Age and drop Model_Year
    df["Car_Age"] = 2025 - df["Model_Year"]
    df.drop(columns=["Model_Year"], inplace=True)

    # 4. Predict
    pred = model.predict(df)[0]
    print(f"🔮 Prix estimé : €{pred:.2f}")

if __name__ == "__main__":
    main()
