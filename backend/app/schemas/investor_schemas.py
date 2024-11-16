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

class InvestorToProjectBridgeBase(BaseModel):
    investor_id: int = Field(alias="investorId")
    project_id: int = Field(alias="projectId")
    project_name: str = Field(alias="projectName")
    investor_name: str = Field(alias="investorName")
    class Config:
        populate_by_name = True


class InvestorBalanceDistributionToProjectsSchema(InvestorToProjectBridgeBase):
    total_investment_against_investor_balance_amount: int = Field(0, alias="totalInvestmentAgainstInvestorBalanceAmount")
    total_investment_against_investor_balance_percentage: float = Field(0.0, alias="totalInvestmentAgainstInvestorBalancePercentage")

class ProjectShareDistributionToInvestorsSchema(InvestorToProjectBridgeBase):
    shares_against_project_valuation_amount: int = Field(0, alias="sharesAgainstProjectValuationAmount")
    shares_against_project_valuation_percentage: float = Field(0.0, alias="sharesAgainstProjectValuationPercentage")  

class InvestRequest(BaseModel):
    micro_investment_amount: Optional[int] = Field(None, alias="microInvestmentAmount")
    units_to_invest: Optional[int] = Field(None, alias="unitsToInvest")

