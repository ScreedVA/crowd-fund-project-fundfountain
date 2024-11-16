interface RevenueBaseModel {
  projectId: number;
  projectName: string;
  projectOwnerId: number;
  projectOwnerUsername: string;
}

export interface RevenueEntriesModel extends RevenueBaseModel {
  dateList: string[];
  amountList: number[];
}

export interface RevenueSummaryModel extends RevenueBaseModel {
  revenueAggregateTotal: number;
  revenueEntryCount: number;
}
