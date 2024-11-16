from fastapi import APIRouter, Depends, HTTPException
from sessions import SessionLocal
from sqlalchemy.orm import Session
from models import CrowdFundProjectTable, UserTable, Location, CrowdFundProjectLocation
from schemas import CrowdFundProjectSummary, ReadCrowdFundProject, CreateCFProject, ReadLocationRequest, UpdateCFProject, cfpFilterSchema, AdminCFPResourcePermissionsSchema
from services import transform_to_cfp_summary_schema_from_model, transform_to_cfp_details_schema_from_model, validate_project_fields, transform_to_model_from_cfp_create_schema, transform_to_location_model_from_req, transform_to_location_read_schema_from_model
from .auth_router import get_current_user
from typing import Annotated
from starlette import status
from sqlalchemy import and_
from enums import ProjectStatus
router = APIRouter(
    prefix='/crowd_fund_project',
    tags=['crowd_fund_project']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get('/', response_model=list[CrowdFundProjectSummary], status_code=status.HTTP_200_OK)
async def read_projects_list(db: db_dependency, filters: cfpFilterSchema = Depends()):
    
    query = db.query(CrowdFundProjectTable)
    
    filter_conditions = []

    # Add filters conditionally based on the input
    if filters.name:
        filter_conditions.append(CrowdFundProjectTable.name.ilike(f"%{filters.name}%"))  # Case-insensitive search
    if filters.status:
        filter_conditions.append(CrowdFundProjectTable.status == filters.status)
    if filters.funding_model:
        filter_conditions.append(CrowdFundProjectTable.funding_model == filters.funding_model)

    if filter_conditions:
        query = query.filter(and_(*filter_conditions))
    
    cfp_models = query.all()

    cfp_response = [transform_to_cfp_summary_schema_from_model(model) for model in cfp_models]

    return cfp_response

@router.get('/current/owner/list', response_model=list[CrowdFundProjectSummary], status_code=status.HTTP_200_OK)
async def read_owned_projects_list(db: db_dependency, user: user_dependency):
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cannot retrieve projects from this user")
    cfp_models: list[CrowdFundProjectTable] = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.owner_id == user["id"]).all()
    cfp_response = [transform_to_cfp_summary_schema_from_model(model) for model in cfp_models]

    return cfp_response

@router.get('/current/investor/list', response_model=list[CrowdFundProjectSummary], status_code=status.HTTP_200_OK)
async def read_invested_projects_list(db: db_dependency, user: user_dependency):
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cannot retrieve projects from this user")
    user_model: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")


    unique_cfp_id_list: list[int] = list(dict.fromkeys(invest_bridge.crowd_fund_project_id for invest_bridge in user_model.bridge_investments))
    cfp_models: list[CrowdFundProjectTable] = [db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first() for cfp_id in unique_cfp_id_list]
    cfp_response = [transform_to_cfp_summary_schema_from_model(model) for model in cfp_models]

    return cfp_response

@router.get("/{project_id}", response_model=ReadCrowdFundProject)
async def read_project_by_id(project_id: int, db: db_dependency):
    cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == project_id).first()

    cfp_response = transform_to_cfp_details_schema_from_model(cfp_model)

    if cfp_model.bridge_locations:
        location_model = db.query(Location).filter(Location.id == cfp_model.bridge_locations[0].location_id).first()
        location_response: ReadLocationRequest = transform_to_location_read_schema_from_model(location_model)
        cfp_response.location = location_response

    return cfp_response

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_project(db: db_dependency, user: user_dependency,  request: CreateCFProject,):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot create new project")
    if not request:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unprocessable entity, invalid create project request body")

    validate_project_fields(request)
    
    cfp_model:CrowdFundProjectTable = transform_to_model_from_cfp_create_schema(request)
    cfp_model.owner_id = user["id"]

    cfp_model.update_valuation()
    cfp_model.update_progress()
    db.add(cfp_model)
    db.commit()
    db.refresh(cfp_model)

    if request.location:
        location_model: Location = transform_to_location_model_from_req(request.location)
        db.add(location_model)
        db.commit()
        db.refresh(location_model)

        bridge_cfp_location_model = CrowdFundProjectLocation(
            crowd_fund_project_id=cfp_model.id,
            location_id=location_model.id
        )

        db.add(bridge_cfp_location_model)
        db.commit()

@router.put("/{project_id}", status_code=status.HTTP_201_CREATED)
async def update_project(request: UpdateCFProject, project_id: int,user: user_dependency, db: db_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot invest into this project")
    if not request:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unprocessable entity, invalid invest request body")
    
    cfp_model_list_by_owner: list[CrowdFundProjectTable] = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.owner_id == user["id"]).all()
    cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == project_id).first()

    if cfp_model not in cfp_model_list_by_owner:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot update this project")

    cfp_model.update_from_request(request)
    
    db.add(cfp_model)
    db.commit()
    db.refresh(cfp_model)
    
    if cfp_model.bridge_locations:
        location = db.query(Location).filter(Location.id == cfp_model.bridge_locations[0].location_id).first()
        location.update_from_request(request.location) 
        db.add(location)
        db.commit()

@router.get('/current/resourcePermissions/{cfp_id}', response_model=AdminCFPResourcePermissionsSchema)
async def check_owner_admin_permissions(db: db_dependency, user: user_dependency, cfp_id: int):
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cannot retrieve projects from this user")
    user_model: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    cfp_models_by_authorized_user: list[CrowdFundProjectTable] = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.owner_id == user["id"]).all()
    cfp_model_by_cfp_id: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first()
    
    is_project_owner = cfp_id in [model.id for model in cfp_models_by_authorized_user]
    cfp_resource_permissions: AdminCFPResourcePermissionsSchema = AdminCFPResourcePermissionsSchema()
    print(is_project_owner)
    if is_project_owner:
        cfp_resource_permissions.owner_can_edit = True
    if user_model.is_admin:
        cfp_resource_permissions.admin_can_edit = True

    if is_project_owner and cfp_model_by_cfp_id.status == ProjectStatus.FUNDED:
        cfp_resource_permissions.can_report_revenue = True

    return cfp_resource_permissions










    





    







