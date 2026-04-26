from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


# ---------- auth ----------
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ---------- settings ----------
class SiteSettingsIn(BaseModel):
    full_name: Optional[str] = None
    handle: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    website_url: Optional[str] = None
    resume_url: Optional[str] = None
    avatar_url: Optional[str] = None
    terminal_lines_json: Optional[str] = None
    focus_areas_json: Optional[str] = None
    primary_color: Optional[str] = None
    accent_color: Optional[str] = None


# ---------- skill category ----------
class SkillCategoryIn(BaseModel):
    name: str
    icon: str = ""
    sort_order: int = 0


# ---------- skill ----------
class SkillIn(BaseModel):
    category_id: int
    name: str
    level: int = 50
    icon: str = ""
    sort_order: int = 0


# ---------- job ----------
class JobIn(BaseModel):
    company: str
    title: str
    location: str = ""
    start_date: date
    end_date: Optional[date] = None
    description: str = ""
    logo_url: str = ""
    sort_order: int = 0


# ---------- promotion ----------
class PromotionIn(BaseModel):
    job_id: int
    title: str
    start_date: date
    description: str = ""
    sort_order: int = 0


# ---------- education ----------
class EducationIn(BaseModel):
    institution: str
    degree: str
    field: str = ""
    location: str = ""
    start_date: date
    end_date: Optional[date] = None
    description: str = ""
    grade: str = ""
    logo_url: str = ""
    sort_order: int = 0


# ---------- certification ----------
class CertificationIn(BaseModel):
    name: str
    issuer: str
    issued_date: Optional[date] = None
    expires_date: Optional[date] = None
    credential_id: str = ""
    credential_url: str = ""
    image_url: str = ""
    description: str = ""
    sort_order: int = 0


# ---------- project ----------
class ProjectIn(BaseModel):
    title: str
    summary: str = ""
    description: str = ""
    tags_json: str = "[]"
    repo_url: str = ""
    demo_url: str = ""
    image_url: str = ""
    featured: bool = False
    sort_order: int = 0


# ---------- contact ----------
class ContactMessageIn(BaseModel):
    name: str
    email: str
    message: str
