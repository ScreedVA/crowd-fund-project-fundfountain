
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated, List
from sessions import SessionLocal
from sqlalchemy.orm import Session
from models import CrowdFundProjectTable, InvestmentBridge, UserTable
from schemas import InvestRequest, InvestorShareSummarySchema, BalanceDetailSchema, InvestorBalanceDistributionToProjectsSchema, ProjectShareDistributionToInvestorsSchema, ReadUserSummarySchema
from services import transform_to_balance_details_schema_from_user_model, transform_to_user_summary_schema_from_model
from enums import FundingModel, InvestmentStatus, ProjectStatus
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
async def invest(project_id: int, request: InvestRequest, db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot invest into this project")
    
    ## Update User and CFP Table
    user_model: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == project_id).first()

    if not user_model:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User table not found in database")
    
    if not cfp_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if not request:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unprocessable entity, invalid invest request body")
    
    if cfp_model.funding_model == FundingModel.FIXED_PRICE and request.units_to_invest:
        if request.units_to_invest > cfp_model.total_units:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST_INTERNAL_SERVER_ERROR, detail="Bad Request Error, Units to invest exceed total units")
        cfp_model.invest_fixed_price(request.units_to_invest)
        user_model.withdraw_balance(request.units_to_invest * cfp_model.unit_price)
        
    elif cfp_model.funding_model == FundingModel.MICRO_INVESTMENT and request.micro_investment_amount:
        if request.micro_investment_amount < 1000:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad Request Error, Micro-investment must be atleast 1000")
        cfp_model.invest_micro_investment(request.micro_investment_amount)
        user_model.withdraw_balance(request.micro_investment_amount)

    if cfp_model.funding_progress == 100:
        cfp_model.status = ProjectStatus.FUNDED
        
    db.add(user_model)
    db.add(cfp_model)
    db.commit()
    db.refresh(cfp_model)
    db.refresh(user_model)
    

    # Initialize Investment Table
    investment_bridge_model: InvestmentBridge = InvestmentBridge(
        crowd_fund_project_id=cfp_model.id,
        investor_id=user_model.id,
        status=InvestmentStatus.PAID,
    )

    if cfp_model.funding_model == FundingModel.FIXED_PRICE:
        investment_bridge_model.unit_count = request.units_to_invest
        share_percentage = round((request.units_to_invest / (cfp_model.valuation // cfp_model.unit_price)) * 100, 2)
        investment_bridge_model.share_percentage = share_percentage
        investment_bridge_model.transaction_amount = request.units_to_invest * cfp_model.unit_price

    elif cfp_model.funding_model == FundingModel.MICRO_INVESTMENT:
        share_percentage = round((request.micro_investment_amount / cfp_model.valuation) * 100, 2)
        investment_bridge_model.share_percentage = share_percentage
        investment_bridge_model.transaction_amount = request.micro_investment_amount

    db.add(investment_bridge_model)
    db.commit()

@router.get("/current/shareList", response_model=List[InvestorShareSummarySchema])
async def get_investor_to_cfp_share_list(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    user_table: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    
    if not user_table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found, cannot retrieve user from database")
    if not user_table.bridge_investments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User investments not Found, cannot retrieve investment table list from database")

    unique_cfp_id_list: list[int] = list(dict.fromkeys(invest_bridge.crowd_fund_project_id for invest_bridge in user_table.bridge_investments))
    investor_to_cfp_shares: list[InvestorShareSummarySchema] = []

    for cfp_id in unique_cfp_id_list:
        # Retrieve the project from the database
        cfp_name = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first().name

        # Initialize an InvestorShareSummaryModel for each unique project
        investor_to_cfp_shares.append(
        InvestorShareSummarySchema(
            investor_name=user_table.username,
            investor_id=user_table.id,
            project_name=cfp_name,
            project_id=cfp_id,
            share_percentage=0.0 
            )
        )

    for investor_share in investor_to_cfp_shares:
        for invest_bridge in user_table.bridge_investments:
            if investor_share.project_id == invest_bridge.crowd_fund_project_id:
                investor_share.share_percentage = round(investor_share.share_percentage + float(invest_bridge.share_percentage), 2)
        
    return investor_to_cfp_shares

@router.get("/current/list/investorToProjectsBalanceDistribution", response_model=List[InvestorBalanceDistributionToProjectsSchema])
async def get_investment_balance_distribution(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    
    user_model: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")
    
    unique_cfp_id_list: list[int] = list(dict.fromkeys(invest_bridge.crowd_fund_project_id for invest_bridge in user_model.bridge_investments))
    invest_distribution_schema_list: list[InvestorBalanceDistributionToProjectsSchema] = []
    for cfp_id in unique_cfp_id_list:
        cfp_name = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first().name
        

        invest_distribution_schema_list.append(
        InvestorBalanceDistributionToProjectsSchema(
            investorId=user_model.id,
            investorName=user_model.username,
            projectId=cfp_id,
            projectName=cfp_name,
        )
        )

    for invest_distribution_schema in invest_distribution_schema_list:
        for bridge_invest in user_model.bridge_investments:
            if invest_distribution_schema.project_id == bridge_invest.crowd_fund_project_id:
                invest_distribution_schema.total_investment_against_investor_balance_amount += bridge_invest.transaction_amount
                invest_distribution_schema.total_investment_against_investor_balance_percentage += round(bridge_invest.transaction_amount / user_model.balance_spent * 100, 2)

    return invest_distribution_schema_list
    

@router.get("/list/projectInvestorShareDistribution/byProject/{cfp_id}")
async def get_investor_share_list_by_project(db: db_dependency, user: user_dependency, cfp_id: int):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first()
    
    unique_investor_id_list: List[int] = list(dict.fromkeys(invest_bridge.investor_id for invest_bridge in cfp_model.bridge_investments))
    cfp_share_distribution_schema_list: List[ProjectShareDistributionToInvestorsSchema] = []
    
    for investor_id in unique_investor_id_list:
        investor_username = db.query(UserTable).filter(UserTable.id == investor_id).first().username

        cfp_share_distribution_schema_list.append(
            ProjectShareDistributionToInvestorsSchema(
                investorId=investor_id,
                investorName=investor_username,
                project_id=cfp_model.id,
                projectName=cfp_model.name
            )
        )
    for cfp_share_distribution_schema in cfp_share_distribution_schema_list:
        for invest_bridge in cfp_model.bridge_investments:
            if invest_bridge.investor_id == cfp_share_distribution_schema.investor_id:
                cfp_share_distribution_schema.shares_against_project_valuation_amount += invest_bridge.transaction_amount
                cfp_share_distribution_schema.shares_against_project_valuation_percentage += round(invest_bridge.transaction_amount / cfp_model.valuation * 100, 2)
    
    return cfp_share_distribution_schema_list

@router.get("/current/balanceDetails", response_model=BalanceDetailSchema)
async def get_balance_details(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    
    user_model: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    
    return transform_to_balance_details_schema_from_user_model(user_model)

@router.get("/list/investor/byProject/{cfp_id}", response_model=List[ReadUserSummarySchema])
async def get_investor_list(db: db_dependency, user: user_dependency, cfp_id: int):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    
    cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first()
    unique_investor_id_list: List[int] = list(dict.fromkeys(invest_bridge.investor_id for invest_bridge in cfp_model.bridge_investments))
    investor_list: List[ReadUserSummarySchema] = []

    for investor_id in unique_investor_id_list:
        investor_table: ReadUserSummarySchema = transform_to_user_summary_schema_from_model(db.query(UserTable).filter(UserTable.id == investor_id).first())

        investor_list.append(investor_table)

    return investor_list


@router.get("/testInvestmentTableByUser/{user_id}")
async def test_investment_table_by_user(user_id: int, db:db_dependency):
    return db.query(InvestmentBridge).filter(InvestmentBridge.investor_id == user_id).all()

@router.get("/testInvestmentTableByProject/{project_id}")
async def test_investment_table_by_project(project_id: int, db:db_dependency):
    return db.query(InvestmentBridge).filter(InvestmentBridge.crowd_fund_project_id == project_id).all()

