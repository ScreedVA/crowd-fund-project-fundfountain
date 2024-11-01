from models import User
from schemas import ReadUserRequest, ReadUserSummary
from datetime import datetime

def transform_to_user_summary_schema_from_model(user: User) -> ReadUserSummary:

    read_user_sum_request = ReadUserSummary(

        id=user.id,
        username=user.username,
        is_admin=user.is_admin,
    )

    return read_user_sum_request

def transform_to_read_user_schema_from_model(user: User) -> ReadUserRequest:

    read_user_request = ReadUserRequest(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        date_of_birth=datetime.strftime(user.date_of_birth, "%Y-%m-%d"),
        back_account_balance=user.bank_account_balance,
        is_admin=user.is_admin,        
    )       
    
    return read_user_request


