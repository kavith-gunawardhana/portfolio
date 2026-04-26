# Cybersecurity Portfolio

A full-stack, single-page portfolio with a cybersecurity-themed UI and a complete admin panel. Everything visible on the public site is editable through the admin panel — **no hardcoded content**.

> Built with **Vite + React + TypeScript + Tailwind + Framer Motion** on the frontend and **FastAPI + SQLite + JWT** on the backend.

---

## Features

### Public site (`/`)
- **Hero** with animated terminal typing, status indicator, focus-area badges, and matrix-style background.
- **About** with bio + contact identity card.
- **Skills** grouped into categories with proficiency bars (drag-edited via admin).
- **Experience timeline** with jobs and **promotions / role changes nested per job** — perfect for "I started as X, was promoted to Y, then Z at the same company."
- **Certifications** with issuer, dates, credential link, and badge image.
- **Projects** with tags, summary, long description (collapsible), repo link, demo link.
- **Contact** form that stores messages in the admin inbox.
- Animated entries (Framer Motion), responsive (mobile + desktop), accessible.

### Admin panel (`/admin`)
- JWT-based login.
- **Dashboard** with counters and quick actions.
- **Site settings**: identity, hero terminal lines, focus areas, all socials, theme colors.
- **Skills**: CRUD on categories and skills.
- **Experience**: CRUD on jobs and nested promotions.
- **Certifications**: CRUD with image upload.
- **Projects**: CRUD with cover image and feature flag.
- **Messages**: inbox for the contact form.
- **File uploads** stored on the backend (used for logos, badges, project covers, avatars).

---

## Local development

### Prerequisites
- Node 18+ (tested on 22)
- Python 3.11+ (tested on 3.12)
- [`uv`](https://docs.astral.sh/uv/) (recommended) or pip

### 1. Backend

```bash
cd backend
uv sync                          # installs dependencies
uv run uvicorn app.main:app --reload --port 8001
```

The API will be available at <http://localhost:8001>. OpenAPI docs at <http://localhost:8001/docs>.

A SQLite DB and admin user are created on first run. Default credentials live in `backend/.env` (see `.env.example`):

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123    # change me!
```

Change the password via the admin panel (`Login → ⚙ via API`) or hit `POST /api/auth/change-password`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server proxies `/api` and `/uploads` to the backend, so just open <http://localhost:5173>.

To point at a remote backend instead, set `VITE_API_URL` in `frontend/.env`.

---

## Deployment

The repo is structured so the frontend and backend deploy independently:

- **Frontend**: any static host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront). `npm run build` outputs to `frontend/dist/`. Set `VITE_API_URL` to your backend's public URL at build time.
- **Backend**: any container host. Run with `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000`. Mount a persistent volume at `/data` (default `DATABASE_URL=sqlite:////data/portfolio.db` and `UPLOAD_DIR=/data/uploads`).

### Required env vars (backend)

| Var | Default | Notes |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:////data/portfolio.db` | Any SQLAlchemy URL |
| `JWT_SECRET` | `change-me-…` | **Set this in production** |
| `ADMIN_USERNAME` | `admin` | Initial admin (only used at first boot) |
| `ADMIN_PASSWORD` | `changeme` | Initial admin password |
| `UPLOAD_DIR` | `/data/uploads` | Where uploaded images go |
| `CORS_ORIGINS` | `*` | Comma-separated list of allowed origins |
| `PUBLIC_BASE_URL` | (empty) | Optional; absolute URL prefix for upload links |

---

## Project structure

```
portfolio/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entry
│   │   ├── config.py          # pydantic-settings
│   │   ├── db.py              # SQLModel engine
│   │   ├── models.py          # all DB models
│   │   ├── schemas.py         # request/response schemas
│   │   ├── auth.py            # JWT + bcrypt
│   │   ├── seed.py            # admin/site bootstrap
│   │   └── routers/
│   │       ├── auth.py
│   │       ├── site_settings.py
│   │       ├── skills.py
│   │       ├── jobs.py
│   │       ├── certifications.py
│   │       ├── projects.py
│   │       ├── contact.py
│   │       └── uploads.py
│   ├── pyproject.toml
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/        # shared UI primitives
    │   ├── sections/          # public-site sections
    │   ├── pages/
    │   │   ├── HomePage.tsx
    │   │   ├── NotFound.tsx
    │   │   └── admin/
    │   │       ├── AdminLayout.tsx
    │   │       ├── DashboardPage.tsx
    │   │       ├── SettingsPage.tsx
    │   │       ├── SkillsAdminPage.tsx
    │   │       ├── JobsAdminPage.tsx
    │   │       ├── CertsAdminPage.tsx
    │   │       ├── ProjectsAdminPage.tsx
    │   │       ├── MessagesAdminPage.tsx
    │   │       ├── LoginPage.tsx
    │   │       └── RequireAuth.tsx
    │   ├── lib/               # api client, auth context, formatters
    │   ├── types.ts
    │   └── index.css          # Tailwind + theme
    ├── tailwind.config.js
    ├── vite.config.ts
    └── package.json
```

---

## Tech notes

- **Auth**: bcrypt password hashing + HS256 JWT in `Authorization: Bearer …` header. Token persisted in `localStorage`.
- **Animations**: Framer Motion `whileInView` for section reveals, custom RAF loop for matrix backdrop.
- **Theme**: Tailwind with a custom `cyber-*` palette, JetBrains Mono + Inter fonts, glow shadows, scanline + glitch keyframes.
- **No data is hardcoded**: every public element reads from the API; default content is seeded once and is editable.

Built by Devin for Kavith Gunawardhana.
