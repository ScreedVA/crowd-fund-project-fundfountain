from enum import Enum

class ProjectStatus(Enum):
    PENDING_APPROVAL = "Pending Approval"
    ACTIVE = "Active"
    FUNDED = "Funded"

class FundingModel(Enum):
    FIXED_PRICE = "Fixed Price"
    MICRO_INVESTMENT = "Micro-Investment"

class InvestmentStatus(Enum):
    PENDING = "Pending"
    COMMITED = "Commited"
    PAID = "Paid"

class RevenueType(Enum):
    RENTAL_INCOME = "Rental Income"
    SALES = "Sales"
    AD_REVENUE = "Ad Revenue"
    ROYALTY = "Royalty"

class RevenueStatus(Enum):
    PENDING_DISTRIBUTION = "Pending Distribution"
    DISTRIBUTED = "Distributed"
    

class UserPermissions(Enum):
    CAN_EDIT = "CAN_EDIT"
    CAN_DELETE = "CAN_DELETE"
    CAN_INSERT = "CAN_INSERT"


# Filter Enums

class ContentDispositionFilter(str, Enum):
    ATTACHTMENT = "attachment"
    INLINE = "inline"