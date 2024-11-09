import "./StackedLineChart.css";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { RevenueEntriesModel } from "../../../../models/RevenueModel";
import { getDateRangeAndData } from "../../../../services/CommonService";
interface StackedLineChartProps {
  revenueEntriesList: RevenueEntriesModel[];
}

const StackedLineChart: React.FC<StackedLineChartProps> = ({
  revenueEntriesList,
}) => {
  const charRef = useRef(null);

  useEffect(() => {
    const charInstance = echarts.init(charRef.current);
    const { dateArray } = getDateRangeAndData(revenueEntriesList);

    const options = {
      title: {
        text: "Project Revenue History",
        textStyle: {
          color: "#FFFFFF",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        textStyle: {
          color: "#FFFFFF",
        },
        data: revenueEntriesList.map((value) => value.projectName),
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          color: "#FFFFFF",
        },
        data: revenueEntriesList[0].dateList,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#FFFFFF",
        },
      },
      series: revenueEntriesList.map((entry) => ({
        name: entry.projectName,
        type: "line",
        stack: "Total",
        data: entry.amountList,
      })),
    };

    charInstance.setOption(options);
    const resizeChart = () => {
      charInstance.resize();
    };

    window.addEventListener("resize", resizeChart);

    return () => {
      window.removeEventListener("resize", resizeChart);
      charInstance.dispose();
    };
  }, []);
  return (
    <>
      <div className="stackedlinechart-container">
        <div
          ref={charRef} // Attach ref to div where ECharts will render
          className="stackedlinechart-body"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </>
  );
};

export default StackedLineChart;
