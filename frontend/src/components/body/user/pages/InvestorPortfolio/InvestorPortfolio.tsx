import { useEffect, useState } from "react";
import BarChart from "../../../../templates/Charts/BarChart/BarChart";
import PieChart from "../../../../templates/Charts/PieChart/PieChart";
import "./InvestorPortfolio.css";
import {
  InvestorBalanceDistributionToProjectsModel,
  InvestorShareSummaryModel,
} from "../../../../../models/InvestorModel";
import {
  fetchCurrentInvestorBalanceDistribution,
  fetchCurrentInvestorShareList,
} from "../../../../../services/InvestorService";
import StackedLineChart from "../../../../templates/Charts/StackedLineChart/StackedLineChart";
import { fetchRevenueEntriesList } from "../../../../../services/RevenueService";
import { RevenueEntryListModel } from "../../../../../models/RevenueModel";
import ProjectList from "../../../../templates/CFProjects/ProjectList/ProjectList";
import { CFProjectSummary } from "../../../../../models/ProjectModel";
import { fetchInvestorProjectListHttpRequest } from "../../../../../services/ProjectService";
import TabMenu from "../../../../templates/Navigation/TabNavigation/TabMenu";
function InvestorPortfolio() {
  const [barchartData, setBarchartData] = useState<InvestorShareSummaryModel[]>();
  const [piechartData, setPiechartData] = useState<InvestorBalanceDistributionToProjectsModel[]>();
  const [stackedLinechartData, setStackedLinechartData] = useState<RevenueEntryListModel[]>();
  const [investorProjectList, setInvestorProjectList] = useState<CFProjectSummary[]>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectOptions: string[] = ["Shares Owned", "Investment Distribution", "Project Revenue History"];
  // fetch Barchart Data
  async function initBarchartData() {
    const response: Response = await fetchCurrentInvestorShareList();
    const investorShareList: InvestorShareSummaryModel[] = await response.json();
    setBarchartData(investorShareList);
  }

  async function initPiechartData() {
    const resposne: Response = await fetchCurrentInvestorBalanceDistribution();
    const investorBalanceDistributionList: InvestorBalanceDistributionToProjectsModel[] = await resposne.json();
    setPiechartData(investorBalanceDistributionList);
  }

  async function initStackedLinechartData() {
    const response: Response = await fetchRevenueEntriesList(7);
    const revenueEntriesList: RevenueEntryListModel[] = await response.json();
    setStackedLinechartData(revenueEntriesList);
  }

  async function initInvestorProjectList() {
    const response = await fetchInvestorProjectListHttpRequest();
    const investorProjectListResponse = await response.json();
    setInvestorProjectList(investorProjectListResponse);
  }

  useEffect(() => {
    initInvestorProjectList();

    selectedIndex == 0 && initBarchartData();
    selectedIndex == 1 && initPiechartData();
    selectedIndex == 2 && initStackedLinechartData();
  }, [selectedIndex]);

  return (
    <>
      <div className="investor-container">
        <div className="investor-wrapper">
          <div className="investor-left">
            <div className="investor-menu-container">
              <TabMenu
                selectOptions={selectOptions}
                sendSelectedIndexFromTabMenu={setSelectedIndex}
                selectedIndex={selectedIndex}
              />
            </div>
            <div className="investor-chart-container">
              {barchartData && selectedIndex == 0 && (
                <BarChart
                  xAxisData={barchartData.map((value: any) => value.projectName)}
                  yAxisData={barchartData.map((value: any) => value.sharePercentage)}
                />
              )}
              {piechartData && selectedIndex == 1 && (
                <PieChart
                  seriesData={piechartData.map((invBalObject: InvestorBalanceDistributionToProjectsModel) => ({
                    value: invBalObject.totalInvestmentAgainstInvestorBalanceAmount,
                    name: invBalObject.projectName,
                  }))}
                />
              )}
              {stackedLinechartData && selectedIndex == 2 && (
                <StackedLineChart revenueEntriesList={stackedLinechartData} />
              )}
            </div>
          </div>
          <div className="investor-right">
            <h2 style={{ textAlign: "center" }}>Project List</h2>
            <div className="project-list">
              {investorProjectList && <ProjectList projectList={investorProjectList} isNavigatorList={true} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvestorPortfolio;
