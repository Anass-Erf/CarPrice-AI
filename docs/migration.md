# Repository audit and migration

## Plan (recorded before implementation)

1. Capture original Streamlit preprocessing and predictions; keep the trained artifact unchanged.
2. Move inference to a startup-loaded FastAPI service with typed validation and a model-derived catalog.
3. Build a local Next.js/TypeScript/Tailwind client with loading, error, and result states.
4. Separate reproducible fitting/evaluation from inference. Preserve research and all distinct data.
5. Remove proven duplicates, retired entry points, caches, and checkpoints; verify API/browser parity.

## Original inventory and decisions

| Original path | Role and decision |
| --- | --- |
| `app/api.py` | Older FastAPI endpoint with relative model path and unvalidated categories; replace with `backend/app`. |
| `streamlit_app/streamlit_app.py` | Standalone UI directly loading pipeline; replace with Next.js after baseline capture. |
| Three `custom_transformers.py` files | SHA-256-identical binary mapper/frequency encoder; merge into backend module, preserving pickle compatibility. |
| Two `best_xgb_model.joblib` files | SHA-256-identical; retain one in `backend/models`. Original SHA-256: `81d1cef2cf0b08f7b46feacc7b364376a571e1df6c35bb04c00ab869a484b297`. |
| `models/testing.py` | Manual prediction script with incorrect euro label; superseded by regression tests. |
| `models/Pipeline .ipynb` | Actual fitted pipeline recipe; move to `notebooks/pipeline.ipynb`; executable training entry point added. |
| `notebooks/CLEANING_v99.ipynb` | Raw listing cleaning, imputation, outlier filtering, feature exploration; preserve as `cleaning.ipynb`. |
| `notebooks/kagle_Traning_v100.ipynb` | Separate model comparison/grid search on globally encoded data; preserve as `model_experiments.ipynb`. Metrics do not describe deployed pipeline. |
| `data/fusion_2.csv` | 65,790 raw Moroccan listings; move to `data/raw`. |
| `data/cars_preprocessed.csv` | 53,391 cleaned rows with raw feature names; move to `data/processed`; required for fitting/catalog generation. |
| `data/cars_processed_2025‑05‑03_v3.csv` | 53,391 encoded rows for historical experiments; preserve with ASCII filename. |
| `models/preprocessed/cars_preprocessed.csv` | Byte-identical dataset duplicate; delete. |
| Preprocessed CSV checkpoint | Distinct earlier snapshot (59,547 rows, missing model year); preserve explicitly as `data/processed/legacy_snapshot.csv`, never use for current training. |
| `Data-extractor/*.ipynb` | Historical Avito, Moteur, Wandaloo and Selenium collection experiments; retain distinct sources in `notebooks/research`, clear bulky scraping outputs. Resumed Avito variants consolidated only after source comparison. |
| Other `.ipynb_checkpoints`, `__pycache__`, `.pyc` | Generated backups/caches, no runtime imports; delete and ignore. |
| Root requirements | Replace with canonical backend requirements and optional development/research dependencies. |
| `.gitignore` | Contained literal `\\n` instead of separate patterns; replace with actual lines. |

## Model contract

`Pipeline(prep=ColumnTransformer, model=XGBRegressor)` with 400 trees, depth 6,
learning rate 0.05, subsample/column sample 0.8, alpha 0.5, lambda 2, seed 42.
Eleven input fields become eleven predictors after replacing `Model_Year` with
`Car_Age = 2025 - Model_Year`. Standard scaling covers mileage, fiscal CV and age;
binary mapping covers first ownership/transmission; condition is ordinal; fuel/origin
are one-hot encoded; brand/model use fitted frequencies; door count passes through.
The encoded matrix has 18 columns. Price is directly in MAD, with no log inverse.

The original Streamlit label incorrectly described fiscal CV as horsepower.
The new UI uses fiscal CV. Year stays capped at 2025 because the artifact is historical.
Unknown categories and unseen brand/model combinations are rejected before inference.

The pipeline notebook fits on the entire cleaned dataset. Its scaler records 53,391
samples. Historical grid-search metrics belong to a different estimator (depth 8,
alpha 0, lambda 1) and globally preprocessed features. They are not deployed scores.
A new evaluation command splits before fitting the pipeline, but the supplied cleaned
snapshot already includes historical imputation/outlier decisions, so it is not a fully
independent raw-data evaluation.

## Outcome

The old `app/`, `streamlit_app/`, `models/`, and `Data-extractor/` directories are
retired after moving their useful contents. Four resumed Avito copies were proven
to differ only in page bounds/log whitespace and consolidated. Eight distinct
collection notebooks remain, with bulky output cleared. All four distinct CSV
snapshots remain; no unexplained dataset was deleted.

The model artifact's SHA-256 remains unchanged. Nine predictions were captured
before migration, including the Streamlit string door-count preprocessing, and the
new API matches their rounded outputs exactly. The required artifact is tracked,
not hidden behind a blanket `*.joblib` ignore rule.

The Next.js client reads `/metadata` for supported choices, submits to `/predict`,
and stores a copy of submitted values with each result. API model startup fails
clearly when the artifact is absent/incompatible. Python requirements pin the
verified runtime. Training clones an unfitted copy of the original recipe and
writes to a separate, ignored run directory.

No deployment was performed and no Git commit/push was created. The original model
has a legacy XGBoost serialization warning; prediction parity is verified. A newer
raw-data evaluation and native XGBoost export remain future work.

## Validation results

- 42 backend tests passed: nine original prediction baselines, invalid/missing inputs,
  category combinations, CORS, startup-path loading, artifact hash and inference errors.
- 15 Playwright tests passed across desktop Chromium, iPhone-sized Chromium and
  iPad-sized Chromium: real API predictions, numeric constraints, loading/disabled
  submission, API/catalog outages and retries, and no horizontal overflow.
- Next.js production build, TypeScript type generation/checking, Ruff lint/format,
  dependency consistency and Git whitespace checks passed.
- `training/train.py` completed an 80/20 evaluation on the supplied cleaned snapshot;
  results, dataset hash and runtime versions are recorded in `docs/evaluation.json`.
- Desktop landing/result and mobile screenshots were captured from the running app.

Next.js uses its supported Webpack mode here because Turbopack's PostCSS worker
could not bind a local port in the development sandbox. Browser checks use isolated
ports 13000/18000 so existing local services are not interrupted. The framework's
standard generated `AGENTS.md` is retained; generated `next-env.d.ts` is ignored and
regenerated by the typecheck script.
