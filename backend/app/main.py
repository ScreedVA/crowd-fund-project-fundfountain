from typing import Annotated
from fastapi import FastAPI, Depends
from routers import user_router, auth_router, cfp_router
from sessions import engine, Base, SessionLocal
from sqlalchemy.orm import Session
from models import User, Location, UserLocation, CrowdFundProject
from enums import FundingModel, ProjectStatus
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


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


def add_default_data(db: db_dependency):
    default_users = [
        User(username="alice", email="alice@example.com", hashed_password=auth_router.bcrypt_context.hash("123"), first_name="alice", last_name="doe", is_admin=True,  date_of_birth=datetime.date(datetime.strptime("2000-03-17", "%Y-%m-%d"))),
        User(username="bob", email="bob@example.com", hashed_password=auth_router.bcrypt_context.hash("123"), first_name="bob", last_name="tree", is_project_owner=True, date_of_birth=datetime.date(datetime.strptime("1994-10-17", "%Y-%m-%d"))),
        User( username="charlie", email="charlie@example.com", hashed_password=auth_router.bcrypt_context.hash("123"), first_name="charlie", last_name="smith", is_investor=True, date_of_birth=datetime.date(datetime.strptime("2000-10-17", "%Y-%m-%d"))) ,
    ]

    default_locations = [
        Location(id=1, street="Main Street", plz="10115", city="Berlin", country="Germany", house_number="42"),
        Location(id=2, street="Baker Street", plz="NW1 6XE", city="London", country="United Kingdom", house_number="221B"),
        Location(id=3, street="Elm Street", plz="90210", city="Beverly Hills", country="United States", house_number="5")
    ]

    default_user_location = [
        UserLocation(user_id=1, location_id=1),
        UserLocation(user_id=2, location_id=2),
        UserLocation(user_id=3, location_id=3)
    ]

    default_crowd_fund_projects = [
        CrowdFundProject(name="Eco-Friendly Backpack", description="A sustainable, eco-friendly backpack made from recycled materials, designed for urban travelers.", current_fund=12000, start_date=datetime.strptime("2024-07-01", "%Y-%m-%d"), fund_goal=80000, last_date=datetime.strptime("2024-10-01", "%Y-%m-%d"), total_units=1000, unit_price=3000, status=ProjectStatus.ACTIVE, funding_model=FundingModel.FIXED_PRICE, owner_id=1),

        CrowdFundProject(name="Solar-Powered Portable Charger", description="A compact, solar-powered charger for mobile devices, ideal for outdoor use and emergencies.", fund_goal=100000, unit_price=5000, current_fund=0, start_date=datetime.strptime("2024-06-01", "%Y-%m-%d"), last_date=datetime.strptime("2024-10-01", "%Y-%m-%d"), total_units=2000, status=ProjectStatus.ACTIVE, funding_model=FundingModel.MICRO_INVESTMENT, owner_id=2),

        CrowdFundProject(name="Smart Home Security System", description="An affordable, AI-powered home security system with remote monitoring and alert features.", current_fund=80000, fund_goal=200000, unit_price=4000,start_date=datetime.strptime("2024-06-01", "%Y-%m-%d"), last_date=datetime.strptime("2024-10-01", "%Y-%m-%d"), total_units=500,  status=ProjectStatus.ACTIVE, funding_model=FundingModel.MICRO_INVESTMENT, owner_id=3)
    ]

    for i in range(0,len(default_users)):

        existing_user = db.query(User).filter(User.username == default_users[i].username).first()
        if existing_user is None:
            db.add(default_users[i])
            db.add(default_locations[i])
            db.add(default_user_location[i])
            default_crowd_fund_projects[i].update_valuation_and_progress()
            db.add(default_crowd_fund_projects[i])
    db.commit()

@app.on_event("startup")
def startup_event():
    db = SessionLocal()  
    try:
        add_default_data(db)  
    finally:
        db.close()  


