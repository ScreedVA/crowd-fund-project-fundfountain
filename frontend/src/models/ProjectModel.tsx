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

interface CFProjectBaseModel {
  name: string;
  description: string;
}

export interface CFProjectSummary extends CFProjectBaseModel {
  id?: number;
}

export interface ReadCFProjectModel extends CFProjectBaseModel {
  id: number;
  fundGoal: number;
  currentFund: number;
  startDate: string;
  lastDate: string;
  unitPrice: number;
  totalUnits: number;
  valuation: number;
  status: ProjectStatus;
  fundingModel: FundingModel;
  fundingProgress: number;
  location?: ReadLocationRequest;
}

export interface CreateCFProjectModel extends CFProjectBaseModel {
  fundGoal: number;
  unitPrice: number;
  startDate: string;
  lastDate: string;
  status: ProjectStatus;
  fundingModel: FundingModel;
}

export interface UpdateCFProjectModel extends CFProjectBaseModel {
  location?: ReadLocationRequest;
}

export interface InvestRequestModel {
  amount: number;
  unitCount: number;
}
