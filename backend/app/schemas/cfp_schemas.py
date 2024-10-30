from pydantic import BaseModel, Field
from typing import Optional
from enums import ProjectStatus, FundingModel
from .location_schemas import ReadLocationRequest


class CrowdFundProjectSummary(BaseModel):
    id : int
    name: str = Field(min_length=3)
    description: str =Field(min_length=3)

class CrowdFundProjectBaseModel(BaseModel):
    name: str = Field(min_length=3)
    description: str = Field(min_length=3)
    fund_goal: int  = Field(None, alias="fundGoal")
    current_fund: int = Field(None, alias="currentFund")
    start_date: str = Field(..., alias="startDate")
    last_date: str = Field(..., alias="lastDate")
    total_units: Optional[int] = Field(None, alias="totalUnits")
    unit_price: int = Field(None, alias="unitPrice")
    valuation: int 
    status: ProjectStatus
    funding_model: FundingModel = Field(None, alias="fundingModel")
    funding_progress: Optional[float] = Field(0.0, alias="fundingProgress")

    class Config:
        populate_by_name = True

class ReadCrowdFundProject(CrowdFundProjectBaseModel):
    id: int
    location: Optional[ReadLocationRequest] = Field(None)


class InvestRequest(BaseModel):
    amount: Optional[int] = Field(None)
    unit_count: Optional[int] = Field(None, alias="unitCount")

