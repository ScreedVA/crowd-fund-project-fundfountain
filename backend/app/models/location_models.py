from .base_models import TimeStampModel
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from schemas.location_schemas import UpdateLocationRequest

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
 