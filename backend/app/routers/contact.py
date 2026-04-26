from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..auth import get_current_user
from ..db import get_session
from ..models import ContactMessage, User
from ..schemas import ContactMessageIn

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("")
def submit(payload: ContactMessageIn, session: Session = Depends(get_session)):
    if not payload.name.strip() or not payload.email.strip() or not payload.message.strip():
        raise HTTPException(400, "All fields are required")
    if len(payload.message) > 5000:
        raise HTTPException(400, "Message too long")
    m = ContactMessage(name=payload.name, email=payload.email, message=payload.message)
    session.add(m)
    session.commit()
    return {"ok": True}


@router.get("/messages")
def list_messages(
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    return session.exec(
        select(ContactMessage).order_by(ContactMessage.created_at.desc())  # type: ignore
    ).all()


@router.post("/messages/{msg_id}/read")
def mark_read(
    msg_id: int,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    m = session.get(ContactMessage, msg_id)
    if not m:
        raise HTTPException(404, "Not found")
    m.read = True
    session.add(m)
    session.commit()
    return {"ok": True}


@router.delete("/messages/{msg_id}")
def delete_message(
    msg_id: int,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    m = session.get(ContactMessage, msg_id)
    if not m:
        raise HTTPException(404, "Not found")
    session.delete(m)
    session.commit()
    return {"ok": True}
