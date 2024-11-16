from pydantic import BaseModel, Field
from typing import Optional
from .location_schemas import CreateLocationRequest, ReadLocationRequest

class ReadUserSummarySchema(BaseModel):
    id: int
    username: str = Field(min_length=3)
    is_admin: bool = Field(alias="isAdmin")
    biography: Optional[str] 

    class Config:
        populate_by_name = True


class UserBaseModel(BaseModel):
    username: str = Field(min_length=3)
    email: str = Field(min_length=3)
    biography: str
    first_name: Optional[str] = Field(None, alias="firstName")
    last_name: Optional[str] = Field(None, alias="lastName") 
    date_of_birth: str = Field(..., alias="dateOfBirth")
    is_admin: bool = Field(False, alias="isAdmin")
    
    class Config:
        populate_by_name = True


class CreateUserRequest(UserBaseModel):
    password: str = Field(min_length=3)
    location: Optional[CreateLocationRequest] = None


class UpdateUserRequest(UserBaseModel):
    location: Optional[CreateLocationRequest] = None


class ReadUserRequest(UserBaseModel):
    id: int
    bank_account_balance: Optional[int] = None 
    location: Optional[ReadLocationRequest] = None

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str

class RefreshTokenRequest(BaseModel): 
    refresh_token: str
