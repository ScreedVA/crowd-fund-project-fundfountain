from models import UserTable, CrowdFundProjectTable
from schemas import AdminUserSummarySchema, AdminCFPSummarySchema,RequestingAdminSchema

def transform_to_admin_user_summary_schema_from_admin_user_tables(user_table: UserTable, admin_model: UserTable) -> AdminUserSummarySchema:
    admin_user_schema: AdminUserSummarySchema = AdminUserSummarySchema(
        id=user_table.id,
        username=user_table.username,
        is_admin=user_table.is_admin,
        admin_details=RequestingAdminSchema(
            admin_id=admin_model.id,
            admin_username=admin_model.username
        )
    )

    return admin_user_schema

def transform_to_admin_cfp_summary_schema_from_admin_user_tables(cfp_table: CrowdFundProjectTable, admin_model: UserTable) -> AdminCFPSummarySchema:
    admin_cfp_schema: AdminCFPSummarySchema = AdminCFPSummarySchema(
        id=cfp_table.id,
        name=cfp_table.name,
        description=cfp_table.description,
        status=cfp_table.status,
        funding_model=cfp_table.funding_model,
        owner_id=cfp_table.owner_id,
        admin_details=RequestingAdminSchema(
            admin_id=admin_model.id,
            admin_username=admin_model.username
        )
    )

    return admin_cfp_schema
