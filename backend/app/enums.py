from enum import Enum

class ProjectStatus(Enum):
    PENDING_APPROVAL = "Pending Approval"
    ACTIVE = "Active"
    FUNDED = "Funding"
    COMPLETE = "Complete"

class FundingModel(Enum):
    FIXED_PRICE = "Fixed Price"
    MICRO_INVESTMENT = "Micro Investment"