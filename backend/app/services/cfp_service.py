from fastapi import HTTPException
from starlette import status
from models import CrowdFundProjectTable
from schemas import CrowdFundProjectSummary, ReadCrowdFundProject, CreateCFProject, UpdateCFProject
from datetime import datetime

def transform_to_cfp_summary_schema_from_model(model: CrowdFundProjectTable) -> CrowdFundProjectSummary:
    schema: CrowdFundProjectSummary = CrowdFundProjectSummary(
        id=model.id,
        name=model.name,
        description=f"{model.description[0:80]}...",
        status=model.status,
        funding_model=model.funding_model,
        owner_id=model.owner_id
    )
    
    return schema

def transform_to_cfp_details_schema_from_model(model: CrowdFundProjectTable) -> ReadCrowdFundProject:

    schema: ReadCrowdFundProject = ReadCrowdFundProject(
        id=model.id,
        name=model.name,
        description=model.description,
        fund_goal=model.fund_goal,
        current_fund=model.current_fund,
        start_date=datetime.strftime(model.start_date, "%Y-%m-%d"),
        last_date=datetime.strftime(model.last_date, "%Y-%m-%d"),
        total_units=model.total_units,
        unit_price=model.unit_price,
        valuation=model.valuation,
        status=model.status,
        funding_model=model.funding_model,
        funding_progress=float(model.funding_progress),
        owner_id=model.owner_id
    )
    return schema

def transform_to_model_from_cfp_create_schema(request: CreateCFProject):

    model: CrowdFundProjectTable = CrowdFundProjectTable(
        name=request.name,
        description=request.description,
        fund_goal=request.fund_goal,
        start_date=datetime.strptime(request.start_date, "%Y-%m-%d"),
        last_date=datetime.strptime(request.last_date, "%Y-%m-%d"),
        unit_price=request.unit_price,
        funding_model=request.funding_model,
        status=request.status
    )

    return model

def validate_project_fields(request: CreateCFProject | UpdateCFProject):
    if request.fund_goal < 2000:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad Request Error, Fund Goal must be atleast 2000")
    if request.unit_price < 1000:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad Request Error, Unit price must be atleast 1000")
    if request.fund_goal <= request.unit_price:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad Request Error, Fund Goal exceed Unit Price")
    if datetime.strptime(request.start_date, "%Y-%m-%d") > datetime.strptime(request.last_date, "%Y-%m-%d"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad Request Error, Start date must not exceed last date")
