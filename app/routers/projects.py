from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_admin
from app.models import ApiItem, Project
from app.schemas.project import ProjectIn, ProjectOut

router = APIRouter(
    prefix="/api/projects", tags=["Projects"], dependencies=[Depends(require_admin)]
)


def get_or_404(db: Session, id: int) -> Project:
    project = db.get(Project, id)
    if not project:
        raise HTTPException(404, "project paya jay nai")
    return project


def out(p: Project, count: int = 0) -> ProjectOut:
    return ProjectOut(id=p.id, name=p.name, description=p.description, api_count=count)


def commit(db: Session):
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "")


@router.get("", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    rows = db.execute(
        select(Project, func.count(ApiItem.id))
        .outerjoin(ApiItem)
        .group_by(Project.id)
        .order_by(Project.id)
    ).all()
    return [out(p, c) for p, c in rows]


@router.post("", response_model=ProjectOut, status_code=201)
def create(data: ProjectIn, db: Session = Depends(get_db)):
    project = Project(**data.model_dump())
    db.add(project)
    commit(db)
    return out(project)


@router.put("/{id}", response_model=ProjectOut)
def update(id: int, data: ProjectIn, db: Session = Depends(get_db)):
    project = get_or_404(db, id)
    project.name, project.description = data.name, data.description
    commit(db)
    return out(project)


@router.delete("/{id}", status_code=204)
def delete(id: int, db: Session = Depends(get_db)):
    db.delete(get_or_404(db, id))
    db.commit()