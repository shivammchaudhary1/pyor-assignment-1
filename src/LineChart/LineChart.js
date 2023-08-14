import React, { useState, useEffect } from "react";
import axios from "axios";
import * as echarts from "echarts";
import styles from "./LineChart.module.css";

function LineChart() {
  const [selectedAsset, setSelectedAsset] = useState("ethereum");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedAsset]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${selectedAsset}/market_chart?vs_currency=usd&days=365&interval=daily`
      );
      const data = response.data.prices;
      // setChartData(data);
      setChartData(data.slice(0, 100));
      console.log(data);
      renderLineChart(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderLineChart = (data) => {
    const chartElement = document.getElementById("lineChartContainer");
    const chart = echarts.init(chartElement, "dark");

    const option = {
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          areaStyle: {},
          type: "line",
          data: data.map(([timestamp, value]) => ({
            name: new Date(timestamp).toLocaleDateString(),
            value: [timestamp, value],
          })),
        },
      ],
    };

    chart.setOption(option);
  };

  return (
    <div className="line-chart-container">
      <div className="line-chart-scrollbar">
        <select
          className="line-chart-select"
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="filecoin">Filecoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="dogecoin">Dogecoin</option>
          <option value="solana">Solana</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="optimism">Optimism</option>
        </select>
      </div>
      <p className="show-chat-heading">
        Price Chart {selectedAsset[0].toUpperCase() + selectedAsset.slice(1)}
      </p>
      <div
        id="lineChartContainer"
        className="line-chart"
        style={{ width: "100wh", height: "500px" }}
      ></div>
    </div>
  );
}

export default LineChart;
