from pydantic import BaseModel, Field
from typing import Optional
from enums import ProjectStatus, FundingModel

class filterBaseModel(BaseModel):
    name: Optional[str] = Field(None)

    class Config:
        populate_by_name = True


class cfpFilterSchema(filterBaseModel):
    status: Optional[ProjectStatus]  = Field(None)
    funding_model: Optional[FundingModel] = Field(None, alias="fundingModel")


class userFilterSchema(filterBaseModel):
    pass