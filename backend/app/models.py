from datetime import datetime, date
from typing import Optional

from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SiteSettings(SQLModel, table=True):
    """Singleton row (id=1) holding global site config."""

    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str = "Your Name"
    handle: str = "@you"
    tagline: str = "Cybersecurity Student & Aspiring Security Engineer"
    bio: str = ""
    location: str = ""
    email: str = ""
    github_url: str = ""
    linkedin_url: str = ""
    twitter_url: str = ""
    website_url: str = ""
    resume_url: str = ""
    avatar_url: str = ""
    # JSON-encoded list[str] of lines for the hero terminal animation
    terminal_lines_json: str = "[]"
    # JSON-encoded list[str] of focus areas / keywords
    focus_areas_json: str = "[]"
    primary_color: str = "#22d3ee"  # cyan-400
    accent_color: str = "#a78bfa"  # violet-400
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SkillCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    icon: str = ""  # emoji or short string
    sort_order: int = 0


class Skill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="skillcategory.id", index=True)
    name: str
    level: int = 50  # 0-100
    icon: str = ""
    sort_order: int = 0


class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company: str
    title: str
    location: str = ""
    start_date: date
    end_date: Optional[date] = None  # null = current
    description: str = ""
    logo_url: str = ""
    sort_order: int = 0


class Promotion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="job.id", index=True)
    title: str
    start_date: date
    description: str = ""
    sort_order: int = 0


class Certification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    issuer: str
    issued_date: Optional[date] = None
    expires_date: Optional[date] = None
    credential_id: str = ""
    credential_url: str = ""
    image_url: str = ""
    description: str = ""
    sort_order: int = 0


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    summary: str = ""
    description: str = ""
    tags_json: str = "[]"  # JSON array of strings
    repo_url: str = ""
    demo_url: str = ""
    image_url: str = ""
    featured: bool = False
    sort_order: int = 0


class ContactMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False
