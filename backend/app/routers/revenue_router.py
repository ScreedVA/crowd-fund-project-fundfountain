from fastapi import APIRouter, Depends, HTTPException
from sessions import SessionLocal
from sqlalchemy.orm import Session
from .auth_router import get_current_user
from typing import Annotated, List
from starlette import status
from models import UserTable, CrowdFundProjectTable
from schemas import RevenueEntriesSchema
from datetime import datetime
from enums import ProjectStatus

router = APIRouter(
    prefix='/revenue',
    tags=['revenue']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/current/daily/entries/{number_of_days}", response_model=List[RevenueEntriesSchema])
async def get_revenue_entries(db: db_dependency, user: user_dependency, number_of_days: int = 7):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    
    user_model: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")
    
    unique_cfp_id_list: list[int] = list(dict.fromkeys(invest_bridge.crowd_fund_project_id for invest_bridge in user_model.bridge_investments))
    revenue_entries_schema_list: list[RevenueEntriesSchema] = []
    for cfp_id in unique_cfp_id_list:

        cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first()
        # Only create entries schema if project is funded
        if cfp_model.status == ProjectStatus.FUNDED:
            revenue_entries_schema = RevenueEntriesSchema(
                project_id=cfp_model.id,
                project_name=cfp_model.name,
                dateList=[],
                amountList=[]
            )
            
            # Poplate dateList and amountList
            for i in range(0, number_of_days):
                if len(cfp_model.revenue_list) >= number_of_days:
                    revenue_entries_schema.date_list.append(datetime.strftime(cfp_model.revenue_list[i].distribution_date, "%Y-%m-%d"))
                    revenue_entries_schema.amount_list.append(cfp_model.revenue_list[i].amount)
                
             # Only include revenue_entries with a history of atleast 7 days   
            if len(revenue_entries_schema.date_list) == number_of_days:
                revenue_entries_schema_list.append(revenue_entries_schema)
    return revenue_entries_schema_list     

@router.get("/current/weekly/distribution")
async def get_revenue_entries(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    
    user_model: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")


