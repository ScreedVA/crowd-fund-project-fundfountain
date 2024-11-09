from schemas import InvestorShareSummarySchema, BalanceDetailSchema
from models import Investment, UserTable, CrowdFundProjectTable


def transform_to_balance_details_schema_from_user_model(model: UserTable) -> BalanceDetailSchema:
    result = BalanceDetailSchema(
        userId=model.id,
        bankAccountBalance=model.bank_account_balance,
        balanceSpent=model.balance_spent
    )
    return result

