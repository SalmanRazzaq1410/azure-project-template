import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "{{ENV}}")
PROJECT_NAME = "{{PROJECT}}"
ORG = "{{ORG}}"


class HealthResponse(BaseModel):
    status: str
    environment: str
    version: str = "1.0.0"


class InfoResponse(BaseModel):
    message: str
    org: str
    env: str
    project: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown events."""
    logger.info(f"Starting {PROJECT_NAME} in {ENVIRONMENT} environment")
    yield
    logger.info(f"Shutting down {PROJECT_NAME}")


app = FastAPI(
    title=PROJECT_NAME,
    description=f"API for {PROJECT_NAME}",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if ENVIRONMENT == "dev" else [os.getenv("ALLOWED_ORIGINS", "")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=InfoResponse)
async def root():
    """Root endpoint returning project information."""
    return InfoResponse(
        message=f"Welcome to {PROJECT_NAME}",
        org=ORG,
        env=ENVIRONMENT,
        project=PROJECT_NAME,
    )


@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint for container orchestration."""
    return HealthResponse(
        status="healthy",
        environment=ENVIRONMENT,
    )


@app.get("/ready")
async def ready():
    """Readiness probe - check if app can serve traffic."""
    # Add your readiness checks here (database connection, etc.)
    return {"status": "ready"}
