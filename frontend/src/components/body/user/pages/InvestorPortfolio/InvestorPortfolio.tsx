import { useEffect, useState } from "react";
import BarChart from "../../../../templates/Charts/BarChart/BarChart";
import PieChart from "../../../../templates/Charts/PieChart/PieChart";
import "./InvestorPortfolio.css";
import {
  InvestorBalanceDistributionModel,
  InvestorShareSummaryModel,
} from "../../../../../models/InvestorModel";
import {
  fetchCurrentInvestorBalanceDistribution,
  fetchCurrentInvestorShareList,
} from "../../../../../services/InvestorService";
import InvestorMenuBar from "./pages/InvestorMenuBar";
import StackedLineChart from "../../../../templates/Charts/StackedLineChart/StackedLineChart";
import { fetchRevenueEntriesList } from "../../../../../services/RevenueService";
import { RevenueEntriesModel } from "../../../../../models/RevenueModel";
import ProjectList from "../../../../templates/ProjectList/ProjectList";
import { CFProjectSummary } from "../../../../../models/ProjectModel";
import { fetchInvestorProjectListHttpRequest } from "../../../../../services/ProjectService";
function InvestorPortfolio() {
  const [barchartData, setBarchartData] =
    useState<InvestorShareSummaryModel[]>();
  const [piechartData, setPiechartData] =
    useState<InvestorBalanceDistributionModel[]>();
  const [stackedLinechartData, setStackedLinechartData] =
    useState<RevenueEntriesModel[]>();
  const [investorProjectList, setInvestorProjectList] =
    useState<CFProjectSummary[]>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectOptions: string[] = [
    "Shares Owned",
    "Investment Distribution",
    "Project Revenue History",
  ];

  function handleMenuItemChange(index: number) {
    setSelectedIndex(index);
  }

  useEffect(() => {
    // fetch Barchart Data
    async function initBarchartData() {
      const response: Response = await fetchCurrentInvestorShareList();
      const investorShareList: InvestorShareSummaryModel[] =
        await response.json();
      setBarchartData(investorShareList);
    }
    async function initPiechartData() {
      const resposne: Response =
        await fetchCurrentInvestorBalanceDistribution();
      const investorBalanceDistributionList: InvestorBalanceDistributionModel[] =
        await resposne.json();
      setPiechartData(investorBalanceDistributionList);
    }
    async function initStackedLinechartData() {
      const response: Response = await fetchRevenueEntriesList(7);
      const revenueEntriesList: RevenueEntriesModel[] = await response.json();
      setStackedLinechartData(revenueEntriesList);
    }
    async function initInvestorProjectList() {
      const response = await fetchInvestorProjectListHttpRequest();
      const investorProjectListResponse = await response.json();
      setInvestorProjectList(investorProjectListResponse);
    }

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
              <InvestorMenuBar
                selectOptions={selectOptions}
                sendIndexToFromInvestorMenuBar={handleMenuItemChange}
                selectedIndex={selectedIndex}
              />
            </div>
            <div className="investor-chart-container">
              {barchartData && selectedIndex == 0 && (
                <BarChart
                  xAxisData={barchartData.map(
                    (value: any) => value.projectName
                  )}
                  yAxisData={barchartData.map(
                    (value: any) => value.sharePercentage
                  )}
                />
              )}
              {piechartData && selectedIndex == 1 && (
                <PieChart
                  seriesData={piechartData.map(
                    (invBalObject: InvestorBalanceDistributionModel) => ({
                      value: invBalObject.totalInvestment,
                      name: invBalObject.projectName,
                    })
                  )}
                />
              )}
              {stackedLinechartData && selectedIndex == 2 && (
                <StackedLineChart revenueEntriesList={stackedLinechartData} />
              )}
            </div>
          </div>
          <div className="investor-right">
            <h2>Project List</h2>
            <div className="project-list">
              {investorProjectList && (
                <ProjectList projectList={investorProjectList} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvestorPortfolio;
