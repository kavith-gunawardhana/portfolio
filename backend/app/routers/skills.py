from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..auth import get_current_user
from ..db import get_session
from ..models import Skill, SkillCategory, User
from ..schemas import SkillCategoryIn, SkillIn

router = APIRouter(prefix="/api", tags=["skills"])


# ---------- categories ----------
@router.get("/skill-categories")
def list_categories(session: Session = Depends(get_session)):
    cats = session.exec(
        select(SkillCategory).order_by(SkillCategory.sort_order, SkillCategory.id)
    ).all()
    skills = session.exec(select(Skill).order_by(Skill.sort_order, Skill.id)).all()
    by_cat: dict[int, list] = {}
    for s in skills:
        by_cat.setdefault(s.category_id, []).append(s)
    return [
        {
            "id": c.id,
            "name": c.name,
            "icon": c.icon,
            "sort_order": c.sort_order,
            "skills": by_cat.get(c.id, []),
        }
        for c in cats
    ]


@router.post("/skill-categories")
def create_category(
    payload: SkillCategoryIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    c = SkillCategory(**payload.model_dump())
    session.add(c)
    session.commit()
    session.refresh(c)
    return c


@router.put("/skill-categories/{cat_id}")
def update_category(
    cat_id: int,
    payload: SkillCategoryIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    c = session.get(SkillCategory, cat_id)
    if not c:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(c, k, v)
    session.add(c)
    session.commit()
    session.refresh(c)
    return c


@router.delete("/skill-categories/{cat_id}")
def delete_category(
    cat_id: int,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    c = session.get(SkillCategory, cat_id)
    if not c:
        raise HTTPException(404, "Not found")
    # delete skills in category
    for s in session.exec(select(Skill).where(Skill.category_id == cat_id)).all():
        session.delete(s)
    session.delete(c)
    session.commit()
    return {"ok": True}


# ---------- skills ----------
@router.post("/skills")
def create_skill(
    payload: SkillIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    s = Skill(**payload.model_dump())
    session.add(s)
    session.commit()
    session.refresh(s)
    return s


@router.put("/skills/{skill_id}")
def update_skill(
    skill_id: int,
    payload: SkillIn,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    s = session.get(Skill, skill_id)
    if not s:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(s, k, v)
    session.add(s)
    session.commit()
    session.refresh(s)
    return s


@router.delete("/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    s = session.get(Skill, skill_id)
    if not s:
        raise HTTPException(404, "Not found")
    session.delete(s)
    session.commit()
    return {"ok": True}
