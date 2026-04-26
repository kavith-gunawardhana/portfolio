from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..auth import get_current_user
from ..db import get_session
from ..models import Certification, User
from ..schemas import CertificationIn

router = APIRouter(prefix="/api/certifications", tags=["certifications"])


@router.get("")
def list_certs(session: Session = Depends(get_session)):
    return session.exec(
        select(Certification).order_by(Certification.sort_order, Certification.id)
    ).all()


@router.post("")
def create_cert(
    payload: CertificationIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    c = Certification(**payload.model_dump())
    session.add(c)
    session.commit()
    session.refresh(c)
    return c


@router.put("/{cert_id}")
def update_cert(
    cert_id: int,
    payload: CertificationIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    c = session.get(Certification, cert_id)
    if not c:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(c, k, v)
    session.add(c)
    session.commit()
    session.refresh(c)
    return c


@router.delete("/{cert_id}")
def delete_cert(
    cert_id: int,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    c = session.get(Certification, cert_id)
    if not c:
        raise HTTPException(404, "Not found")
    session.delete(c)
    session.commit()
    return {"ok": True}
