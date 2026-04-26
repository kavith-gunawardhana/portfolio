"""Seed initial admin user and a starter SiteSettings row."""

from sqlmodel import Session, select

from .auth import hash_password
from .config import settings
from .db import engine
from .models import SiteSettings, User


def seed() -> None:
    with Session(engine) as session:
        # admin
        existing = session.exec(select(User).where(User.username == settings.admin_username)).first()
        if existing is None:
            user = User(
                username=settings.admin_username,
                password_hash=hash_password(settings.admin_password),
            )
            session.add(user)
            session.commit()
            print(f"[seed] created admin user: {settings.admin_username}")

        # site settings singleton
        s = session.exec(select(SiteSettings).where(SiteSettings.id == 1)).first()
        if s is None:
            s = SiteSettings(
                id=1,
                full_name="Kavith Gunawardhana",
                handle="@kavith",
                tagline="Cybersecurity Student · Aspiring Security Engineer",
                bio=(
                    "Cybersecurity student passionate about offensive security, blue-team "
                    "defense, and learning by breaking things responsibly. Currently sharpening "
                    "my skills through CTFs, home labs, and hands-on practice."
                ),
                location="Sri Lanka",
                email="gunawardenakavith@gmail.com",
                github_url="https://github.com/kavith-gunawardhana",
                linkedin_url="",
                twitter_url="",
                website_url="",
                resume_url="",
                avatar_url="",
                terminal_lines_json=(
                    '["whoami","kavith — cybersecurity student",'
                    '"cat focus.txt","offensive security · blue team · ctfs",'
                    '"./initialize_career --path security"]'
                ),
                focus_areas_json=(
                    '["Penetration Testing","Network Security","Threat Hunting",'
                    '"SOC Analysis","CTFs","Linux Internals"]'
                ),
                primary_color="#22d3ee",
                accent_color="#a78bfa",
            )
            session.add(s)
            session.commit()
            print("[seed] created site settings")
