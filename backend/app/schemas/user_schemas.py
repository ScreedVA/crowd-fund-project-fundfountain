from pydantic import BaseModel, Field
from typing import Optional
from .location_schemas import CreateLocationRequest, ReadLocationRequest

class ReadUserSummary(BaseModel):
    id: int
    username: str = Field(min_length=3)
    is_admin: bool
    is_project_owner: bool
    is_investor: bool


class UserBaseModel(BaseModel):
    username: str = Field(min_length=3)
    email: str = Field(min_length=3)
    first_name: Optional[str] = Field(None, alias="firstName")
    last_name: Optional[str] = Field(None, alias="lastName") 
    date_of_birth: str = Field(..., alias="dateOfBirth")
    is_admin: bool = Field(False, alias="isAdmin")
    is_project_owner: bool = Field(False, alias="isProjectOwner")
    is_investor: bool = Field(False, alias="isInvestor")

    class Config:
        populate_by_name = True


class CreateUserRequest(UserBaseModel):
    password: str = Field(min_length=3)
    location: Optional[CreateLocationRequest] = None


class UpdateUserRequest(UserBaseModel):
    location: Optional[CreateLocationRequest] = None


class ReadUserRequest(UserBaseModel):
    id: int 
    location: Optional[ReadLocationRequest] = None

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str

class RefreshTokenRequest(BaseModel): 
    refresh_token: str
