export enum CFPDashboardTabMenuOptions {
  PROJECT_DETAILS = "Project Details",
  SHARE_DISTRIBUTION = "Share Distribution",
  INVESTOR_LIST = "Investor List",
  EDIT_PROJECT = "Edit Project",
  REVENUE_DASHBOARD = "Revenue Dashboard",
}

export enum RevenueDashboardTabMenuOptions {
  REVENUE_SUMMARY = "Revenue Summary",
  ENTRY_LIST = "Entry List",
  REPORT_REVENUE = "Report Revenue",
}

export interface TabMenuCustomConfig {
  listXAlignment?: string;
  unorderedListStyles?: {
    borderBottom?: string;
  };
  listItemBorderStyles?: {
    borderBottom?: string;
  };
}
