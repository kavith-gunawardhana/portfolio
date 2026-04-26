from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ..auth import get_current_user
from ..db import get_session
from ..models import SiteSettings, User
from ..schemas import SiteSettingsIn

router = APIRouter(prefix="/api/settings", tags=["settings"])


def _get_or_create(session: Session) -> SiteSettings:
    s = session.exec(select(SiteSettings).where(SiteSettings.id == 1)).first()
    if s is None:
        s = SiteSettings(id=1)
        session.add(s)
        session.commit()
        session.refresh(s)
    return s


@router.get("")
def get_settings(session: Session = Depends(get_session)):
    return _get_or_create(session)


@router.put("")
def update_settings(
    payload: SiteSettingsIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    s = _get_or_create(session)
    data = payload.model_dump(exclude_none=True)
    for k, v in data.items():
        setattr(s, k, v)
    from datetime import datetime

    s.updated_at = datetime.utcnow()
    session.add(s)
    session.commit()
    session.refresh(s)
    return s
