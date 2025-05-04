# streamlit_app.py

import streamlit as st
import pandas as pd
import joblib
from custom_transformers import binary_map, FrequencyEncoder

# 🚀 Load the saved pipeline model (includes preprocessing)
model = joblib.load("best_xgb_model.joblib")

# ✅ Marque → Model mapping (extendable)
marque_model_map = {
    "renault": ["clio", "megane", "zoe", "captur", "kangoo", "scenic", "talisman"],
    "land rover": ["range rover sport", "range rover evoque", "range rover velar"],
    "dacia": ["duster", "sandero", "dokker", "logan"],
    "mercedes-benz": ["classe c", "classe e", "classe s", "classe a", "classe glc", "classe gla", "classe gls", "classe gl"],
    "citroen": ["c4", "c3", "c5"],
    "ds": ["ds4", "ds5"],
    "bmw": ["série 1", "série 3", "série 5", "série 2"],
    "seat": ["ibiza", "leon"],
    "ford": ["fiesta", "focus", "ecosport", "mustang"],
    "fiat": ["500", "punto", "panda"],
    "hyundai": ["tucson", "i10", "i20", "i30", "ix35", "santa fe"],
    "nissan": ["qashqai", "micra", "juke", "x-trail"],
    "opel": ["astra", "corsa", "insignia"],
    "peugeot": ["208", "308", "3008", "508", "406", "207", "307", "206"],
    "mini": ["countryman", "cooper"],
    "volkswagen": ["golf 4", "golf 5", "golf 6", "golf 7", "passat", "tiguan", "polo"],
    "toyota": ["yaris", "corolla", "c-hr", "rav 4", "auris"],
    "skoda": ["octavia", "superb", "kamiq"],
    "jeep": ["cherokee", "renegade", "compass", "grand cherokee"],
    "volvo": ["v40", "xc40", "xc60", "xc90"],
    "audi": ["a1", "a3", "a4", "a5", "a6", "a7", "a8", "q3", "q5", "q7", "q8"],
    "porsche": ["panamera", "cayenne", "macan"],
    "tesla": ["model 3", "model s", "model y"],
    "honda": ["cr-v", "civic", "accord"],
    "ssangyong": ["stavic", "korando"],
    "alfa romeo": ["159", "giulia", "giulietta"],
    "chevrolet": ["cruze", "aveo", "captiva"],
    "mazda": ["mazda 2", "mazda 3", "mazda 6"],
    "suzuki": ["swift", "vitara", "jimny"],
    "seres": ["seres 3", "seres 5"],
    "jaguar": ["xf", "xj", "f-type"],
    "maserati": ["ghibli", "levante"],
    "mg": ["mg hs", "mg3", "zs", "zs-ev"],
    "isuzu": ["d-max"],
    "dfsk": ["glory 580", "glory ix5"],
    "bentley": ["continental gt", "bentayga"]
}

# ==============================
# 🎨 UI - Page Layout
# ==============================

st.title("💡 Estimation du prix de voiture d'occasion")
st.write("👈 Remplissez les informations dans la barre latérale pour estimer le prix de votre voiture.")

# ==============================
# 📋 Sidebar - User Inputs
# ==============================

st.sidebar.header("Caractéristiques du véhicule")

kilométrage   = st.sidebar.number_input("Kilométrage", min_value=0, value=50000)
puissance     = st.sidebar.number_input("Puissance (ch)", min_value=0, value=45)
model_year    = st.sidebar.number_input("Année du modèle", min_value=1900, max_value=2025, value=2018)
nb_portes     = st.sidebar.selectbox("Nombre de portes", ["4", "2"])
premiere_main = st.sidebar.selectbox("Première main", ["oui", "non"])
transmission  = st.sidebar.selectbox("Transmission", ["automatique", "manuelle"])
etat          = st.sidebar.selectbox("État", ["mauvais", "correct", "bon", "très bon", "excellent", "neuf"])
carburant     = st.sidebar.selectbox("Carburant", ["essence", "diesel", "hybride", "electrique", "lpg"])
origine       = st.sidebar.selectbox("Origine", ["ww au maroc", "pas encore dédouanée", "importée neuve"])

# ✅ Dynamic marque → model dropdown
available_marques = sorted(marque_model_map.keys())
marque = st.sidebar.selectbox("Marque", available_marques)
model_name = st.sidebar.selectbox("Modèle", sorted(marque_model_map.get(marque, [])))

# ==============================
# 🎯 Prediction
# ==============================

if st.sidebar.button("Estimer le prix"):

    # 1. Assemble input into DataFrame
    df = pd.DataFrame([{
        "Kilométrage": kilométrage,
        "Puissance": puissance,
        "Model_Year": model_year,
        "Nb_portes": nb_portes,
        "Première_main": premiere_main,
        "Transmission": transmission,
        "État": etat,
        "Carburant": carburant,
        "Origine": origine,
        "Marque": marque,
        "Model": model_name
    }])

    # 2. Feature engineering
    df["Car_Age"] = 2025 - df["Model_Year"]
    df.drop(columns=["Model_Year"], inplace=True)

    # 3. Show input data
    st.subheader("📄 Données saisies")
    st.write(df)

    # 4. Make prediction with error handling
    try:
        price = model.predict(df)[0]
        st.success(f"🔮 Prix estimé : **MAD-{price:,.2f}**")
    except Exception as e:
        st.error(f"❌ Une erreur s'est produite pendant la prédiction :\n\n{e}")
