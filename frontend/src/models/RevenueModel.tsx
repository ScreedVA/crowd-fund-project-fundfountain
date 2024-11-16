interface RevenueBaseModel {
  id: number;
  projectId: number;
}

export interface RevenueEntryListModel extends RevenueBaseModel {
  dateList: string[];
  amountList: number[];
}

export interface RevenueEntryModel extends RevenueBaseModel {
  date: string;
  amount: number;
  fileIdList: number[];
}

export interface RevenueSummaryModel extends RevenueBaseModel {
  revenueAggregateTotal: number;
  revenueEntryCount: number;
}

export interface CreateRevenueReportFormDataSchema {
  distributionDate: string;
  amount: number;
}
