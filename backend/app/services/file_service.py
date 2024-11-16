from models import StoredFile
from schemas import ReadFileMetadataSchema, ReadFileBLOBSchema
import base64
def transform_to_read_file_meta_data_schema_from_model(table_input: StoredFile) -> ReadFileMetadataSchema:
    schema_result: ReadFileMetadataSchema = ReadFileMetadataSchema(
        id=table_input.id,
        file_name=table_input.file_name,
        file_size=table_input.file_size,
        file_type=table_input.file_type,
        file_size_kilo_bytes=table_input.file_size * 0.001,
        file_size_mega_bytes = table_input.file_size * 0.000001,
        file_size_giga_bytes=table_input.file_size * 0.000000001
    )
    return schema_result

def transform_to_read_file_blob_schema_from_model(table_input: StoredFile) -> ReadFileBLOBSchema:
    schema_result: ReadFileBLOBSchema = ReadFileBLOBSchema(
        id=table_input.id,
        file_data=base64.b64encode(table_input.file_data).decode("utf-8")
    )

    return schema_result