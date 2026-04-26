from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..auth import get_current_user
from ..db import get_session
from ..models import Education, User
from ..schemas import EducationIn

router = APIRouter(prefix="/api", tags=["education"])


@router.get("/education")
def list_education(session: Session = Depends(get_session)):
    rows = session.exec(
        select(Education).order_by(Education.sort_order, Education.start_date.desc())  # type: ignore
    ).all()
    return rows


@router.post("/education")
def create_education(
    payload: EducationIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    e = Education(**payload.model_dump())
    session.add(e)
    session.commit()
    session.refresh(e)
    return e


@router.put("/education/{edu_id}")
def update_education(
    edu_id: int,
    payload: EducationIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    e = session.get(Education, edu_id)
    if not e:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(e, k, v)
    session.add(e)
    session.commit()
    session.refresh(e)
    return e


@router.delete("/education/{edu_id}")
def delete_education(
    edu_id: int,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    e = session.get(Education, edu_id)
    if not e:
        raise HTTPException(404, "Not found")
    session.delete(e)
    session.commit()
    return {"ok": True}
