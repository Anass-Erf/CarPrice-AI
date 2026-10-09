"""HTTP transport; model loading and inference live outside the route handlers."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from .config import CORS_ORIGINS
from .prediction import Predictor
from .schemas import CarFeatures, PredictionResponse

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.predictor = Predictor()
    yield
    del app.state.predictor


app = FastAPI(title="CarPrice AI", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/metadata")
def metadata(request: Request) -> dict:
    """The form uses supported categories from the artifact and training snapshot."""
    return request.app.state.predictor.catalog


@app.post("/predict", response_model=PredictionResponse)
def predict(data: CarFeatures, request: Request) -> PredictionResponse:
    try:
        price = request.app.state.predictor.predict(data)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=503,
            detail="Prediction is temporarily unavailable. Please try again.",
        ) from exc
    return PredictionResponse(predicted_price=price)
