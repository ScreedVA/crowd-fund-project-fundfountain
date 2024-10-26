from fastapi import APIRouter, Depends
from sessions import SessionLocal
from sqlalchemy.orm import Session
from models import CrowdFundProject
from schemas.cfp_schemas import CrowdFundProjectSummary
from .auth_router import get_current_user
from typing import Annotated


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


@router.get('/')
async def read_all_projects(db: db_dependency):
    cfp_model = db.query(CrowdFundProject).all()


    






