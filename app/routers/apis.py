from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_admin
from app.models import ApiItem, Project
from app.schemas.api_item import ApiIn, ApiOut

router = APIRouter(prefix="/api", tags=["APIs"], dependencies=[Depends(require_admin)])


def get_or_404(db: Session, id: int) -> ApiItem:
    item = db.get(ApiItem, id)
    if not item:
        raise HTTPException(404, "API পাওয়া যায়নি")
    return item


@router.get("/apis", response_model=list[ApiOut])
def list_all(db: Session = Depends(get_db)):
    return db.scalars(select(ApiItem).order_by(ApiItem.id.desc())).all()


@router.post("/projects/{project_id}/apis", response_model=ApiOut, status_code=201)
def create(project_id: int, data: ApiIn, db: Session = Depends(get_db)):
    if not db.get(Project, project_id):
        raise HTTPException(404, "প্রজেক্ট পাওয়া যায়নি")
    item = ApiItem(project_id=project_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/apis/{id}", response_model=ApiOut)
def update(id: int, data: ApiIn, db: Session = Depends(get_db)):
    item = get_or_404(db, id)
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/apis/{id}/toggle", response_model=ApiOut)  # Active <-> Inactive
def toggle(id: int, db: Session = Depends(get_db)):
    item = get_or_404(db, id)
    item.status = "inactive" if item.status == "active" else "active"
    db.commit()
    db.refresh(item)
    return item


@router.delete("/apis/{id}", status_code=204)
def delete(id: int, db: Session = Depends(get_db)):
    db.delete(get_or_404(db, id))
    db.commit()