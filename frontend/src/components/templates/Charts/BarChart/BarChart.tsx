import "./BarChart.css";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";

interface BarChartProps {
  xAxisData: string[];
  yAxisData: number[];
}

const BarChart: React.FC<BarChartProps> = ({ xAxisData, yAxisData }) => {
  const charRef = useRef(null);

  useEffect(() => {
    const charInstance = echarts.init(charRef.current);
    const options = {
      title: {
        text: "Shares Owned(%)",
        textStyle: {
          color: "#FFFFFF",
        },
      },
      tooltip: {
        backgroundColor: "#FFFFFF",
        textStyle: {
          color: "#333333",
        },
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: "#D3E2F4",
          },
          axisLabel: {
            color: "#FFFFFF",
          },
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            color: "#D3E2F4", // Light blue-gray for axis line
          },
        },
        splitLine: {
          lineStyle: {
            color: "#3B5A7D", // Slightly lighter than background for grid lines
          },
        },
        axisLabel: {
          color: "#FFFFFF", // White labels on y-axis
        },
      },
      series: [
        {
          data: yAxisData,
          type: "bar",
          itemStyle: {
            color: "#00bcd4", // Orange color for bars
          },
        },
      ],
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
      <div className="barchart-container">
        <div
          ref={charRef} // Attach ref to div where ECharts will render
          className="barchart-body"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </>
  );
};

export default BarChart;
