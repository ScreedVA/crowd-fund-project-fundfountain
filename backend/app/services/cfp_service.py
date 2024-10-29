from models import CrowdFundProject
from schemas import CrowdFundProjectSummary, ReadCrowdFundProject
from datetime import datetime

def transform_cfp_summary_from_model(model: CrowdFundProject) -> CrowdFundProjectSummary:
    schema: CrowdFundProjectSummary = CrowdFundProjectSummary(
        id=model.id,
        name=model.name,
        description=model.description
    )
    
    return schema

def transform_cfp_details_from_model(model: CrowdFundProject) -> ReadCrowdFundProject:

    schema: ReadCrowdFundProject = ReadCrowdFundProject(
        id=model.id,
        name=model.name,
        description=model.description,
        fund_goal=model.fund_goal,
        current_fund=model.current_fund,
        start_date=datetime.strftime(model.start_date, "%Y-%m-%d"),
        last_date=datetime.strftime(model.last_date, "%Y-%m-%d"),
        total_units=model.total_units,
        valuation=model.valuation,
        status=model.status,
        funding_model=model.funding_model,
        funding_progress=float(model.funding_progress)
    )
    return schema
