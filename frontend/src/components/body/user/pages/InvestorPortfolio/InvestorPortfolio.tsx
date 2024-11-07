import { useEffect, useState } from "react";
import BarChart from "../../../../templates/Charts/BarChart/BarChart";
import "./InvestorPortfolio.css";
import { InvestorShareSummaryModel } from "../../../../../models/InvestorModel";
import { fetchCurrentInvestorShareList } from "../../../../../services/InvestorService";
import InvestorMenuBar from "./pages/InvestorMenuBar";
function InvestorPortfolio() {
  const [chartData, setChartData] = useState<InvestorShareSummaryModel[]>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectOptions: string[] = ["Shares Owned", "Project Revenue History"];

  function handleMenuItemChange(index: number) {
    setSelectedIndex(index);
  }

  useEffect(() => {
    // fetch Barchart Data
    async function setBarchartData() {
      const response: Response = await fetchCurrentInvestorShareList();
      // if (response.status == 404) {
      //   alert("No investment data found");
      //   return;
      // }
      const investorShareList: InvestorShareSummaryModel[] =
        await response.json();
      setChartData(investorShareList);
    }
    selectedIndex == 0 && setBarchartData();
  }, [selectedIndex]);

  return (
    <>
      <div className="investor-container">
        <div className="investor-top">
          <div className="investor-top-left">
            <div className="investor-menu-container">
              <InvestorMenuBar
                selectOptions={selectOptions}
                sendIndexToFromInvestorMenuBar={handleMenuItemChange}
                selectedIndex={selectedIndex}
              />
            </div>
            <div className="investor-chart-container">
              {chartData && selectedIndex == 0 && (
                <BarChart
                  xAxisData={chartData.map((value) => value.projectName)}
                  yAxisData={chartData.map((value) => value.sharePercentage)}
                />
              )}
            </div>
          </div>
          <div className="investor-top-right">
            <h2>Stacked Line Chart</h2>
          </div>
        </div>
        <div className="investor-bottom">
          <h2>User List</h2>
        </div>
      </div>
    </>
  );
}

export default InvestorPortfolio;
