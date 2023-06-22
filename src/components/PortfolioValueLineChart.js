"use client";
import React from "react";
import "../styles/PortfolioValueLineChart.css";
import DrawLineChart from "./DrawLineChart";

const PortfolioValueLineChart = ({ portfolioValuePerDay }) => {
  const data = portfolioValuePerDay.map(({ date, stocks, total }) => ({
    date,
    stocks,
    total: parseFloat(total),
  }));
  const stocks_data = {};

  for (let i = 0; i < data.length; i++) {
    const currentDate = data[i].date;
    const stocks = data[i].stocks;

    for (const stock in stocks) {
      if (stocks.hasOwnProperty(stock)) {
        const total = stocks[stock];
        if (!stocks_data.hasOwnProperty(stock)) {
          stocks_data[stock] = [];
        }
        stocks_data[stock].push({ date: currentDate, total: total });
      }
    }
  }
  const calculateYAxisDomain = (data) => {
    const lowestValue = Math.min(...data.map((entry) => entry.total));
    const yAxisDomain = [lowestValue - 100, "auto"];
    return yAxisDomain;
  };
  const stocks = Object.keys(stocks_data);

  console.log("stocks_data", stocks_data);
  return (
    <div>
      <div className="line-chart-container">
        <h2 className="portfolio-value-table-title">Total Portfolio Growth</h2>
        <DrawLineChart data={data} yAxisDomain={calculateYAxisDomain(data)} />
      </div>
      {stocks.map((stock) => (
        <div key={stock}>
          <div className="line-chart-container">
            <h2 className="portfolio-value-table-title">
              Portfolio Growth of {stock}
            </h2>
            <DrawLineChart
              data={stocks_data[stock]}
              yAxisDomain={calculateYAxisDomain(stocks_data[stock])}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioValueLineChart;
