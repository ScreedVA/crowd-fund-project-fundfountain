from typing import Annotated
from fastapi import FastAPI, Depends
from routers import user_router, auth_router, cfp_router, investor_router, revenue_router, admin_router, file_router
from sessions import engine, Base, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import UserTable, Location, UserLocationBridge, CrowdFundProjectTable, CrowdFundProjectLocationBridge, InvestmentBridge, RevenueEntryTable, StoredFile, RevenueEntryFileBridge
from enums import FundingModel, ProjectStatus, InvestmentStatus, RevenueType, RevenueStatus
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
app.include_router(revenue_router.router)
app.include_router(admin_router.router)
app.include_router(file_router.router)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


def add_default_data(db: db_dependency):
    default_users = [
        UserTable(username="alice", email="alice@example.com", biography="Alice is a mother of two and loves spending weekends hiking with her family. She enjoys gardening and has a soft spot for classic mystery novels.", hashed_password=auth_router.bcrypt_context.hash("123"), first_name="alice", last_name="doe", is_admin=True,  date_of_birth=datetime.date(datetime.strptime("2000-03-17", "%Y-%m-%d")), bank_account_balance=201000, balance_spent=164000),
        UserTable(username="bob", email="bob@example.com", biography="Bob is a community volunteer and an avid cyclist who enjoys exploring new trails. When he's not outdoors, he loves experimenting with new recipes in the kitchen.",hashed_password=auth_router.bcrypt_context.hash("123"), first_name="bob", last_name="tree", date_of_birth=datetime.date(datetime.strptime("1994-10-17", "%Y-%m-%d")), bank_account_balance=97000, balance_spent=134000),
        UserTable( username="charlie", email="charlie@example.com", biography="Charlie is a high school teacher who loves her cat, Milo, and spends his evenings painting. He enjoys cozy nights in with a good cup of tea and a favorite movie.",hashed_password=auth_router.bcrypt_context.hash("123"), first_name="charlie", last_name="smith", date_of_birth=datetime.date(datetime.strptime("2000-10-17", "%Y-%m-%d")), bank_account_balance=362000, balance_spent=137500) ,
    ]

    default_user_locations = [
        Location(id=1, street="Main Street", plz="10115", city="Berlin", country="Germany", house_number="34"),
        Location(id=2, street="Baker Street", plz="30219", city="London", country="United Kingdom", house_number="23P"),
        Location(id=3, street="Postdammer Street", plz="38291", city="Beverly Hills", country="United States", house_number="53")
    ]

    default_bridge_user_location = [
        UserLocationBridge(user_id=1, location_id=1),
        UserLocationBridge(user_id=2, location_id=2),
        UserLocationBridge(user_id=3, location_id=3)
    ]

    default_crowd_fund_projects = [
        CrowdFundProjectTable(id=1, name="Woolworth Building Redevelopment", description="This project involves the partial redevelopment of New York’s iconic Woolworth Building. Through Fundrise, developers are raising funds to transform the upper floors into luxury residences while preserving the historic architecture, aiming to deliver a blend of classic and modern New York living", current_fund=9000 + 15000 + 3000, start_date=datetime.strptime("2024-07-01", "%Y-%m-%d"), fund_goal=80000, last_date=datetime.strptime("2024-10-01", "%Y-%m-%d"), unit_price=3000, status=ProjectStatus.ACTIVE, funding_model=FundingModel.FIXED_PRICE, owner_id=1),

        CrowdFundProjectTable(id=2, name="The Collective Old Oak", description="The Collective Old Oak is currently under development as one of London’s largest co-living spaces. Funded on Crowdcube,", fund_goal=100000, unit_price=5000, current_fund=10000 + 12000 + 30000, start_date=datetime.strptime("2024-06-01", "%Y-%m-%d"), last_date=datetime.strptime("2024-10-01", "%Y-%m-%d"),  status=ProjectStatus.ACTIVE, funding_model=FundingModel.MICRO_INVESTMENT, owner_id=2),

        CrowdFundProjectTable(id=3, name="Azure Crest Innovation Hub", description="Currently raising funds via BuildForward, the Azure Crest Innovation Hub project aims to create a cutting-edge, eco-friendly commercial and co-working space", current_fund=80000 + 26000 + 55000, fund_goal=200000, unit_price=4000,start_date=datetime.strptime("2024-06-01", "%Y-%m-%d"), last_date=datetime.strptime("2024-10-01", "%Y-%m-%d"),   status=ProjectStatus.ACTIVE, funding_model=FundingModel.MICRO_INVESTMENT, owner_id=3),

        CrowdFundProjectTable(id=4, name="Campanile Solar Farm", description="Currently raising funds via Lumo, the Campanile Solar Farm project aims to build a large-scale solar farm in Bordeaux.", current_fund=15000 + 22000 + 13000, fund_goal=50000, unit_price=2000, start_date=datetime.strptime("2024-07-15", "%Y-%m-%d"), last_date=datetime.strptime("2024-11-15", "%Y-%m-%d"), status=ProjectStatus.FUNDED, funding_model=FundingModel.FIXED_PRICE, owner_id=1),

        CrowdFundProjectTable(id=5, name="Streets of Detroit", description="Through Mainvest, developers are seeking funding to revitalize small residential and commercial properties across Detroit.", current_fund=20000 + 37000 + 18000, fund_goal=75000, unit_price=2500, start_date=datetime.strptime("2024-08-01", "%Y-%m-%d"), last_date=datetime.strptime("2024-12-01", "%Y-%m-%d"), status=ProjectStatus.FUNDED, funding_model=FundingModel.MICRO_INVESTMENT, owner_id=2),

        CrowdFundProjectTable(id=6, name="Wynwood Garage", description="In the Wynwood Arts District, developers are crowdfunding on Crowdstreet to build the Wynwood Garage, a mixed-use facility with parking, retail, and public art spaces.", current_fund=30000 + 22000 + 68000, fund_goal=120000, unit_price=3500, start_date=datetime.strptime("2024-05-15", "%Y-%m-%d"), last_date=datetime.strptime("2024-09-15", "%Y-%m-%d"), status=ProjectStatus.FUNDED, funding_model=FundingModel.MICRO_INVESTMENT, owner_id=3)
    ]

    default_cfp_locations = [
        Location(id=4, street="Baker Street", plz="3104u8", city="London", country="United Kingdom", house_number="10"),
        Location(id=5, street="Apple Street",plz="73104",city="Paris",country="France",house_number="5"),
        Location(id=6,street="Pinapple Lane",plz="30194",city="New York",country="United States",house_number="293"),
        Location(id=7, street="Sunset Boulevard", plz="90210", city="Los Angeles", country="United States", house_number="123"),
        Location(id=8, street="Maple Street", plz="75008", city="Berlin", country="Germany", house_number="7"),
        Location(id=9, street="Cherry Blossom Lane", plz="10178", city="Tokyo", country="Japan", house_number="45")
    ]

    default_bridge_cfp_locations = [
        CrowdFundProjectLocationBridge(crowd_fund_project_id=1, location_id=4),
        CrowdFundProjectLocationBridge(crowd_fund_project_id=2, location_id=5),
        CrowdFundProjectLocationBridge(crowd_fund_project_id=3, location_id=6),
        CrowdFundProjectLocationBridge(crowd_fund_project_id=4, location_id=7),
        CrowdFundProjectLocationBridge(crowd_fund_project_id=5, location_id=8),
        CrowdFundProjectLocationBridge(crowd_fund_project_id=6, location_id=9),
    ]

    default_investment_bridges = [
        InvestmentBridge(crowd_fund_project_id=1, investor_id=1, unit_count=3, share_percentage=11.25, status=InvestmentStatus.PAID, transaction_amount=9000),
        InvestmentBridge(crowd_fund_project_id=2, investor_id=1,  share_percentage=10.00, status=InvestmentStatus.PAID, transaction_amount=10000),
        InvestmentBridge(crowd_fund_project_id=3, investor_id=1,  share_percentage=40.00, status=InvestmentStatus.PAID, transaction_amount=80000),
        InvestmentBridge(crowd_fund_project_id=4, investor_id=1,  share_percentage=30.00, status=InvestmentStatus.PAID, transaction_amount=15000),
        InvestmentBridge(crowd_fund_project_id=5, investor_id=1,  share_percentage=26.00, status=InvestmentStatus.PAID, transaction_amount=20000),
        InvestmentBridge(crowd_fund_project_id=6, investor_id=1,  share_percentage=25.00, status=InvestmentStatus.PAID, transaction_amount=30000),

        InvestmentBridge(crowd_fund_project_id=1, investor_id=2, unit_count=5, share_percentage=18.75, status=InvestmentStatus.PAID, transaction_amount=15000),
        InvestmentBridge(crowd_fund_project_id=2, investor_id=2,  share_percentage=12.00, status=InvestmentStatus.PAID, transaction_amount=12000),
        InvestmentBridge(crowd_fund_project_id=3, investor_id=2,  share_percentage=13.00, status=InvestmentStatus.PAID, transaction_amount=26000),
        InvestmentBridge(crowd_fund_project_id=4, investor_id=2,  share_percentage=44.00, status=InvestmentStatus.PAID, transaction_amount=22000),
        InvestmentBridge(crowd_fund_project_id=5, investor_id=2,  share_percentage=49.33, status=InvestmentStatus.PAID, transaction_amount=37000),
        InvestmentBridge(crowd_fund_project_id=6, investor_id=2,  share_percentage=18.33, status=InvestmentStatus.PAID, transaction_amount=22000),

        InvestmentBridge(crowd_fund_project_id=1, investor_id=3, unit_count=1, share_percentage=3.75, status=InvestmentStatus.PAID, transaction_amount=3000),
        InvestmentBridge(crowd_fund_project_id=2, investor_id=3,  share_percentage=30.00, status=InvestmentStatus.PAID, transaction_amount=30000),
        InvestmentBridge(crowd_fund_project_id=3, investor_id=3,  share_percentage=27.50, status=InvestmentStatus.PAID, transaction_amount=55000),
        InvestmentBridge(crowd_fund_project_id=4, investor_id=3,  share_percentage=26.00, status=InvestmentStatus.PAID, transaction_amount=13000),
        InvestmentBridge(crowd_fund_project_id=5, investor_id=3,  share_percentage=24.00, status=InvestmentStatus.PAID, transaction_amount=18000),
        InvestmentBridge(crowd_fund_project_id=6, investor_id=3,  share_percentage=56.66, status=InvestmentStatus.PAID, transaction_amount=68000)
    ]

    # Revenue entries for CrowdFundProjectTable(id=4) - "Biodegradable Phone Case"
    revenue_entries_project_4 = [
        RevenueEntryTable(amount=5000, distribution_date=datetime.strptime("2024-11-15", "%Y-%m-%d"), revenue_type=RevenueType.SALES, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=4),
        RevenueEntryTable(amount=7000, distribution_date=datetime.strptime("2024-11-16", "%Y-%m-%d"), revenue_type=RevenueType.AD_REVENUE, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=4),
        RevenueEntryTable(amount=8000, distribution_date=datetime.strptime("2024-12-17", "%Y-%m-%d"), revenue_type=RevenueType.SALES, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=4),
        RevenueEntryTable(amount=4500, distribution_date=datetime.strptime("2024-12-18", "%Y-%m-%d"), revenue_type=RevenueType.ROYALTY, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=4),
        RevenueEntryTable(amount=6000, distribution_date=datetime.strptime("2024-12-19", "%Y-%m-%d"), revenue_type=RevenueType.SALES, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=4),
        RevenueEntryTable(amount=3000, distribution_date=datetime.strptime("2024-12-20", "%Y-%m-%d"), revenue_type=RevenueType.AD_REVENUE, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=4),
        RevenueEntryTable(amount=7500, distribution_date=datetime.strptime("2024-12-21", "%Y-%m-%d"), revenue_type=RevenueType.ROYALTY, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=4),
    ]

    # Revenue entries for CrowdFundProjectTable(id=5) - "Portable Water Purifier Bottle"
    revenue_entries_project_5 = [
        RevenueEntryTable(amount=9000, distribution_date=datetime.strptime("2024-11-15", "%Y-%m-%d"), revenue_type=RevenueType.SALES, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=5),
        RevenueEntryTable(amount=12000, distribution_date=datetime.strptime("2024-11-16", "%Y-%m-%d"), revenue_type=RevenueType.AD_REVENUE, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=5),
        RevenueEntryTable(amount=11000, distribution_date=datetime.strptime("2024-12-17", "%Y-%m-%d"), revenue_type=RevenueType.SALES, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=5),
        RevenueEntryTable(amount=7500, distribution_date=datetime.strptime("2024-12-18", "%Y-%m-%d"), revenue_type=RevenueType.ROYALTY, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=5),
        RevenueEntryTable(amount=9500, distribution_date=datetime.strptime("2024-12-19", "%Y-%m-%d"), revenue_type=RevenueType.SALES, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=5),
        RevenueEntryTable(amount=8200, distribution_date=datetime.strptime("2024-12-20", "%Y-%m-%d"), revenue_type=RevenueType.AD_REVENUE, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=5),
        RevenueEntryTable(amount=10500, distribution_date=datetime.strptime("2024-12-21", "%Y-%m-%d"), revenue_type=RevenueType.ROYALTY, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=5),
    ]

    # Revenue entries for CrowdFundProjectTable(id=6) - "Smart Indoor Garden"
    revenue_entries_project_6 = [
        RevenueEntryTable(amount=13000, distribution_date=datetime.strptime("2024-11-15", "%Y-%m-%d"), revenue_type=RevenueType.SALES, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=6),
        RevenueEntryTable(amount=9500, distribution_date=datetime.strptime("2024-11-16","%Y-%m-%d"), revenue_type=RevenueType.AD_REVENUE, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=6),
        RevenueEntryTable(amount=12000, distribution_date=datetime.strptime("2024-12-17", "%Y-%m-%d"), revenue_type=RevenueType.SALES, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=6),
        RevenueEntryTable(amount=10800, distribution_date=datetime.strptime("2024-12-18", "%Y-%m-%d"), revenue_type=RevenueType.ROYALTY, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=6),
        RevenueEntryTable(amount=11500, distribution_date=datetime.strptime("2024-12-19", "%Y-%m-%d"), revenue_type=RevenueType.SALES, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=6),
        RevenueEntryTable(amount=7800, distribution_date=datetime.strptime("2024-12-20","%Y-%m-%d"), revenue_type=RevenueType.AD_REVENUE, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=6),
        RevenueEntryTable(amount=12500, distribution_date=datetime.strptime("2024-12-21", "%Y-%m-%d"), revenue_type=RevenueType.ROYALTY, revenue_status=RevenueStatus.DISTRIBUTED, crowd_fund_project_id=6),
    ]


    
    # Add User Tables
    for user in default_users:
        db.add(user)
        db.commit()
    
    # Add User Location Tables
    for user_location in default_user_locations:
        db.add(user_location)
        db.commit()
    
    # Add User Location Bridge Tables
    for user_bridge_location in default_bridge_user_location:
        db.add(user_bridge_location)
        db.commit()

    # Add CFP Project Tables
    for crowd_fund_project in default_crowd_fund_projects:
        crowd_fund_project.update_progress()
        crowd_fund_project.update_valuation()
        if crowd_fund_project.id == 1:
            crowd_fund_project.total_units = 18
        if crowd_fund_project.id == 4:
            crowd_fund_project.total_units = 0
        db.add(crowd_fund_project)
        db.commit()
    # Add CFP Location Tables
    for cfp_location in default_cfp_locations:
        db.add(cfp_location)
        db.commit()
    # Add CFP Location Bridge Tables
    for cfp_bridge_location in default_bridge_cfp_locations:
        db.add(cfp_bridge_location)
        db.commit()

    # Add Investment Bridge Tables
    for investments in default_investment_bridges:
        db.add(investments)
        db.commit()

    # Add Revenue Entry Tables
    for revenue_entry in revenue_entries_project_4:
        db.add(revenue_entry)
    for revenue_entry in revenue_entries_project_5:
        db.add(revenue_entry)
    for revenue_entry in revenue_entries_project_6:
        db.add(revenue_entry)
    db.commit()

@app.on_event("startup")
def startup_event():
    db = SessionLocal()  
    try:
        add_default_data(db)  
    finally:
        db.close()  


