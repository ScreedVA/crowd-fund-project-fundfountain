
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sessions import SessionLocal
from sqlalchemy.orm import Session
from models import CrowdFundProjectTable, Investment, UserTable
from schemas import InvestRequest, InvestorShareSummaryModel
from enums import FundingModel, InvestmentStatus
from .auth_router import get_current_user
from typing import Annotated
from starlette import status



router = APIRouter(
    prefix='/investor',
    tags=['investor']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.put("/invest/{project_id}", status_code=status.HTTP_201_CREATED)
async def invest(project_id: int, invest_request: InvestRequest, db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot invest into this project")
    
    cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == project_id).first()

    if not invest_request:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unprocessable entity, invalid invest request body")
    
    if cfp_model.funding_model == FundingModel.FIXED_PRICE and invest_request.units_to_invest:
        if invest_request.units_to_invest > cfp_model.total_units:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST_INTERNAL_SERVER_ERROR, detail="Bad Request Error, Units to invest exceed total units")
        cfp_model.invest_fixed_price(invest_request.units_to_invest)
        
    elif cfp_model.funding_model == FundingModel.MICRO_INVESTMENT and invest_request.micro_investment_amount:
        if invest_request.micro_investment_amount < 1000:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad Request Error, Micro-investment must be atleast 1000")

        cfp_model.invest_micro_investment(invest_request.micro_investment_amount)

    db.add(cfp_model)
    db.commit()
    db.refresh(cfp_model)
    
    investment_bridge_model: Investment = Investment(
        crowd_fund_project_id=cfp_model.id,
        investor_id=user["id"],
        status=InvestmentStatus.PAID,
    )

    if cfp_model.funding_model == FundingModel.FIXED_PRICE:
        investment_bridge_model.unit_count = invest_request.units_to_invest
        share_percentage = round((invest_request.units_to_invest / (cfp_model.valuation // cfp_model.unit_price)) * 100, 2)
        investment_bridge_model.share_percentage = share_percentage

    elif cfp_model.funding_model == FundingModel.MICRO_INVESTMENT:
        share_percentage = round((invest_request.micro_investment_amount / cfp_model.valuation) * 100, 2)
        investment_bridge_model.share_percentage = share_percentage

    db.add(investment_bridge_model)
    db.commit()




@router.get("/shareList")
async def get_investor_to_cfp_share_list(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    user_table: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    
    if not user_table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found, cannot retrieve user from database")
    if not user_table.bridge_investments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User investments not Found, cannot retrieve investment table list from database")

    unique_cfp_id_list: list[int] = list(dict.fromkeys(invest_bridge.crowd_fund_project_id for invest_bridge in user_table.bridge_investments))
    investor_to_cfp_shares: list[InvestorShareSummaryModel] = []

    for cfp_id in unique_cfp_id_list:
        # Retrieve the project from the database
        cfp_name = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first().name

        # Initialize an InvestorShareSummaryModel for each unique project
        investor_to_cfp_shares.append(
        InvestorShareSummaryModel(
            investor_name=user_table.username,
            investor_id=user_table.id,
            project_name=cfp_name,
            project_id=cfp_id,
            share_percentage=0.0  # Initialize with 0.0, will accumulate below
        )
        )

    for investor_share in investor_to_cfp_shares:
        for invest_bridge in user_table.bridge_investments:
            if investor_share.project_id == invest_bridge.crowd_fund_project_id:
                investor_share.share_percentage = round(investor_share.share_percentage + float(invest_bridge.share_percentage), 2)
        

    return investor_to_cfp_shares





    # cfp_table_list: CrowdFundProjectTable = db.query(CrowdFundProjectTable.id == user_table)



@router.get("/testInvestmentTableByUser/{user_id}")
async def test_investment_table_by_user(user_id: int, db:db_dependency):
    return db.query(Investment).filter(Investment.investor_id == user_id).all()



@router.get("/testInvestmentTableByProject/{project_id}")
async def test_investment_table_by_project(project_id: int, db:db_dependency):
    return db.query(Investment).filter(Investment.crowd_fund_project_id == project_id).all()

