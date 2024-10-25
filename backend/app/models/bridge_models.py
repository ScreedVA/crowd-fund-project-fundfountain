from sessions import Base
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

class UserLocation(Base):
    __tablename__ = "user_location"

    user_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    location_id = Column(Integer, ForeignKey("location.id"), primary_key=True)

    user = relationship("User", back_populates="bridgeLocations")
    location = relationship("Location", back_populates="bridgeUsers")


class CrowdFundProjectLocation(Base):
    __tablename__ = 'crowd_fund_project_location'

    crowd_fund_project_id = Column(Integer, ForeignKey("crowd_fund_project.id"), primary_key=True)
    location_id = Column(Integer, ForeignKey("location.id"), primary_key=True)


    crowd_fund_project = relationship("CrowdFundProject", back_populates="bridge_locations")
    location = relationship("Location", back_populates="bridgeCrowdFundProjects")

    