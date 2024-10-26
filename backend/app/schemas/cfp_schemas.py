from pydantic import BaseModel, Field
from typing import Optional



class CrowdFundProjectSummary(BaseModel):
    id : int
    name: str
    description: str