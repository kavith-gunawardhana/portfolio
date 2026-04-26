from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from ..auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from ..db import get_session
from ..models import User
from ..schemas import ChangePasswordRequest, LoginRequest, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login_form(
    form: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    """Login via OAuth2 password form (used by FastAPI docs UI)."""
    return _do_login(form.username, form.password, session)


@router.post("/login-json", response_model=TokenResponse)
def login_json(payload: LoginRequest, session: Session = Depends(get_session)):
    return _do_login(payload.username, payload.password, session)


def _do_login(username: str, password: str, session: Session) -> TokenResponse:
    user = session.exec(select(User).where(User.username == username)).first()
    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    return TokenResponse(access_token=create_access_token(user.username))


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "username": user.username}


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    user.password_hash = hash_password(payload.new_password)
    session.add(user)
    session.commit()
    return {"ok": True}
