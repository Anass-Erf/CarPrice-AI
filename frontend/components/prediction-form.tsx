"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  getCatalog,
  predict,
  type Catalog,
  type Prediction,
  type Vehicle,
} from "@/lib/api";

const initial: Vehicle = {
  Marque: "renault",
  Model: "clio",
  Model_Year: 2018,
  Kilométrage: 50000,
  Puissance: 6,
  Nb_portes: 4,
  Première_main: "oui",
  Transmission: "manuelle",
  État: "bon",
  Carburant: "essence",
  Origine: "ww au maroc",
};
const labels: Record<keyof Vehicle, string> = {
  Marque: "Brand",
  Model: "Model",
  Model_Year: "Model year",
  Kilométrage: "Mileage (km)",
  Puissance: "Fiscal power (CV)",
  Nb_portes: "Doors",
  Première_main: "First owner",
  Transmission: "Transmission",
  État: "Condition",
  Carburant: "Fuel type",
  Origine: "Origin",
};
const translations: Record<string, string> = {
  oui: "Yes",
  non: "No",
  manuelle: "Manual",
  automatique: "Automatic",
  mauvais: "Poor",
  correct: "Fair",
  bon: "Good",
  "très bon": "Very good",
  excellent: "Excellent",
  neuf: "New",
  diesel: "Diesel",
  essence: "Petrol",
  electrique: "Electric",
  hybride: "Hybrid",
  lpg: "LPG",
  "ww au maroc": "New in Morocco",
  "importée neuve": "Imported new",
  "pas encore dédouanée": "Not customs cleared",
  dédouanée: "Customs cleared",
};
const display = (value: string | number) =>
  translations[String(value)] ||
  String(value).replace(/^./, (c) => c.toUpperCase());
function Field({
  name,
  children,
}: {
  name: keyof Vehicle;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{labels[name]}</label>
      {children}
    </div>
  );
}

