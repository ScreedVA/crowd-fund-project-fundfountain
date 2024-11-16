from fastapi import APIRouter, Depends, HTTPException
from sessions import SessionLocal
from sqlalchemy.orm import Session
from .auth_router import get_current_user
from typing import Annotated, List
from starlette import status
from sqlalchemy import and_
from models import UserTable, CrowdFundProjectTable
from schemas import UserIsAdminSchema, cfpFilterSchema, userFilterSchema, AdminUserSummarySchema, AdminCFPSummarySchema
from services import transform_to_admin_user_summary_schema_from_admin_user_tables, transform_to_admin_cfp_summary_schema_from_admin_user_tables


router = APIRouter(
    prefix='/admin',
    tags=['admin']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/verify", response_model=UserIsAdminSchema, status_code=status.HTTP_200_OK)
async def check_if_admin(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cannot check if admin")
    user_table: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    
    if not user_table:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")
    
    return UserIsAdminSchema(is_admin=user_table.is_admin)

@router.get("/list/user", response_model=List[AdminUserSummarySchema])
async def get_admin_user_list(db: db_dependency, user: user_dependency, filters: userFilterSchema = Depends()):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cannot access endpoint")
    admin_table: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    if not admin_table:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")
    if not admin_table.is_admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not authorized admin")

    query = db.query(UserTable)
    
    filter_conditions = []

    if filters.name:
        filter_conditions.append(UserTable.username.ilike(f"%{filters.name}%")) 

    if filter_conditions:
        query = query.filter(and_(*filter_conditions))
    
    user_tables = query.all()

    admin_user_summary_schema_list: List[AdminUserSummarySchema] = [transform_to_admin_user_summary_schema_from_admin_user_tables(user_table ,admin_table) for user_table in user_tables]
    return admin_user_summary_schema_list

@router.get("/list/crowd_fund_project", response_model=List[AdminCFPSummarySchema])
async def get_admin_cfp_list(db: db_dependency, user: user_dependency, filters: cfpFilterSchema = Depends()):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cannot access endpoint")
    admin_table: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    if not admin_table:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")
    if not admin_table.is_admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not authorized admin")

    query = db.query(CrowdFundProjectTable)
    
    filter_conditions = []

    if filters.name:
        filter_conditions.append(CrowdFundProjectTable.name.ilike(f"%{filters.name}%"))  
    if filters.status:
        filter_conditions.append(CrowdFundProjectTable.status == filters.status)
    if filters.funding_model:
        filter_conditions.append(CrowdFundProjectTable.funding_model == filters.funding_model)

    if filter_conditions:
        query = query.filter(and_(*filter_conditions))
    
    cfp_tables = query.all()

    admin_cfp_summary_schema_list: List[AdminCFPSummarySchema] = [transform_to_admin_cfp_summary_schema_from_admin_user_tables(cfp_table ,admin_table) for cfp_table in cfp_tables]
    return admin_cfp_summary_schema_list


