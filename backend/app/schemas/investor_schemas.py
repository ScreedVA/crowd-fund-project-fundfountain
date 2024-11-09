from pydantic import BaseModel, Field
from typing import Optional


class InvestorShareSummarySchema(BaseModel):
    investor_name: str = Field(alias="investorName")
    project_name: str = Field(alias="projectName")
    investor_id: int = Field(alias="investorId")
    project_id: int = Field(alias="projectId")
    share_percentage: float = Field(0.0, alias="sharePercentage")


    class Config:
        populate_by_name = True

class BalanceDetailSchema(BaseModel):
    user_id: int = Field(alias="userId")
    bank_account_balance: int = Field(alias="bankAccountBalance")
    balance_spent: int = Field(alias="balanceSpent")

    class Config:
        populate_by_name = True
class InvestorBalanceDistributionSchema(BaseModel):
    investor_id: int = Field(alias="investorId")
    project_id: int = Field(alias="projectId")
    project_name: str = Field(alias="projectName")
    total_investment: int = Field(0, alias="totalInvestment")
    ratio_percentage: float = Field(0.0, alias="ratioPercentage")

    class Config:
        populate_by_name = True

class InvestRequest(BaseModel):
    micro_investment_amount: Optional[int] = Field(None, alias="microInvestmentAmount")
    units_to_invest: Optional[int] = Field(None, alias="unitsToInvest")

