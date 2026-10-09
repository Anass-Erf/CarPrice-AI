"""Public feature names retain the trained dataset's vocabulary."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from .config import REFERENCE_YEAR


class CarFeatures(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True, strict=True)

    Kilométrage: float = Field(ge=0, le=500_000, allow_inf_nan=False)
    Puissance: float = Field(
        ge=4,
        le=41,
        allow_inf_nan=False,
        description="Fiscal power (CV), not engine horsepower",
    )
    Model_Year: int = Field(ge=1991, le=REFERENCE_YEAR)
    Nb_portes: Literal[2, 4]
    Première_main: Literal["oui", "non"]
    Transmission: Literal["automatique", "manuelle"]
    État: Literal["mauvais", "correct", "bon", "très bon", "excellent", "neuf"]
    Carburant: Literal["diesel", "electrique", "essence", "hybride", "lpg"]
    Origine: Literal[
        "dédouanée", "importée neuve", "pas encore dédouanée", "ww au maroc"
    ]
    Marque: str = Field(min_length=1, max_length=100)
    Model: str = Field(min_length=1, max_length=100)


class PredictionResponse(BaseModel):
    predicted_price: float = Field(ge=0, allow_inf_nan=False)
    currency: Literal["MAD"] = "MAD"
