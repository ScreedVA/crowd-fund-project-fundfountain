from pydantic import BaseModel, Field


class RevenueBaseModel(BaseModel):
    project_id: int = Field(alias="projectId")
    project_name: str = Field(alias="projectName")
    project_owner_id: int = Field(alias="projectOwnerId")
    project_owner_username: str = Field(alias="projectOwnerName")

    class Config:
        populate_by_name = True


class RevenueEntriesSchema(RevenueBaseModel):
    date_list: list[str] = Field(alias="dateList")
    amount_list: list[int] = Field(alias="amountList")
    

class RevenueSummarySchema(RevenueBaseModel):
    revenue_aggregate_total: float = Field(default=0.0 ,alias="revenueAggregateTotal")
    revenue_entry_count: int = Field(default=0, alias="revenueEntryCount")