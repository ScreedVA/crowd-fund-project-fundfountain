export interface InvestorShareSummaryModel {
  investorName: string;
  projectName: string;
  sharePercentage: number;
}

export interface InvestorBalanceDistributionModel {
  investorId: number;
  projectId: number;
  projectName: string;
  totalInvestment: number;
  ratioPercentage: number;
}
