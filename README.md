1. Clone the repository
git clone https://github.com/your-username/car_price_prediction.git
cd car_price_prediction

2. Install dependencies
It's recommended to use a virtual environment.

pip install -r requirements.txt

3. Train or load your model
If not already trained, run the preprocessing and training notebooks in notebooks/preprocessing.ipynb and notebooks/training.ipynb.
Ensure that the trained model is saved as:

models/best_xgb_model.joblib

Note: Custom transformers like binary_map and FrequencyEncoder must be defined in app/custom_transformers.py and properly imported before saving the pipeline.


4. Start the FastAPI backend
Navigate to the app/ directory and run:

uvicorn api:app --reload

This starts the API at:
http://127.0.0.1:8000
Docs available at:
http://127.0.0.1:8000/docs

5. Launch the Streamlit frontend
In a separate terminal, from the project root, run:

streamlit run streamlit_app/app.py

A browser window will open. Enter the vehicle details and click "🔍 Estimer le prix" to get a real-time price prediction.

6. (Optional) Test the API manually with curl

curl -X POST http://127.0.0.1:8000/predict \
-H "Content-Type: application/json" \
-d '{
  "Kilométrage": 50000,
  "Puissance": 100,
  "Model_Year": 2018,
  "Nb_portes": 4,
  "Première_main": "oui",
  "Transmission": "manuelle",
  "État": "bon",
  "Carburant": "essence",
  "Origine": "ww au maroc",
  "Marque": "renault",
  "Model": "clio"
}'
