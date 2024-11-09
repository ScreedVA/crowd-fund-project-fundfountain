import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface PieChartProps {
  seriesData: {
    value: number;
    name: string;
  }[];
}

const PieChart: React.FC<PieChartProps> = ({ seriesData }) => {
  const charRef = useRef(null);

  useEffect(() => {
    const charInstance = echarts.init(charRef.current);
    const options = {
      title: {
        text: "Investment Distribution($)",
        left: "center",

        textStyle: {
          color: "#FFFFFF",
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          color: "#FFFFFF",
        },
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "60%",
          data: seriesData,
          label: {
            color: "#FFFFFF",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
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

export default PieChart;
