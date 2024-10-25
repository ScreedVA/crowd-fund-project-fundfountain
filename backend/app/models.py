from sessions import Base
from sqlalchemy import Column, Integer, String, Boolean,  DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from schemas.user_schemas import UpdateUserRequest
from schemas.location_schemas import UpdateLocationRequest

class BaseEntity(Base):
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)


class TimeStampModel(BaseEntity):
    __abstract__ = True
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated = Column(DateTime, onupdate=datetime.now)



class User(TimeStampModel):
    __tablename__ = "user"

    username = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_project_owner = Column(Boolean, default=False)
    is_investor = Column(Boolean, default=False)
    date_of_birth = Column(Date, nullable=False)

    bridgeLocations = relationship("UserLocation", back_populates="user")
    refresh_token = relationship('RefreshToken', back_populates='user')

    def update_from_request(self, request: UpdateUserRequest):
        self.username = request.username
        self.first_name = request.first_name
        self.last_name = request.last_name
        self.date_of_birth = datetime.strptime(request.date_of_birth, "%Y-%m-%d")
        self.email = request.email
        self.is_admin = request.is_admin
        self.is_investor = request.is_investor
        self.is_project_owner = request.is_project_owner


class Location(TimeStampModel):
    __tablename__ = "location"

    street = Column(String(100))
    plz = Column(String(100))
    city = Column(String(100))
    country = Column(String(255))
    house_number = Column(String(100))

    bridgeUsers = relationship("UserLocation", back_populates="location")

    def update_from_request(self, request:UpdateLocationRequest):
        self.street = request.street
        self.plz = request.plz
        self.city = request.city
        self.country = request.country
        self.house_number = request.house_number
     
 
class UserLocation(Base):
    __tablename__ = "user_location"

    user_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    location_id = Column(Integer, ForeignKey("location.id"), primary_key=True)

    user = relationship("User", back_populates="bridgeLocations")
    location = relationship("Location", back_populates="bridgeUsers")

class RefreshToken(BaseEntity): 
    __tablename__ = 'refresh_token'
    
    token = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    expires_at = Column(DateTime, nullable=False)

    user = relationship('User', back_populates='refresh_token')

