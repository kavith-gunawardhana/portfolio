import os
import secrets
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile

from ..auth import get_current_user
from ..config import settings
from ..models import User

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

ALLOWED_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".pdf"}
MAX_BYTES = 5 * 1024 * 1024  # 5MB


@router.post("")
async def upload(
    request: Request,
    file: UploadFile = File(...),
    _user: User = Depends(get_current_user),
):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, f"Unsupported file type: {ext}")
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(400, "File too large (max 5MB)")
    name = secrets.token_urlsafe(16) + ext
    dest = Path(settings.upload_dir) / name
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    rel = f"/uploads/{name}"
    base = settings.public_base_url or str(request.base_url).rstrip("/")
    return {"url": f"{base}{rel}", "path": rel, "filename": name}


@router.delete("/{filename}")
def delete_upload(
    filename: str,
    _user: User = Depends(get_current_user),
):
    # Prevent path traversal
    if "/" in filename or ".." in filename:
        raise HTTPException(400, "Invalid filename")
    path = Path(settings.upload_dir) / filename
    if path.exists():
        os.remove(path)
        return {"ok": True}
    raise HTTPException(404, "Not found")
