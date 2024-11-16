from models import UserTable
from schemas import ReadUserRequest, ReadUserSummarySchema
from datetime import datetime

def transform_to_user_summary_schema_from_model(user: UserTable) -> ReadUserSummarySchema:

    read_user_sum_request = ReadUserSummarySchema(

        id=user.id,
        username=user.username.title(),
        is_admin=user.is_admin,
        biography=user.biography
    )

    return read_user_sum_request

def transform_to_read_user_schema_from_model(user: UserTable) -> ReadUserRequest:

    read_user_request = ReadUserRequest(
        id=user.id,
        username=user.username.title(),
        biography=user.biography,
        email=user.email,
        first_name=user.first_name.title(),
        last_name=user.last_name.title(),
        date_of_birth=datetime.strftime(user.date_of_birth, "%Y-%m-%d"),
        back_account_balance=user.bank_account_balance,
        is_admin=user.is_admin,

    )       
    
    return read_user_request


