from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import base64
import io
from starlette import status
from sessions import SessionLocal
from sqlalchemy.orm import Session
from typing import Annotated, List
from .auth_router import get_current_user
from schemas import ReadFileMetadataSchema, ReadFileBLOBSchema, ContentDistpositionFilterSchema
from models import StoredFile
from services import transform_to_read_file_meta_data_schema_from_model, transform_to_read_file_blob_schema_from_model

router = APIRouter(
    prefix='/file',
    tags=['file']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("all/list/metaData", response_model=List[ReadFileMetadataSchema])
async def get_file_list_summary(db: db_dependency, user: user_dependency):
    if not user or not user['is_admin']:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")

    stored_file_table_list: List[StoredFile] = db.query(StoredFile).all()

    if not stored_file_table_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Files not found")
    
    read_file_meta_data_schema_list: List[ReadFileMetadataSchema] = [transform_to_read_file_meta_data_schema_from_model(stored_file_table) for stored_file_table in stored_file_table_list]
    print(read_file_meta_data_schema_list)
    return read_file_meta_data_schema_list

@router.get("/blob/{file_id}", response_model=ReadFileBLOBSchema)
async def get_file_blob_by_id(db: db_dependency, user: user_dependency, file_id: int):
    if not user or not user['is_admin']:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")

    stored_file_table: StoredFile = db.query(StoredFile).filter(StoredFile.id == file_id).first()
    
    if not stored_file_table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Files not found")
    
    read_file_blob_schema: ReadFileBLOBSchema = transform_to_read_file_blob_schema_from_model(stored_file_table)


    return read_file_blob_schema

@router.get("/download/{file_id}")
async def get_file_download_by_id(db: db_dependency, user: user_dependency, file_id: int, filters: ContentDistpositionFilterSchema = Depends()):
    if not user or not user['is_admin']:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")

    stored_file_table: StoredFile = db.query(StoredFile).filter(StoredFile.id == file_id).first()
    
    if not stored_file_table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Files not found")

    file_stream = io.BytesIO(stored_file_table.file_data)

    response = StreamingResponse(
        file_stream, 
        media_type=stored_file_table.file_type
    )

    response.headers["Content-Disposition"] = f"{filters.content_disposition.value}; filename={stored_file_table.file_name}"
    return response




