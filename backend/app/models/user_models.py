from .base_models import TimeStampModel
from sqlalchemy import Column, String, Boolean, Date, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from schemas.user_schemas import UpdateUserRequest

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
    bank_account_balance = Column(Integer)

    bridgeLocations = relationship("UserLocation", back_populates="user")
    refresh_token = relationship('RefreshToken', back_populates='user')
    crowd_fund_projects = relationship('CrowdFundProject', back_populates='user')
    bridge_investments = relationship("Investment", back_populates="investor")

    def update_from_request(self, request: UpdateUserRequest):
        self.username = request.username
        self.first_name = request.first_name
        self.last_name = request.last_name
        self.date_of_birth = datetime.strptime(request.date_of_birth, "%Y-%m-%d")
        self.email = request.email
        self.is_admin = request.is_admin
        self.is_investor = request.is_investor
        self.is_project_owner = request.is_project_owner

    def deposite_balance(self, amount: int):
        self.bank_account_balance += amount