export default function PredictionForm() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle>(initial);
  const [result, setResult] = useState<{
    prediction: Prediction;
    vehicle: Vehicle;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [error, setError] = useState("");
  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    setCatalogError("");
    try {
      setCatalog(await getCatalog());
    } catch (error) {
      setCatalogError(
        error instanceof Error
          ? error.message
          : "Unable to load vehicle options.",
      );
    } finally {
      setCatalogLoading(false);
    }
  }, []);
  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);
  function update(name: keyof Vehicle, value: string | number) {
    setVehicle((current) => ({
      ...current,
      [name]: value,
      ...(name === "Marque"
        ? { Model: catalog?.brands[String(value)][0] || "" }
        : {}),
    }));
    setError("");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    const submitted = { ...vehicle };
    try {
      setResult({ prediction: await predict(submitted), vehicle: submitted });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to estimate this vehicle.",
      );
    } finally {
      setLoading(false);
    }
  }
  const select = (name: keyof Vehicle, options: (string | number)[]) => (
    <Field name={name} key={name}>
      <select
        id={name}
        name={name}
        value={vehicle[name]}
        required
        onChange={(e) =>
          update(
            name,
            name === "Nb_portes" ? Number(e.target.value) : e.target.value,
          )
        }
      >
        {options.map((value) => (
          <option value={value} key={value}>
            {display(value)}
          </option>
        ))}
      </select>
    </Field>
  );
  const number = (name: keyof Vehicle) => (
    <Field name={name} key={name}>
      <input
        id={name}
        name={name}
        type="number"
        inputMode="numeric"
        required
        {...catalog?.numeric[name]}
        value={vehicle[name]}
        onChange={(e) =>
          update(name, e.target.value === "" ? "" : Number(e.target.value))
        }
      />
    </Field>
  );
  return (
    <div className="prediction-grid">
      <div className="form-card">
        <div className="card-title">
          <div>
            <h3>Vehicle details</h3>
            <p>A few details. A more informed starting point.</p>
          </div>
          <span className="small-badge">MAD market</span>
        </div>
        {catalogLoading ? (
          <div className="catalog-state" role="status">
            <span className="spinner" /> Loading supported vehicles…
          </div>
        ) : catalogError ? (
          <div className="catalog-state">
            <p role="alert">{catalogError}</p>
            <button className="button button-dark" onClick={loadCatalog}>
              Retry connection ↻
            </button>
          </div>
        ) : (
          catalog && (
            <form onSubmit={submit}>
              <fieldset disabled={loading}>
                <legend className="sr-only">Vehicle characteristics</legend>
                <div className="form-section-label">
                  01 <span>Identity</span>
                </div>
                <div className="form-fields">
                  {select("Marque", Object.keys(catalog.brands))}
                  {select("Model", catalog.brands[vehicle.Marque] || [])}
                  {number("Model_Year")}
                  {number("Kilométrage")}
                </div>
                <div className="form-section-label">
                  02 <span>Specifications & condition</span>
                </div>
                <div className="form-fields">
                  {select("Carburant", catalog.categories.Carburant)}
                  {select("Transmission", catalog.categories.Transmission)}
                  {number("Puissance")}
                  {select("Nb_portes", catalog.categories.Nb_portes)}
                  {select("État", catalog.categories.État)}
                  {select("Première_main", catalog.categories.Première_main)}
                  <div className="full-width">
                    {select("Origine", catalog.categories.Origine)}
                  </div>
                </div>
                <p className="field-note">
                  CV means fiscal power, as listed on the vehicle’s
                  registration.
                </p>
              </fieldset>
              {error && (
                <p className="error-message" role="alert">
                  {error}
                </p>
              )}
              <button
                className="button button-dark predict-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Estimating your vehicle…
                  </>
                ) : (
                  <>
                    Predict price <span>↗</span>
                  </>
                )}
              </button>
              <p className="form-footnote">
                Historical model · supports vehicles from 1991 to 2025
              </p>
            </form>
          )
        )}
      </div>
      <aside
        className={`result-card ${result ? "has-result" : ""}`}
        aria-label="Price estimate"
        aria-live="polite"
        aria-busy={loading}
      >
        <div className="result-top">
          <span className="eyebrow">YOUR ESTIMATE</span>
          <span className="result-mark">↗</span>
        </div>
        {result ? (
          <div className="result-content">
            <p className="result-kicker">Estimated market price</p>
            <div className="price" data-testid="predicted-price">
              {new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 0,
              }).format(result.prediction.predicted_price)}
              <span>MAD</span>
            </div>
            <p className="result-car">
              {display(result.vehicle.Marque)} {display(result.vehicle.Model)}{" "}
              <span>· {result.vehicle.Model_Year}</span>
            </p>
            <hr />
            <h4>Your submitted vehicle</h4>
            <dl className="vehicle-summary">
              {Object.entries(result.vehicle).map(([key, value]) => (
                <div key={key}>
                  <dt>{labels[key as keyof Vehicle]}</dt>
                  <dd>
                    {key === "Kilométrage"
                      ? `${Number(value).toLocaleString("en-US")} km`
                      : display(value)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="estimate-note">
              Changed the form? Predict again to update this estimate.
            </p>
          </div>
        ) : (
          <div className="empty-result">
            <div className="estimate-symbol" aria-hidden="true">
              {loading ? <span className="spinner" /> : "↗"}
            </div>
            <h3>
              {loading
                ? "Reading between the details."
                : "Your next move, informed."}
            </h3>
            <p>
              {loading
                ? "Your vehicle is moving through the prediction pipeline."
                : "Complete the vehicle details and your price estimate will appear here."}
            </p>
            <div className="empty-price" aria-hidden="true">
              — — — <span>MAD</span>
            </div>
          </div>
        )}
        <div className="result-disclaimer">
          <span aria-hidden="true">ⓘ</span>
          <p>
            An estimate, not an appraisal. Based on historical asking prices;
            actual sale prices depend on the vehicle and today’s market.
          </p>
        </div>
      </aside>
    </div>
  );
}
