from pydantic import Field, BaseModel
from .user_schemas import ReadUserSummarySchema
from .cfp_schemas import CrowdFundProjectSummary
from typing import Optional

class UserIsAdminSchema(BaseModel):
    is_admin: bool = Field(alias="isAdmin")

    class Config:
        populate_by_name = True

class RequestingAdminSchema(BaseModel):
    admin_id: int = Field(alias="adminId")
    admin_username: str = Field(alias="adminUsername")

    class Config:
        populate_by_name = True

class AdminBaseModel(BaseModel):
    admin_details: RequestingAdminSchema


class AdminUserSummarySchema(AdminBaseModel, ReadUserSummarySchema):
    pass

class AdminCFPSummarySchema(AdminBaseModel, CrowdFundProjectSummary):
    pass


class AdminCFPResourcePermissionsSchema(BaseModel):
    owner_can_edit: Optional[bool] = Field(default=False, alias="ownerCanEdit")
    admin_can_edit: Optional[bool] = Field(default=False, alias="adminCanEdit")
    can_report_revenue: Optional[bool] = Field(default=False, alias="canReportRevenue")

    class Config:
        populate_by_name = True
