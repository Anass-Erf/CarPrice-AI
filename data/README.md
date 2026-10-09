# Dataset provenance

All CSVs are preserved from the original repository; no new scraping was performed.
They describe Moroccan vehicle listings and asking prices in Moroccan dirhams (MAD).
The collection notebooks include Avito, Moteur and Wandaloo experiments; the precise
row-level source mix and collection dates of the merged snapshot were not recorded.

| File | Rows | Purpose |
| --- | ---: | --- |
| `raw/fusion_2.csv` | 65,790 | Original merged listing snapshot, before cleaning |
| `processed/cars_preprocessed.csv` | 53,391 | Cleaned, human-readable features used by the deployed pipeline |
| `processed/cars_encoded.csv` | 53,391 | Globally encoded/scaled snapshot used in historical model comparisons |
| `processed/legacy_snapshot.csv` | 59,547 | Earlier distinct checkpoint, lacking model year; kept for provenance only |

`Puissance` originates as values such as `6 CV`: fiscal power, not engine horsepower.
Door counts were normalized from 3/5 to 2/4 during cleaning. Mileage intervals became
midpoints; text was normalized, missing values imputed, duplicates removed, and
price/mileage/year outliers filtered. See `notebooks/cleaning.ipynb` for the full logic.

The historical imputation and filtering were performed before an evaluation split;
some imputation uses price. Treat evaluations on this snapshot accordingly. No data
license or redistribution grant was recorded by the original project. The code
license does not extend to third-party listings or the derived model artifacts.
