from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends, Body
from starlette import status
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from sessions import SessionLocal
from schemas.user_schemas import CreateUserRequest, Token, RefreshTokenRequest
from models import User, UserLocation, RefreshToken
from services import transform_to_location_model_from_req


router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = '197b2c37c391bed93fe80344fe73b806947a65e36206e05a1a23c2fa12702fe3'
ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]



def authenticate_user(username: str, password: str, db):
    user: User = db.query(User).filter(User.username == username).first()
    if not user or not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


def create_bearer_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    token = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return token, expires


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user.')
        return {'username': username, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')
    
# Example function to clean up expired tokens

def cleanup_expired_tokens(db: db_dependency):
    db.query(RefreshToken).filter(RefreshToken.expires_at < datetime.now(timezone.utc)).delete()
    db.commit()



@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=Token)
async def register_user_for_access_token(db: db_dependency,
                      create_user_request: CreateUserRequest):
    
    create_user_model = User(
        email=create_user_request.email,
        username=create_user_request.username,
        first_name=create_user_request.first_name,
        last_name=create_user_request.last_name,
        hashed_password=bcrypt_context.hash(create_user_request.password),
        date_of_birth=datetime.date(datetime.strptime(create_user_request.date_of_birth, "%Y-%m-%d")),
        is_admin=create_user_request.is_admin,
        is_active=True
    )

    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)
    if (create_user_request.location):
        create_location_model = transform_to_location_model_from_req(create_user_request.location)
        db.add(create_location_model)
        db.commit()
        db.refresh(create_location_model)
        create_user_location_model = UserLocation(user_id=create_user_model.id, location_id=create_location_model.id)
        db.add(create_user_location_model)
        db.commit()


    access_token, access_expires = create_bearer_token(create_user_model.username, create_user_model.id, timedelta(minutes=1))
    refresh_token, refresh_expires = create_bearer_token(create_user_model.username, create_user_model.id, timedelta(days=7))

    refresh_token_model: RefreshToken = RefreshToken(token=refresh_token, user_id=create_user_model.id, expires_at=refresh_expires)
    db.add(refresh_token_model)
    db.commit()

    return {'access_token': access_token, 'refresh_token': refresh_token, 'token_type': 'bearer'}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                 db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')

    access_token, _ = create_bearer_token(user.username, user.id, timedelta(minutes=30))
    refresh_token, refresh_expires = create_bearer_token(user.username, user.id, timedelta(days=7))

    refresh_token_model: RefreshToken = RefreshToken(token=refresh_token, user_id=user.id, expires_at=refresh_expires)
    db.add(refresh_token_model)
    db.commit()

    return {'access_token': access_token, "refresh_token": refresh_token, 'token_type': 'bearer'}
    

@router.post("/refresh")
async def refresh_access_token(request_body: RefreshTokenRequest, db: db_dependency):
    try:
        payload =jwt.decode(request_body.refresh_token, SECRET_KEY,algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')

        stored_token = db.query(RefreshToken).filter(RefreshToken.token == request_body.refresh_token).first()
        if not stored_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
        new_access_token, _ = create_bearer_token(username, user_id, timedelta(minutes=1))

        return {'access_token': new_access_token, 'token_type': 'bearer'}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        

# Temp       
@router.get("/getAllRefreshTokens") 
async def get_all_refresh_tokens(db: db_dependency): 
    return  db.query(RefreshToken).all()
