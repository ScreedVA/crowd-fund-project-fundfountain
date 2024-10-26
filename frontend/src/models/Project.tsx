import { ReadLocationRequest } from "./LocationModel";

enum ProjectStatus {
  PENDING_APPROVAL = "Pending Approval",
  ACTIVE = "Active",
  FUNDING = "Funding",
  COMPLETE = "Complete",
}

enum FundingModel {
  FIXED_PRICE = 1,
  MICRO_INVESTMENT = 2,
}

interface CrowdFundProjectBaseModel {
  name: string;
  description: string;
  fundGoal: number;
  currentFund: number;
  startDate: string;
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
