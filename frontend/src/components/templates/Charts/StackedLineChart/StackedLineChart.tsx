import "./StackedLineChart.css";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";

function StackedLineChart() {
  const charRef = useRef(null);

  useEffect(() => {
    const charInstance = echarts.init(charRef.current);

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
        data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
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
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#FFFFFF",
        },
      },
      series: [
        {
          name: "Email",
          type: "line",
          stack: "Total",
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "Union Ads",
          type: "line",
          stack: "Total",
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "Video Ads",
          type: "line",
          stack: "Total",
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: "Direct",
          type: "line",
          stack: "Total",
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: "Search Engine",
          type: "line",
          stack: "Total",
          data: [820, 932, 901, 934, 1290, 1330, 1320],
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
      <div className="stackedlinechart-container">
        <div
          ref={charRef} // Attach ref to div where ECharts will render
          className="stackedlinechart-body"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </>
  );
}

export default StackedLineChart;
