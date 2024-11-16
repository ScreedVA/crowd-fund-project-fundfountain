from sessions import Base
from sqlalchemy import Column, Integer, ForeignKey, Numeric, Enum as SQLAlchemyEnum, Date
from sqlalchemy.orm import relationship
from .base_models import TimeStampModel
from enums import InvestmentStatus
from datetime import datetime

class UserLocationBridge(Base):
    __tablename__ = "user_location_bridge"

    user_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    location_id = Column(Integer, ForeignKey("location.id"), primary_key=True)

    user = relationship("UserTable", back_populates="bridgeLocations")
    location = relationship("Location", back_populates="bridgeUsers")


class CrowdFundProjectLocationBridge(Base):
    __tablename__ = 'crowd_fund_project_location_bridge'

    crowd_fund_project_id = Column(Integer, ForeignKey("crowd_fund_project.id"), primary_key=True)
    location_id = Column(Integer, ForeignKey("location.id"), primary_key=True)


    crowd_fund_project = relationship("CrowdFundProjectTable", back_populates="bridge_locations")
    location = relationship("Location", back_populates="bridgeCrowdFundProjects")

# Bridge table for CrowdFundProject - User
class InvestmentBridge(TimeStampModel):
    __tablename__ = 'investment_bridge'

    crowd_fund_project_id = Column(Integer, ForeignKey('crowd_fund_project.id'))
    investor_id = Column(Integer, ForeignKey('user.id'))
    unit_count = Column(Integer) # fixed pricing model
    share_percentage = Column(Numeric(precision=3, scale=2), nullable=False) # micro-investment model
    transaction_amount = Column(Integer)
    status = Column(SQLAlchemyEnum(InvestmentStatus), default=InvestmentStatus.PAID)


    crowd_fund_project = relationship("CrowdFundProjectTable", back_populates="bridge_investments")
    investor = relationship("UserTable", back_populates="bridge_investments")

class RevenueDistributionBridge(TimeStampModel):
    __tablename__ = 'revenue_distribution_bridge'

    amount = Column(Integer, nullable=False)
    distribution_date = Column(Date, nullable=False, default=datetime.today)

    revenue_entry_id = Column(Integer, ForeignKey('revenue_entry.id'))
    investor_id = Column(Integer, ForeignKey('user.id'))

    revenue_entry = relationship("RevenueEntryTable", back_populates="bridge_revenue_distributions")
    investor = relationship("UserTable", back_populates="bridge_revenue_distributions")

# File Bridges

class RevenueEntryFileBridge(Base):
    __tablename__ = 'revenue_entry_file_bridge'

    stored_file_id = Column(Integer, ForeignKey('stored_file.id'), primary_key=True)
    revenue_id = Column(Integer, ForeignKey('revenue_entry.id'), primary_key=True)

    stored_file = relationship("StoredFile", back_populates="bridge_revenue_entry_files")
    revenue_entry = relationship("RevenueEntryTable", back_populates="bridge_revenue_entry_files")





    