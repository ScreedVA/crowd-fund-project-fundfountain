from pydantic import BaseModel, Field
from typing import Optional


class InvestorShareSummaryModel(BaseModel):
    investor_name: str = Field(alias="investorName")
    project_name: str = Field(alias="projectName")
    investor_id: int = Field(alias="investorId")
    project_id: int = Field(alias="projectId")
    share_percentage: float = Field(0.0, alias="sharePercentage")


    class Config:
        populate_by_name = True

class InvestRequest(BaseModel):
    micro_investment_amount: Optional[int] = Field(None, alias="microInvestmentAmount")
    units_to_invest: Optional[int] = Field(None, alias="unitsToInvest")


