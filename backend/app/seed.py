"""Seed initial admin user and a starter SiteSettings row."""

from datetime import date

from sqlmodel import Session, select

from .auth import hash_password
from .config import settings
from .db import engine
from .models import Education, SiteSettings, User


def seed() -> None:
    with Session(engine) as session:
        # admin
        existing = session.exec(select(User).where(User.username == settings.admin_username)).first()
        fresh_db = existing is None
        if fresh_db:
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

        # education — only seed sample rows on a brand-new DB so we don't
        # silently inject placeholder schools into a live deployment.
        if fresh_db and session.exec(select(Education)).first() is None:
            sample = [
                Education(
                    institution="University of Colombo School of Computing",
                    degree="BSc (Hons) in Information Systems",
                    field="Cybersecurity specialisation",
                    location="Colombo, Sri Lanka",
                    start_date=date(2023, 2, 1),
                    end_date=None,
                    grade="GPA: 3.7 / 4.0 (in progress)",
                    description=(
                        "Coursework focused on networks, OS internals, applied cryptography, "
                        "secure software engineering, and information assurance. Active in the "
                        "campus cybersecurity club and CTF team."
                    ),
                    sort_order=0,
                ),
                Education(
                    institution="Royal College Colombo",
                    degree="GCE Advanced Level",
                    field="Physical Science stream",
                    location="Colombo, Sri Lanka",
                    start_date=date(2020, 1, 1),
                    end_date=date(2022, 12, 1),
                    grade="3 A passes · island-rank Z-score",
                    description=(
                        "Mathematics, Physics, and ICT. First exposure to Linux, networking "
                        "fundamentals, and competitive programming."
                    ),
                    sort_order=1,
                ),
                Education(
                    institution="TryHackMe & HackTheBox",
                    degree="Self-directed learning paths",
                    field="Offensive security · blue team",
                    location="Online",
                    start_date=date(2023, 6, 1),
                    end_date=None,
                    grade="Top 5% · 30+ rooms / boxes solved",
                    description=(
                        "Hands-on labs across web exploitation, Active Directory, privilege "
                        "escalation, SOC analyst, and threat hunting paths."
                    ),
                    sort_order=2,
                ),
            ]
            for e in sample:
                session.add(e)
            session.commit()
            print(f"[seed] created {len(sample)} education entries")
