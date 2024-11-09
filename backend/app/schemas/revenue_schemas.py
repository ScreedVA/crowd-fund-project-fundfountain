from pydantic import BaseModel, Field


class RevenueEntriesSchema(BaseModel):
    project_id: int = Field(alias="projectId")
    project_name: str = Field(alias="projectName")
    date_list: list[str] = Field(alias="dateList")
    amount_list: list[int] = Field(alias="amountList")
    
    class Config:
        populate_by_name = True
