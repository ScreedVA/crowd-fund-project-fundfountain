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
function InvestorPortfolio() {
  const [chartData, setChartData] = useState<any>();
  const [barchartData, setBarchartData] =
    useState<InvestorShareSummaryModel[]>();
  const [piechartData, setPiechartData] =
    useState<InvestorBalanceDistributionModel[]>();
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

    selectedIndex == 0 && initBarchartData();
    selectedIndex == 1 && initPiechartData();
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
              {selectedIndex == 2 && <StackedLineChart />}
            </div>
          </div>
          <div className="investor-right">
            <h2>Stacked Line Chart</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvestorPortfolio;
