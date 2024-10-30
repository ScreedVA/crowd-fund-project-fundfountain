import { ReadLocationRequest } from "./LocationModel";

export enum ProjectStatus {
  PENDING_APPROVAL = "Pending Approval",
  ACTIVE = "Active",
  FUNDING = "Funding",
  COMPLETE = "Complete",
}

export enum FundingModel {
  FIXED_PRICE = "Fixed Price",
  MICRO_INVESTMENT = "Micro-Investment",
}

interface CrowdFundProjectBaseModel {
  name: string;
  description: string;
  fundGoal: number;
  currentFund: number;
  startDate: string;
  unitPrice: number;
  lastDate: string;
  totalUnits: number;
  valuation: number;
  status: ProjectStatus;
  fundingModel: FundingModel;
  fundingProgress: number;
}

export interface CrowdFundProjectSummary {
  id?: number;
  name: string;
  description: string;
}

export interface ReadCrowdFundProjectRequest extends CrowdFundProjectBaseModel {
  id: number;
  location?: ReadLocationRequest;
}

export interface InvestRequestModel {
  amount: number;
  unitCount: number;
}
