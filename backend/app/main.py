from typing import Annotated
from fastapi import FastAPI, Depends
from routers import user_router, auth_router, cfp_router, investor_router
from sessions import engine, Base, SessionLocal
from sqlalchemy.orm import Session
from models import UserTable, Location, UserLocation, CrowdFundProjectTable, CrowdFundProjectLocation, Investment
from enums import FundingModel, ProjectStatus, InvestmentStatus
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
app = FastAPI()

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],     
    allow_headers=["*"],     
)

Base.metadata.create_all(bind=engine) 

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(cfp_router.router)
app.include_router(investor_router.router)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


def add_default_data(db: db_dependency):
    default_users = [
        UserTable(username="alice", email="alice@example.com", hashed_password=auth_router.bcrypt_context.hash("123"), first_name="alice", last_name="doe", is_admin=True,  date_of_birth=datetime.date(datetime.strptime("2000-03-17", "%Y-%m-%d")), bank_account_balance=300000),
        UserTable(username="bob", email="bob@example.com", hashed_password=auth_router.bcrypt_context.hash("123"), first_name="bob", last_name="tree", date_of_birth=datetime.date(datetime.strptime("1994-10-17", "%Y-%m-%d")), bank_account_balance=150000),
        UserTable( username="charlie", email="charlie@example.com", hashed_password=auth_router.bcrypt_context.hash("123"), first_name="charlie", last_name="smith", date_of_birth=datetime.date(datetime.strptime("2000-10-17", "%Y-%m-%d")), bank_account_balance=30000) ,
    ]

    default_user_locations = [
        Location(id=1, street="Main Street", plz="10115", city="Berlin", country="Germany", house_number="34"),
        Location(id=2, street="Baker Street", plz="30219", city="London", country="United Kingdom", house_number="23P"),
        Location(id=3, street="Postdammer Street", plz="38291", city="Beverly Hills", country="United States", house_number="53")
    ]

    default_bridge_user_location = [
        UserLocation(user_id=1, location_id=1),
        UserLocation(user_id=2, location_id=2),
        UserLocation(user_id=3, location_id=3)
    ]

    default_crowd_fund_projects = [
        CrowdFundProjectTable(id=1, name="Eco-Friendly Backpack", description="A sustainable, eco-friendly backpack made from recycled materials, designed for urban travelers.", current_fund=9000 + 15000 + 3000, start_date=datetime.strptime("2024-07-01", "%Y-%m-%d"), fund_goal=80000, last_date=datetime.strptime("2024-10-01", "%Y-%m-%d"), unit_price=3000, status=ProjectStatus.ACTIVE, funding_model=FundingModel.FIXED_PRICE, owner_id=1),

        CrowdFundProjectTable(id=2, name="Solar-Powered Portable Charger", description="A compact, solar-powered charger for mobile devices, ideal for outdoor use and emergencies.", fund_goal=100000, unit_price=5000, current_fund=10000 + 12000 + 30000, start_date=datetime.strptime("2024-06-01", "%Y-%m-%d"), last_date=datetime.strptime("2024-10-01", "%Y-%m-%d"),  status=ProjectStatus.ACTIVE, funding_model=FundingModel.MICRO_INVESTMENT, owner_id=2),

        CrowdFundProjectTable(id=3, name="Smart Home Security System", description="An affordable, AI-powered home security system with remote monitoring and alert features.", current_fund=80000 + 26000 + 55000, fund_goal=200000, unit_price=4000,start_date=datetime.strptime("2024-06-01", "%Y-%m-%d"), last_date=datetime.strptime("2024-10-01", "%Y-%m-%d"),   status=ProjectStatus.ACTIVE, funding_model=FundingModel.MICRO_INVESTMENT, owner_id=3)
    ]

    default_cfp_locations = [
        Location(id=4, street="Baker Street", plz="3104u8", city="London", country="United Kingdom",
        house_number="10"),
        Location(id=5, street="Apple Street",plz="73104",city="Paris",country="France",house_number="5"),Location(id=6,street="Pinapple Lane",plz="30194",city="New York",country="United States",house_number="293")
    ]

    default_bridge_cfp_locations = [
        CrowdFundProjectLocation(crowd_fund_project_id=1, location_id=4),
        CrowdFundProjectLocation(crowd_fund_project_id=2, location_id=5),
        CrowdFundProjectLocation(crowd_fund_project_id=3, location_id=6)
    ]

    default_investment_bridges = [
        Investment(crowd_fund_project_id=1, investor_id=1, unit_count=3, share_percentage=11.25, status=InvestmentStatus.PAID),
        Investment(crowd_fund_project_id=2, investor_id=1,  share_percentage=10.00, status=InvestmentStatus.PAID),
        Investment(crowd_fund_project_id=3, investor_id=1,  share_percentage=40.00, status=InvestmentStatus.PAID),

        Investment(crowd_fund_project_id=1, investor_id=2, unit_count=5, share_percentage=18.75, status=InvestmentStatus.PAID),
        Investment(crowd_fund_project_id=2, investor_id=2,  share_percentage=12.00, status=InvestmentStatus.PAID),
        Investment(crowd_fund_project_id=3, investor_id=2,  share_percentage=13.00, status=InvestmentStatus.PAID),

        Investment(crowd_fund_project_id=1, investor_id=3, unit_count=1, share_percentage=3.75, status=InvestmentStatus.PAID),
        Investment(crowd_fund_project_id=2, investor_id=3,  share_percentage=30.00, status=InvestmentStatus.PAID),
        Investment(crowd_fund_project_id=3, investor_id=3,  share_percentage=27.50, status=InvestmentStatus.PAID)
    ]

    for i in range(0,len(default_users)):

        existing_user = db.query(UserTable).filter(UserTable.username == default_users[i].username).first()
        if existing_user is None:
            db.add(default_users[i])
            db.add(default_user_locations[i])
            db.add(default_bridge_user_location[i])
            default_crowd_fund_projects[i].update_progress()
            default_crowd_fund_projects[i].update_valuation()
            if default_crowd_fund_projects[i].id == 1:
                default_crowd_fund_projects[i].total_units = 18
            db.add(default_crowd_fund_projects[i])
            db.add(default_cfp_locations[i])
            db.add(default_bridge_cfp_locations[i])
        db.commit()

        for investments in default_investment_bridges:
            db.add(investments)
            db.commit()

    
    

@app.on_event("startup")
def startup_event():
    db = SessionLocal()  
    try:
        add_default_data(db)  
    finally:
        db.close()  


