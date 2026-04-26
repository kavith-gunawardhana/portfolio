from pathlib import Path
from sqlmodel import SQLModel, Session, create_engine

from .config import settings

# Ensure parent dir for sqlite file exists
if settings.database_url.startswith("sqlite"):
    db_path_part = settings.database_url.split("sqlite:///", 1)[-1]
    if db_path_part:
        Path(db_path_part).parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(
    settings.database_url,
    echo=False,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)


def init_db() -> None:
    from . import models  # noqa: F401  ensure models registered

    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
