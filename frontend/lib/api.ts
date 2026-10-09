export type Vehicle = {
  Kilométrage: number;
  Puissance: number;
  Model_Year: number;
  Nb_portes: number;
  Première_main: string;
  Transmission: string;
  État: string;
  Carburant: string;
  Origine: string;
  Marque: string;
  Model: string;
};
export type Catalog = {
  reference_year: number;
  currency: string;
  algorithm: string;
  dataset_rows: number;
  feature_count: number;
  brands: Record<string, string[]>;
  categories: Record<string, (string | number)[]>;
  numeric: Record<string, { min: number; max: number; step: number }>;
};
export type Prediction = { predicted_price: number; currency: "MAD" };
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      "We could not reach the prediction service. Please try again in a moment.",
    );
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail = body.detail;
    if (typeof detail === "string") throw new Error(detail);
    if (Array.isArray(detail)) {
      throw new Error(
        detail
          .map(
            (error: { loc: string[]; msg: string }) =>
              `${error.loc.slice(1).join(".")}: ${error.msg}`,
          )
          .join(" · "),
      );
    }
    throw new Error(
      "The service could not complete your request. Please try again.",
    );
  }
  return response.json();
}
export const getCatalog = () => request<Catalog>("/metadata");
export const predict = (vehicle: Vehicle) =>
  request<Prediction>("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
