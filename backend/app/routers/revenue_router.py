from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Form
from sessions import SessionLocal
from sqlalchemy.orm import Session
from .auth_router import get_current_user
from typing import Annotated, List
from starlette import status
from models import UserTable, CrowdFundProjectTable, StoredFile, RevenueEntryTable, RevenueEntryFileBridge
from schemas import RevenueEntryListSchema, RevenueSummarySchema, RevenueEntrySchema
from datetime import datetime
from enums import ProjectStatus, RevenueStatus, RevenueType

router = APIRouter(
    prefix='/revenue',
    tags=['revenue']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/entries/list/byInvestor/daily/{number_of_days}", response_model=List[RevenueEntryListSchema])
async def get_project_revenue_entries_by_investor(db: db_dependency, user: user_dependency, number_of_days: int = 7):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    
    user_model: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")
    
    unique_cfp_id_list: list[int] = list(dict.fromkeys(invest_bridge.crowd_fund_project_id for invest_bridge in user_model.bridge_investments))
    revenue_entries_schema_list: list[RevenueEntryListSchema] = []
    for cfp_id in unique_cfp_id_list:

        cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first()
        # Only create entries schema if project is funded
        if cfp_model.status == ProjectStatus.FUNDED:
            revenue_entries_schema = RevenueEntryListSchema(
                project_id=cfp_model.id,
                project_name=cfp_model.name,
                project_owner_id=user['id'],
                project_owner_username=user['username'],
                dateList=[],
                amountList=[]
            )
            
            # Poplate dateList and amountList
            for i in range(0, number_of_days):
                if len(cfp_model.revenue_list) >= number_of_days:
                    revenue_entries_schema.date_list.append(datetime.strftime(cfp_model.revenue_list[i].distribution_date, "%Y-%m-%d"))
                    revenue_entries_schema.amount_list.append(cfp_model.revenue_list[i].amount)
                
             # Only include revenue_entries with a history of atleast 7 days   
            if len(revenue_entries_schema.date_list) == number_of_days:
                revenue_entries_schema_list.append(revenue_entries_schema)
    return revenue_entries_schema_list     

@router.get("/entries/byProject/{cfp_id}", response_model=List[RevenueEntrySchema])
async def get_project_revenue_entries_by_project(db: db_dependency, user: user_dependency, cfp_id: int):
    if not user and not user["is_admin"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")

    cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first()

    if not cfp_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crowd Fund Project not Found")
    
    if cfp_model.owner_id != user["id"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized to access crowd fund project")

    revenue_entry_list: List[RevenueEntryTable] = cfp_model.revenue_list
    revenue_entry_schema_list: List[RevenueEntrySchema] = []

    for revenue_entry in revenue_entry_list:
        file_id_list: List[int] = [file_table.stored_file.id for file_table in revenue_entry.bridge_revenue_entry_files]
        revenue_entry_schema: RevenueEntrySchema = RevenueEntrySchema(
            id=revenue_entry.id,
            project_id=cfp_model.id,
            date=datetime.strftime(revenue_entry.distribution_date, "%Y-%m-%d"),
            amount=revenue_entry.amount,
            file_id_list=file_id_list            
        )
        revenue_entry_schema_list.append(revenue_entry_schema)
    
    return revenue_entry_schema_list
    


@router.get("/current/weekly/distribution/byInvestor")
async def get_project_revenue_distributions_entries(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    
    user_model: UserTable = db.query(UserTable).filter(UserTable.id == user["id"]).first()
    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")

@router.get("/summary/byProject/{cfp_id}", response_model=RevenueSummarySchema)
async def get_revenue_summary(db: db_dependency, user: user_dependency, cfp_id: int):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")

    cfp_model: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first()

    if not cfp_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crowd Fund Project not Found")
    
    if cfp_model.owner_id != user["id"] or not user["is_admin"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized to access crowd fund project")

    revenue_summary: RevenueSummarySchema = RevenueSummarySchema(
        project_id=cfp_model.id,
        project_name=cfp_model.name,
        project_owner_id=user["id"],
        project_owner_username=user["username"]

    )

    for revenue_model in cfp_model.revenue_list:
        revenue_summary.revenue_aggregate_total += float(revenue_model.amount)
        revenue_summary.revenue_entry_count += 1

    return revenue_summary


@router.get

@router.post("/upload-revenue-report/{cfp_id}", status_code=status.HTTP_201_CREATED)
async def upload_revenue_report(db: db_dependency, user: user_dependency, cfp_id: int, distribution_date: str = Form(...), amount: float = Form(...), revenue_report_files: List[UploadFile] = File(...)):
    # Error Handling
    if not user and not user["is_admin"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access endpoint")
    
    if not distribution_date or not amount or not revenue_report_files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Form or File details missing")

    cfp_table_by_cfp_id: CrowdFundProjectTable = db.query(CrowdFundProjectTable).filter(CrowdFundProjectTable.id == cfp_id).first()
    
    if user["id"] != cfp_table_by_cfp_id.owner_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized, cannot access crowd fund project resource")

    report_file_id_list: List[int] = []

    # Store File Data
    for report_file in revenue_report_files:
        file_data = await report_file.read()

        stored_file = StoredFile(
            file_name=report_file.filename,
            file_type=report_file.content_type,
            file_size=len(file_data),
            file_data=file_data
        )
        db.add(stored_file)
        db.commit()
        db.refresh(stored_file)
        report_file_id_list.append(stored_file.id)

    # Store Revenue Report Data
    revenue_entry_table = RevenueEntryTable(
        amount=amount,
        distribution_date=datetime.strptime(distribution_date, "%Y-%m-%d"),
        revenue_type=RevenueType.RENTAL_INCOME,
        revenue_status=RevenueStatus.DISTRIBUTED,
        crowd_fund_project_id =cfp_id
    )

    db.add(revenue_entry_table)
    db.commit()
    db.refresh(revenue_entry_table)

    # Map Bridge Relation
    for report_file_id in report_file_id_list:
        revenue_entry_file_bridge_model: RevenueEntryFileBridge = RevenueEntryFileBridge(
            stored_file_id=report_file_id,
            revenue_id=revenue_entry_table.id,
        )
        db.add(revenue_entry_file_bridge_model)
        db.commit()
        
    return {
        "distribution_date": distribution_date,
        "amount": amount,
        "file_ids": report_file_id_list,  # Return a list of file names for the uploaded files
        "message": "Revenue report uploaded successfully"
    }











