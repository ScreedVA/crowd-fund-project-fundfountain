from pydantic import BaseModel, Field
from typing import Optional
class RevenueBaseModel(BaseModel):
    id: Optional[int] = Field(None)
    project_id: int = Field(alias="projectId")

    class Config:
        populate_by_name = True

class RevenueEntryListSchema(RevenueBaseModel):
    date_list: list[str] = Field(alias="dateList")
    amount_list: list[float] = Field(alias="amountList")
    
class RevenueSummarySchema(RevenueBaseModel):
    revenue_aggregate_total: float = Field(default=0.0 ,alias="revenueAggregateTotal")
    revenue_entry_count: int = Field(default=0, alias="revenueEntryCount")

class RevenueEntrySchema(RevenueBaseModel):
    date: str
    amount: float
    file_id_list: Optional[list[int]] = Field(None, alias="fileIdList")

class CreateRevenueReportFormDataSchema(BaseModel):
    distribution_date: str = Field(alias="distributionDate")
    amount: float

    class Config:
        populate_by_name = True
