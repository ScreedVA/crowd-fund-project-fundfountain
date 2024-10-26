from models import Location
from schemas.user_schemas import CreateLocationRequest
from schemas import ReadLocationRequest, CreateLocationRequest


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
