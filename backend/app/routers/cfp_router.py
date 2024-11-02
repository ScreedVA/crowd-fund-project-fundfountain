from fastapi import APIRouter, Depends, HTTPException
from sessions import SessionLocal
from sqlalchemy.orm import Session
from models import CrowdFundProject, Investment, Location, CrowdFundProjectLocation
from schemas import CrowdFundProjectSummary, ReadCrowdFundProject, InvestRequest, CreateCFProject, ReadLocationRequest, UpdateCFProject
from enums import FundingModel, InvestmentStatus
from services import transform_cfp_summary_from_model, transform_to_cfp_details_schema_from_model, validate_project_fields, transform_to_model_from_cfp_create_schema, transform_to_location_model_from_req, transform_to_location_read_schema_from_model
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

@router.get('/list/byCurrentUser', response_model=list[CrowdFundProjectSummary], status_code=status.HTTP_200_OK)
async def read_all_projects(db: db_dependency, user: user_dependency):
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cannot retrieve projects from this user")
    cfp_models: list[CrowdFundProject] = db.query(CrowdFundProject).filter(CrowdFundProject.owner_id == user["id"]).all()
    cfp_response = [transform_cfp_summary_from_model(model) for model in cfp_models]

    return cfp_response

@router.get("/{project_id}", response_model=ReadCrowdFundProject)
async def read_project_by_id(project_id: int, db: db_dependency):
    cfp_model: CrowdFundProject = db.query(CrowdFundProject).filter(CrowdFundProject.id == project_id).first()

    cfp_response = transform_to_cfp_details_schema_from_model(cfp_model)

    if cfp_model.bridge_locations:
        location_model = db.query(Location).filter(Location.id == cfp_model.bridge_locations[0].location_id).first()
        location_response: ReadLocationRequest = transform_to_location_read_schema_from_model(location_model)
        cfp_response.location = location_response

    return cfp_response

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_project(db: db_dependency, user: user_dependency,  request: CreateCFProject,):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot create new project")
    if not request:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unprocessable entity, invalid create project request body")

    validate_project_fields(request)
    
    cfp_model:CrowdFundProject = transform_to_model_from_cfp_create_schema(request)
    cfp_model.owner_id = user["id"]

    cfp_model.update_valuation()
    cfp_model.update_progress()
    db.add(cfp_model)
    db.commit()
    db.refresh(cfp_model)

    if request.location:
        location_model: Location = transform_to_location_model_from_req(request.location)
        db.add(location_model)
        db.commit()
        db.refresh(location_model)

        bridge_cfp_location_model = CrowdFundProjectLocation(
            crowd_fund_project_id=cfp_model.id,
            location_id=location_model.id
        )

        db.add(bridge_cfp_location_model)
        db.commit()



@router.put("/{project_id}", status_code=status.HTTP_201_CREATED)
async def update_project(request: UpdateCFProject, project_id: int,user: user_dependency, db: db_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot invest into this project")
    if not request:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unprocessable entity, invalid invest request body")
    
    cfp_model_list_by_owner: list[CrowdFundProject] = db.query(CrowdFundProject).filter(CrowdFundProject.owner_id == user["id"]).all()
    cfp_model: CrowdFundProject = db.query(CrowdFundProject).filter(CrowdFundProject.id == project_id).first()

    if cfp_model not in cfp_model_list_by_owner:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot update this project")

    cfp_model.update_from_request(request)
    
    if cfp_model.bridge_locations:
        location = db.query(Location).filter(Location.id == cfp_model.bridge_locations[0].location_id).first()
        location.update_from_request(request.location) 

    db.add(cfp_model)
    db.add(location)
    db.commit()

    

@router.put("/invest/{project_id}", status_code=status.HTTP_201_CREATED)
async def invest(project_id: int, invest_request: InvestRequest, db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot invest into this project")
    
    cfp_model: CrowdFundProject = db.query(CrowdFundProject).filter(CrowdFundProject.id == project_id).first()

    if not invest_request:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unprocessable entity, invalid invest request body")
    
    if cfp_model.funding_model == FundingModel.FIXED_PRICE and invest_request.unit_count:
        if invest_request.unit_count > cfp_model.total_units:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST_INTERNAL_SERVER_ERROR, detail="Bad Request Error, Units to invest exceed total units")
        cfp_model.invest_fixed_price(invest_request.unit_count)
        
    elif cfp_model.funding_model == FundingModel.MICRO_INVESTMENT and invest_request.amount:
        if invest_request.amount < 1000:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad Request Error, Micro-investment must be atleast 1000")

        cfp_model.invest_micro_investment(invest_request.amount)

    db.add(cfp_model)
    db.commit()
    db.refresh(cfp_model)
    
    investment_bridge_model: Investment = Investment(
        crowd_fund_project_id=cfp_model.id,
        investor_id=user["id"],
        status=InvestmentStatus.PAID,
    )

    if cfp_model.funding_model == FundingModel.FIXED_PRICE:
        investment_bridge_model.unit_count = invest_request.unit_count

    elif cfp_model.funding_model == FundingModel.MICRO_INVESTMENT:
        share_percentage = round((invest_request.amount / cfp_model.valuation) * 100, 2)
        investment_bridge_model.share_percentage = share_percentage

    db.add(investment_bridge_model)
    db.commit()
    db.refresh(investment_bridge_model)
    return {"investmentBridgeModel": investment_bridge_model}




    





    







