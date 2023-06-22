"use client";
import React from "react";
import PortfolioAllocationTable from "./PortfolioAllocationTable";
import PortfolioAllocationPieChart from "./PortfolioAllocationPieChart";
import "../styles/PortfolioAllocationChart.css"; // Import the CSS file
import GroupedBarChart from "./GroupedBarChart";

const PortfolioAllocationChartWithLegend = (props) => {
  const { userInputData, portfolioValuePerDay } = props;
  const initialBalance = userInputData.initialBalance; // 32500
  const portfolioAllocation = userInputData.portfolioAllocation; //AAPL: 0.2,   GOOG: 0.5,  MSFT: 0.3

  const calculatePortfolioAllocation = () => {
    const calculatedAllocation = {};

    Object.keys(portfolioAllocation).forEach((stock) => {
      const allocation = portfolioAllocation[stock];
      const stockPrice = (initialBalance * allocation).toFixed(2);

      calculatedAllocation[stock] = {
        allocation: (allocation * 100).toFixed(2),
        stockPrice: stockPrice,
        total: initialBalance,
      };
    });

    return calculatedAllocation;
  };
  const calculateEndDateAllocation = (initialPrice) => {
    console.log("portfolioValuePerDay", portfolioValuePerDay)
    const calculatedEndDateAllocation = {};

    Object.keys(portfolioValuePerDay.stocks).forEach((stock) => {
      const stockAllocation = stock;
      const stockPrice = portfolioValuePerDay.stocks[stock];
      calculatedEndDateAllocation[stockAllocation] = {
        allocation: (
          (stockPrice / initialPrice[stock].stockPrice - 1) *
          100
        ).toFixed(2),
        stockPrice: stockPrice,
        total: portfolioValuePerDay.total,
      };
    });

    return calculatedEndDateAllocation;
  };

  const calculatedPortfolioAllocation = calculatePortfolioAllocation();
  const calculatedEndDateAllocation = calculateEndDateAllocation(
    calculatedPortfolioAllocation
  );
  const sortedKeys = Object.keys(calculatedPortfolioAllocation).sort();
  const sortedCalculatedEndDateAllocation = {};
  const sortedCalculatedStartDateAllocation = {};

  for (const key of sortedKeys) {
    sortedCalculatedEndDateAllocation[key] = calculatedEndDateAllocation[key];
    sortedCalculatedStartDateAllocation[key] =
      calculatedPortfolioAllocation[key];
  }
  return (
    <div>
      <div className="chart-container">
        <div className="chart" style={{ maxHeight: "400px" }}>
          <h1 className="chart-title">Initial Allocation</h1>
          <PortfolioAllocationPieChart
            portfolioAllocation={sortedCalculatedStartDateAllocation}
          />
        </div>
        <div className="chart" style={{ maxHeight: "400px" }}>
          <h1 className="chart-title">End Date Returns</h1>
          {/* <PortfolioAllocationPieChart
            portfolioAllocation={sortedCalculatedEndDateAllocation}
          /> */}

          <GroupedBarChart
            stocks={sortedKeys}
            initialAllocation={sortedCalculatedStartDateAllocation}
            finalAllocation={sortedCalculatedEndDateAllocation}
          />
        </div>
      </div>
      <div>
        <PortfolioAllocationTable
          initialAllocation={sortedCalculatedStartDateAllocation}
          finalAllocation={sortedCalculatedEndDateAllocation}
        />
      </div>
    </div>
  );
};

export default PortfolioAllocationChartWithLegend;
