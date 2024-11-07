from .base_models import TimeStampModel
from sqlalchemy import Column, Integer, Date, String, Text, Numeric, ForeignKey,Enum as SQLALchemyEnum
from sqlalchemy.orm import relationship
from enums import FundingModel, ProjectStatus
from schemas import UpdateCFProject

class CrowdFundProjectTable(TimeStampModel):
    __tablename__ = 'crowd_fund_project'

    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    fund_goal = Column(Integer, nullable=False)
    funding_model = Column(SQLALchemyEnum(FundingModel), nullable=False)
    current_fund = Column(Integer, default=0)
    start_date = Column(Date, nullable=False)
    last_date = Column(Date, nullable=False)
    unit_price = Column(Integer, nullable=False)
    total_units = Column(Integer)
    valuation = Column(Integer)
    status = Column(SQLALchemyEnum(ProjectStatus), nullable=False)
    funding_progress = Column(Numeric(precision=3, scale=2), default=0.0)

    owner_id = Column(Integer, ForeignKey('user.id'))

    user = relationship("UserTable", back_populates="crowd_fund_projects")
    bridge_locations = relationship("CrowdFundProjectLocation", back_populates="crowd_fund_project")
    bridge_investments = relationship("Investment", back_populates="crowd_fund_project")
    

    # Fire if factors (fund_goal/unit_price) change
    def update_valuation(self):
        self.valuation =  (self.fund_goal // self.unit_price) * self.unit_price
        if self.valuation < self.fund_goal:
            self.valuation = self.fund_goal = self.valuation + self.unit_price
        if self.funding_model == FundingModel.FIXED_PRICE:
            self.total_units = self.fund_goal // self.unit_price

        
    # Fire if factors (fund_goal/current_fund) change
    def update_progress(self):
        if self.fund_goal > 0 and self.current_fund != None:
            self.funding_progress = round((self.current_fund / self.fund_goal) * 100, 2)
        else:
            self.funding_progress = 0.0

    def invest_fixed_price(self, units_to_invest):
        if self.funding_model == FundingModel.FIXED_PRICE:
            if units_to_invest > self.total_units:
                    raise ValueError("Investment exceeds available units.")
        else:
            raise ValueError("Invalid funding model.")
        
        self.total_units -= units_to_invest
        self.current_fund += units_to_invest * self.unit_price

        self.update_progress()

    def invest_micro_investment(self, amount: int):
        if self.funding_model == FundingModel.MICRO_INVESTMENT:
            self.current_fund += amount

        else:
            raise ValueError("Invalid funding model.")

        self.update_progress()

    def update_from_request(self, request: UpdateCFProject):
        self.name = request.name
        self.description = request.description





