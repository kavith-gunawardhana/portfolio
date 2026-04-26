from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..auth import get_current_user
from ..db import get_session
from ..models import Project, User
from ..schemas import ProjectIn

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("")
def list_projects(session: Session = Depends(get_session)):
    return session.exec(select(Project).order_by(Project.sort_order, Project.id)).all()


@router.post("")
def create_project(
    payload: ProjectIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    p = Project(**payload.model_dump())
    session.add(p)
    session.commit()
    session.refresh(p)
    return p


@router.put("/{project_id}")
def update_project(
    project_id: int,
    payload: ProjectIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    p = session.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(p, k, v)
    session.add(p)
    session.commit()
    session.refresh(p)
    return p


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    p = session.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Not found")
    session.delete(p)
    session.commit()
    return {"ok": True}
