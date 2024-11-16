import { useEffect, useState } from "react";
import TabMenu from "../../Navigation/TabNavigation/TabMenu";
import "./RevenueDashboard.css";
import { TabMenuCustomConfig } from "../../../../models/TabMenuModel";
import { fetchRevenueEntries, fetchRevenueSummary } from "../../../../services/RevenueService";
import { RevenueEntriesModel, RevenueSummaryModel } from "../../../../models/RevenueModel";
import { RevenueDashboardTabMenuOptions } from "../../../../models/TabMenuModel";
import RevenueDetails from "../RevenueDetails/RevenueDetails";
import RevenueList from "../RevenueList/RevenueList";
import RevenueReportForm from "../ReveueReportForm/RevenueReportForm";
interface RevenueDashboardProps {
  tabMenuCustomConfig?: TabMenuCustomConfig;
  projectId: number;
}

const RevenueDashboard: React.FC<RevenueDashboardProps> = ({ tabMenuCustomConfig, projectId }) => {
  const [options, setOptions] = useState([
    RevenueDashboardTabMenuOptions.REVENUE_SUMMARY,
    RevenueDashboardTabMenuOptions.ENTRY_LIST,
    RevenueDashboardTabMenuOptions.REPORT_REVENUE,
  ]);
  const [tabSelectedIndex, setTabSelectedIndex] = useState<number>(0);
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummaryModel>();
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntriesModel>();
  async function initRevenueSummary() {
    const response: Response = await fetchRevenueSummary(projectId);
    const revenueSummaryResponse: RevenueSummaryModel = await response.json();
    setRevenueSummary(revenueSummaryResponse);
  }

  async function initRevenueEntries() {
    const response: Response = await fetchRevenueEntries(projectId);
    const revenueEntriesResponse: RevenueEntriesModel = await response.json();
    setRevenueEntries(revenueEntriesResponse);
  }

  useEffect(() => {
    // Map Default Selection Tabs to Methods
    tabSelectedIndex == options.indexOf(RevenueDashboardTabMenuOptions.REVENUE_SUMMARY) && initRevenueSummary();
    tabSelectedIndex == options.indexOf(RevenueDashboardTabMenuOptions.ENTRY_LIST) && initRevenueEntries();
  }, [tabSelectedIndex]);

  return (
    <>
      <div className="revenue-dashboard-container">
        <div className="top-row">
          <TabMenu
            selectOptions={options}
            selectedIndex={tabSelectedIndex}
            sendSelectedIndexFromTabMenu={setTabSelectedIndex}
            custumTabConfig={tabMenuCustomConfig}
          />
        </div>
        <div className="bottom-row">
          {tabSelectedIndex == options.indexOf(RevenueDashboardTabMenuOptions.REVENUE_SUMMARY) && revenueSummary && (
            <RevenueDetails revenueSummaryFromParent={revenueSummary} />
          )}
          {tabSelectedIndex == options.indexOf(RevenueDashboardTabMenuOptions.ENTRY_LIST) && revenueEntries && (
            <div className="overflow-wrapper">
              <RevenueList
                liCustomWidthpx="40%"
                revenueDateAmountList={revenueEntries.dateList.map((date, index) => ({
                  date: date,
                  amount: revenueEntries.amountList[index],
                }))}
              />
            </div>
          )}
          {tabSelectedIndex == options.indexOf(RevenueDashboardTabMenuOptions.REPORT_REVENUE) && <RevenueReportForm />}
        </div>
      </div>
    </>
  );
};
export default RevenueDashboard;
