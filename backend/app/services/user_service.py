from models import User
from schemas import ReadUserRequest, ReadUserSummary
from datetime import datetime

def transform_user_sum_from_model(user: User) -> ReadUserSummary:

    read_user_sum_request = ReadUserSummary(

        id=user.id,
        username=user.username,
        is_admin=user.is_admin,
        is_project_owner=user.is_project_owner,
        is_investor=user.is_investor
    )

    return read_user_sum_request

def transform_user_from_model(user: User):

    read_user_request = ReadUserRequest(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        date_of_birth= datetime.strftime(user.date_of_birth, "%Y-%m-%d"),
        is_admin=user.is_admin,
        is_investor=user.is_investor,
        is_project_owner=user.is_project_owner

    )
    
    return read_user_request


