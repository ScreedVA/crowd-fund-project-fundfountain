from .base_models import TimeStampModel
from sqlalchemy import Column, Integer, Date, String, Text, Numeric, ForeignKey,Enum as SQLALchemyEnum
from sqlalchemy.orm import relationship
from enums import FundingModel, ProjectStatus

class CrowdFundProject(TimeStampModel):
    __tablename__ = 'crowd_fund_project'

    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    fund_goal = Column(Integer, nullable=False)
    current_fund = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    last_date = Column(Date, nullable=False)
    total_units = Column(Integer, nullable=False)
    valuation = Column(Integer, nullable=False)
    status = Column(SQLALchemyEnum(ProjectStatus), nullable=False)
    funding_model = Column(SQLALchemyEnum(FundingModel), nullable=False)
    funding_progress = Column(Numeric(precision=3, scale=2), default=0.0)

    owner_id = Column(Integer, ForeignKey('user.id'))

    user = relationship("User", back_populates="crowd_fund_projects")
    bridge_locations = relationship("CrowdFundProjectLocation", back_populates="crowd_fund_project")



