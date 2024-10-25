from models import User, Location
from schemas.user_schemas import ReadUserRequest, CreateLocationRequest, ReadUserSummary
from schemas.location_schemas import ReadLocationRequest, CreateLocationRequest
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



def transform_location_from_model(location: Location) -> ReadLocationRequest:


    read_location_request = ReadLocationRequest(
        id=location.id,
        street=location.street,
        plz=location.plz,
        country=location.country,
        city=location.city,
        houseNumber=location.house_number

    )

    return read_location_request


def transform_location_from_req(create_location_request: CreateLocationRequest) -> Location:

    create_location_model = Location(
        street=create_location_request.street,
        plz=create_location_request.plz,
        country=create_location_request.country,
        city=create_location_request.city,
        house_number=create_location_request.house_number
    )

    return create_location_model
    
