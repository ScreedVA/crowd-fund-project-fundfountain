import { ReadLocationRequest } from "./LocationModel";

export enum ProjectStatus {
  PENDING_APPROVAL = "Pending Approval",
  ACTIVE = "Active",
  FUNDED = "Funded",
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
  status: ProjectStatus;
  ownerId: number;
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
  ownerId: number;
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

export interface LoginFormModel {
  username: string;
  password: string;
}

export interface InvestRequestModel {
  microInvestmentAmount?: number;
  unitsToInvest?: number;
}

export interface cfpFilterModel {
  name: string;
  status: ProjectStatus;
  fundingModel: FundingModel;
}
