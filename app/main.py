
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401
from app.core.config import settings
from app.core.database import Base, engine
from app.routers import apis, auth, projects

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI(
    title="API Dashboard",
    description="Central Dashboard for Managing API Projects",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(apis.router)


@app.get("/")
def home():
    return {
        "message": "API Dashboard is running!",
        "status": "success",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    } 
