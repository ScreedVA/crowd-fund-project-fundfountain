export interface InvestorShareSummaryModel {
  investorName: string;
  projectName: string;
  sharePercentage: number;
}

interface InvestorToProjectBridgeBase {
  investorId: number;
  investorName: string;
  projectId: number;
  projectName: string;
}

export interface InvestorBalanceDistributionToProjectsModel
  extends InvestorToProjectBridgeBase {
  totalInvestmentAgainstInvestorBalanceAmount: number;
  ratioPercentage: number;
}

export interface ProjectShareDistributionToInvestorsModel
  extends InvestorToProjectBridgeBase {
  sharesAgainstProjectValuationAmount: number;
  sharesAgainstProjectValuationPercentage: number;
}
