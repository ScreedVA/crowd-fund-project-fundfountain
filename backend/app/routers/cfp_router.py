from fastapi import APIRouter, Depends
from sessions import SessionLocal
from sqlalchemy.orm import Session
from models import CrowdFundProject
from schemas.cfp_schemas import CrowdFundProjectSummary
from services import transform_cfp_summary_from_model
from .auth_router import get_current_user
from typing import Annotated
from starlette import status


router = APIRouter(
    prefix='/crowd_fund_project',
    tags=['crowd_fund_project']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get('/', response_model=list[CrowdFundProjectSummary], status_code=status.HTTP_200_OK)
async def read_all_projects(db: db_dependency):
    cfp_models: list[CrowdFundProject] = db.query(CrowdFundProject).all()

    cfp_response = [transform_cfp_summary_from_model(model) for model in cfp_models]

    return cfp_response

@router.get("/{project_id}", )
async def read_project_by_id(project_id: int, db: db_dependency):
    cfp_model: CrowdFundProject = db.query(CrowdFundProject).filter(CrowdFundProject.id == project_id).first()


    







