from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .db import init_db
from .routers import (
    auth,
    certifications,
    contact,
    education,
    jobs,
    projects,
    site_settings,
    skills,
    uploads,
)
from .seed import seed

app = FastAPI(title="Portfolio API", version="1.0.0")

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    seed()


# Static uploads
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Routers
app.include_router(auth.router)
app.include_router(site_settings.router)
app.include_router(skills.router)
app.include_router(jobs.router)
app.include_router(education.router)
app.include_router(certifications.router)
app.include_router(projects.router)
app.include_router(contact.router)
app.include_router(uploads.router)


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.get("/")
def root():
    return {"name": "Portfolio API", "docs": "/docs"}
