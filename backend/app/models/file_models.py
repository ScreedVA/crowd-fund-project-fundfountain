from .base_models import TimeStampModel
from sqlalchemy import Column, String, Integer, LargeBinary
from sqlalchemy.orm import relationship

class StoredFile(TimeStampModel):
    __tablename__ = "stored_file"

    file_name = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_data = Column(LargeBinary, nullable=False) 

    bridge_revenue_entry_files = relationship("RevenueEntryFileBridge", back_populates="stored_file")
    