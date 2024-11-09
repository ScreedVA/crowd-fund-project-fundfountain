from pydantic import BaseModel, Field
from typing import Optional
from enums import ProjectStatus, FundingModel
from .location_schemas import ReadLocationRequest


class CrowdFundProjectSummary(BaseModel):
    id : int
    name: str = Field(min_length=3)
    description: str = Field(min_length=3)
    status: ProjectStatus

class CrowdFundProjectBaseModel(BaseModel):
    name: str = Field(min_length=3)
    description: str = Field(min_length=3)

    class Config:
        populate_by_name = True

class ReadCrowdFundProject(CrowdFundProjectBaseModel):
    id: int
    valuation: int 
    current_fund: int = Field(None, alias="currentFund")
    funding_model: FundingModel = Field(None, alias="fundingModel")
    fund_goal: int  = Field(None, gt=999, alias="fundGoal")
    total_units: Optional[int] = Field(None, alias="totalUnits")
    funding_progress: Optional[float] = Field(0.0, alias="fundingProgress")
    unit_price: int = Field(None, alias="unitPrice")
    start_date: str = Field(..., alias="startDate")
    last_date: str = Field(..., alias="lastDate")
    status: ProjectStatus
    location: Optional[ReadLocationRequest] = Field(None)

class CreateCFProject(CrowdFundProjectBaseModel):
    start_date: str = Field(..., alias="startDate")
    last_date: str = Field(..., alias="lastDate")
    unit_price: int = Field(None, gt=999,alias="unitPrice")
    funding_model: FundingModel = Field(None, alias="fundingModel")
    fund_goal: int  = Field(None, gt=1999, alias="fundGoal")
    status: ProjectStatus
    location: Optional[ReadLocationRequest] = Field(None)

class UpdateCFProject(CrowdFundProjectBaseModel):
    location: Optional[ReadLocationRequest] = Field(None)


