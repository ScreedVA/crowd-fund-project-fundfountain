from models import CrowdFundProject
from schemas import CrowdFundProjectSummary


def transform_cfp_summary_from_model(model: CrowdFundProject) -> CrowdFundProjectSummary:
    schema: CrowdFundProjectSummary = CrowdFundProjectSummary(
        id=model.id,
        name=model.name,
        description=model.description
    )

    return schema

def transform_cfp_details_from_model(model: CrowdFundProject):
    pass