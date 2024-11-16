from pydantic import BaseModel, Field
from typing import Optional

class FileBaseModel(BaseModel):
    id: int

    class Config:
        populate_by_name = True

class ReadFileMetadataSchema(FileBaseModel):
    file_name: str = Field(None, alias="fileName")
    file_type: str = Field(None, alias="fileType")
    file_size: int = Field(None, alias="fileSize")
    file_size_kilo_bytes: Optional[float] = Field(None, alias="fileSizeKiloBytes")
    file_size_mega_bytes: Optional[float] = Field(None, alias="fileSizeMegaBytes")
    file_size_giga_bytes: Optional[float] = Field(None, alias="fileSizeGigaBytes")

class ReadFileBLOBSchema(FileBaseModel):
    file_data: str



