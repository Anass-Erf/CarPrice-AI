# Research notebooks

Run Jupyter from the repository root using the research dependencies below. The
three top-level notebooks discover the repository root and use portable paths.
They preserve the original approach; `python -m training.train` is the maintained
fitting/evaluation entry point.

- `cleaning.ipynb`: raw listing cleaning, imputation, outlier filtering and EDA.
  New exports go under `training/runs/cleaning`; supplied datasets are not replaced.
- `pipeline.ipynb`: original full-data pipeline recipe; generates a separate artifact.
- `model_experiments.ipynb`: historical comparison on already encoded data, with
  metric provenance explained in its opening cell.
- `research/`: eight distinct collection experiments preserved as historical source,
  not required to launch the app. Scrapers depend on third-party page structures and
  have not been rerun. Large output logs are removed. The four `AVITO-Copy*` versions
  differed only in page intervals (2310–2350, 2368–2400, 2419–2450, 2469–2500) and a
  logging space; their common implementation remains in `research/AVITO.ipynb`.

```bash
python -m pip install -r notebooks/requirements.txt
jupyter lab
```

The research dependency set is optional; browser drivers are only relevant when
intentionally revisiting the historical collection notebooks.
