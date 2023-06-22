"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/PortfolioValueLineChart.css";

const PortfolioValueLineChart = ({ portfolioValuePerDay }) => {
  const data = portfolioValuePerDay.map(({ date, total }) => ({
    date,
    total: parseFloat(total),
  }));

  const lowestValue = Math.min(...data.map((entry) => entry.total));
  const yAxisDomain = [lowestValue - 100, "auto"];
  // console.log("portfolioValuePerDay", portfolioValuePerDay)
  // console.log("First date", portfolioValuePerDay[0].date);
  // console.log(
  //   "Last date",
  //   portfolioValuePerDay[portfolioValuePerDay.length - 1].date
  // );

  return (
    <div className="portfolio-value-table-container">
      <h2 className="portfolio-value-table-title">
        Portfolio Growth
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={yAxisDomain} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            name="Portfolio Value"
            stroke="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioValueLineChart;
