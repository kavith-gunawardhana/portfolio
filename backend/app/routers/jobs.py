from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..auth import get_current_user
from ..db import get_session
from ..models import Job, Promotion, User
from ..schemas import JobIn, PromotionIn

router = APIRouter(prefix="/api", tags=["jobs"])


@router.get("/jobs")
def list_jobs(session: Session = Depends(get_session)):
    # Most recent first based on start_date desc
    jobs = session.exec(
        select(Job).order_by(Job.sort_order, Job.start_date.desc())  # type: ignore
    ).all()
    proms = session.exec(
        select(Promotion).order_by(Promotion.start_date.desc())  # type: ignore
    ).all()
    by_job: dict[int, list] = {}
    for p in proms:
        by_job.setdefault(p.job_id, []).append(p)
    return [
        {
            "id": j.id,
            "company": j.company,
            "title": j.title,
            "location": j.location,
            "start_date": j.start_date,
            "end_date": j.end_date,
            "description": j.description,
            "logo_url": j.logo_url,
            "sort_order": j.sort_order,
            "promotions": by_job.get(j.id, []),
        }
        for j in jobs
    ]


@router.post("/jobs")
def create_job(
    payload: JobIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    j = Job(**payload.model_dump())
    session.add(j)
    session.commit()
    session.refresh(j)
    return j


@router.put("/jobs/{job_id}")
def update_job(
    job_id: int,
    payload: JobIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    j = session.get(Job, job_id)
    if not j:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(j, k, v)
    session.add(j)
    session.commit()
    session.refresh(j)
    return j


@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    j = session.get(Job, job_id)
    if not j:
        raise HTTPException(404, "Not found")
    for p in session.exec(select(Promotion).where(Promotion.job_id == job_id)).all():
        session.delete(p)
    session.delete(j)
    session.commit()
    return {"ok": True}


# ---------- promotions ----------
@router.post("/promotions")
def create_promotion(
    payload: PromotionIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    p = Promotion(**payload.model_dump())
    session.add(p)
    session.commit()
    session.refresh(p)
    return p


@router.put("/promotions/{prom_id}")
def update_promotion(
    prom_id: int,
    payload: PromotionIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    p = session.get(Promotion, prom_id)
    if not p:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(p, k, v)
    session.add(p)
    session.commit()
    session.refresh(p)
    return p


@router.delete("/promotions/{prom_id}")
def delete_promotion(
    prom_id: int,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    p = session.get(Promotion, prom_id)
    if not p:
        raise HTTPException(404, "Not found")
    session.delete(p)
    session.commit()
    return {"ok": True}
