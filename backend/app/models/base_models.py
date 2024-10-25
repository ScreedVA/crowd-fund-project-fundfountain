from sessions import Base
from sqlalchemy import Column, Integer, DateTime
from datetime import datetime

class BaseEntity(Base):
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)


class TimeStampModel(BaseEntity):
    __abstract__ = True
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated = Column(DateTime, onupdate=datetime.now)
