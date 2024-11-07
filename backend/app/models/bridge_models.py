from sessions import Base
from sqlalchemy import Column, Integer, ForeignKey, Numeric, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from .base_models import TimeStampModel
from enums import InvestmentStatus
class UserLocation(Base):
    __tablename__ = "user_location"

    user_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    location_id = Column(Integer, ForeignKey("location.id"), primary_key=True)

    user = relationship("UserTable", back_populates="bridgeLocations")
    location = relationship("Location", back_populates="bridgeUsers")


class CrowdFundProjectLocation(Base):
    __tablename__ = 'crowd_fund_project_location'

    crowd_fund_project_id = Column(Integer, ForeignKey("crowd_fund_project.id"), primary_key=True)
    location_id = Column(Integer, ForeignKey("location.id"), primary_key=True)


    crowd_fund_project = relationship("CrowdFundProjectTable", back_populates="bridge_locations")
    location = relationship("Location", back_populates="bridgeCrowdFundProjects")

# Bridge table for CrowdFundProject - User
class Investment(TimeStampModel):
    __tablename__ = 'investment'

    crowd_fund_project_id = Column(Integer, ForeignKey('crowd_fund_project.id'))
    investor_id = Column(Integer, ForeignKey('user.id'))
    unit_count = Column(Integer) # fixed pricing model
    share_percentage = Column(Numeric(precision=3, scale=2), nullable=False) # micro-investment model
    status = Column(SQLAlchemyEnum(InvestmentStatus), default=InvestmentStatus.PAID)


    crowd_fund_project = relationship("CrowdFundProjectTable", back_populates="bridge_investments")
    investor = relationship("UserTable", back_populates="bridge_investments")

