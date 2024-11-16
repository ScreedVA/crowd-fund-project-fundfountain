from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sessions import SessionLocal
from starlette import status
from models import UserTable, Location
from .auth_router import get_current_user
from schemas.user_schemas import UpdateUserRequest
from services import transform_to_read_user_schema_from_model, transform_to_location_read_schema_from_model, transform_to_user_summary_schema_from_model

router = APIRouter(
    prefix='/user',
    tags=['user']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/", status_code=status.HTTP_200_OK)
async def read_all_users(db: db_dependency):
    users = db.query(UserTable).all()
    if not users:
        raise HTTPException(status_code=404, detail="Users not found")
    transform_users = [transform_to_user_summary_schema_from_model(user) for user in users]
    return {"users": transform_users}

@router.get("/readCurrentUser", status_code=status.HTTP_200_OK)
async def read_current_user(db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed")
    user = db.query(UserTable).filter(UserTable.id == user.get("id")).first()
    transformed_user = transform_to_read_user_schema_from_model(user)
    if user.bridgeLocations:
        location = db.query(Location).filter(Location.id == user.bridgeLocations[0].location_id).first()
        transformed_user.location = transform_to_location_read_schema_from_model(location)
    
    return transformed_user
        
@router.put("/{user_id}", status_code=status.HTTP_201_CREATED)
async def update_current_user(user_id: int, db: db_dependency, user: user_dependency, update_user_request: UpdateUserRequest):
    if not update_user_request:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad update user request body")
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bad update user request body")
    if user_id != user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User not authorized to update this entity")
    
    user_model = db.query(UserTable).filter(UserTable.id == user_id).first();
    user_model_email_check = db.query(UserTable).filter(UserTable.email == update_user_request.email).first()
    
    if user_model_email_check and user_model_email_check.id != user_model.id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user_model.update_from_request(update_user_request)
    db.add(user_model)
    db.commit()
    db.refresh(user_model)

    if user.bridgeLocations:
        location = db.query(Location).filter(Location.id == user.bridgeLocations[0].location_id).first()
        location.update_from_request(update_user_request.location)
        db.add(location)
        db.commit()
   
    

    return user


    



# We are going to have an admin and 