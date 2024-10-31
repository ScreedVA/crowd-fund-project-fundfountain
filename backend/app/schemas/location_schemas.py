from pydantic import BaseModel, Field
from typing import Optional

class LocationBaseModel(BaseModel):
    street: Optional[str] = None
    plz: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    house_number: Optional[str] = Field(None, alias="houseNumber")

    class Config:
        populate_by_name = True

class UpdateLocationRequest(LocationBaseModel):
    pass

class CreateLocationRequest(LocationBaseModel):
    pass

class ReadLocationRequest(LocationBaseModel):
    pass

