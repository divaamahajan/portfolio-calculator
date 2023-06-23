"use client";
import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import PortfolioAllocationChartWithLegend from "./PortfolioAllocationChartWithLegend";
import PortfolioValueTable from "./PortfolioValueTable";
import "../styles/VisualisationTabs.css";
import PortfolioValueLineChart from "./PortfolioValueLineChart";
import PortfolioValueStackedBarChart from "./PortfolioValueStackedBarChart";
// import StockPriceCandlestickChart from "./StockPriceCandlestickChart";
// import CompanyProfitsBarChart from "./CompanyProfitsBarChart";
import CumulativeProfitsAreaChart from "./CumulativeProfitsAreaChart";
import "react-tabs/style/react-tabs.css";

const VisualisationTabs = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const { tradingData, userInputData } = props;
  const startDate = userInputData.startDate;
  const endDate = userInputData.endDate;
  const initialBalance = userInputData.initialBalance; // 32500
  const portfolioAllocation = userInputData.portfolioAllocation; //AAPL: 0.2,   GOOG: 0.5,  MSFT: 0.3
  // console.log("portfolioAllocation", portfolioAllocation)
  // console.log("tradingData", tradingData)
  // console.log("userInputData", userInputData)

  const portfolioValue = {};
  Object.keys(tradingData.data).forEach((stock) => {
    const stockData = tradingData.data[stock]; //AAPL, GOOG, MSFT
    const stockDates = Object.keys(stockData); //2019-02-01, 2019-01-31, 2019-01-30

    stockDates.sort((a, b) => new Date(b) - new Date(a)); // Sort dates in descending order

    const defaultStartDate = stockDates[stockDates.length - 1]; // oldest date as the default start date
    stockDates.forEach((date) => {
      if (date >= startDate && date <= endDate) {
        // console.log("inside if statement");
        if (!portfolioValue[date]) {
          portfolioValue[date] = {
            total: 0,
            stocks: {},
            profits: {},
          };
        }
        const allocationPercentage = portfolioAllocation[stock];
        const stockPrice = stockData[date].close;
        const sharesCount =
          (initialBalance * allocationPercentage) / stockPrice;
        const stockValue = sharesCount * stockPrice;

        portfolioValue[date].stocks[stock] = stockValue;
        portfolioValue[date].total += stockValue;
        // console.log("portfolioValue[date].total", portfolioValue[date].total);

        const initialStockPrice = !stockData[startDate]
          ? stockData[defaultStartDate].close // Use the default start date for initial stock price
          : stockData[startDate].close; // Use the specified start date for initial stock price

        const currentStockPrice = stockPrice;
        const profit = sharesCount * (currentStockPrice - initialStockPrice);

        portfolioValue[date].profits[stock] = profit;
      }
    });
  });

  console.log("portfolioValue", portfolioValue)
  const dates = Object.keys(portfolioValue);
  const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));
  const sortedPortfolioValue = {};
  sortedDates.forEach((date) => {
    sortedPortfolioValue[date] = portfolioValue[date];
  });
  const result = {
    totalPortfolioValue: sortedPortfolioValue[endDate].total.toFixed(2),
    portfolioAllocation: Object.keys(portfolioAllocation).reduce(
      (allocationObj, stock) => {
        allocationObj[stock] = {
          allocation: (portfolioAllocation[stock] * 100).toFixed(1), // Multiply by 100 to display as percentage
          stockSpent: (initialBalance * portfolioAllocation[stock]).toFixed(2),
        };
        return allocationObj;
      },
      {}
    ),
    portfolioValuePerDay: Object.keys(sortedPortfolioValue).map((date) => {
      const portfolioDateValue = sortedPortfolioValue[date];
      const stocks = portfolioDateValue.stocks;
      const stockValues = Object.keys(stocks).reduce(
        (stockValuesObj, stock) => {
          const stockSpent = (
            initialBalance * portfolioAllocation[stock]
          ).toFixed(2);
          const stockProfit = portfolioDateValue.profits[stock].toFixed(2);
          const stockValue = (
            parseFloat(stockSpent) + parseFloat(stockProfit)
          ).toFixed(2);
          stockValuesObj[stock] = stockValue;
          return stockValuesObj;
        },
        {}
      );

      const totalProfit = Object.values(portfolioDateValue.profits).reduce(
        (total, profit) => total + profit
      );

      return {
        date,
        stocks: stockValues,
        profits: portfolioDateValue.profits,
        total: (portfolioDateValue.total + totalProfit).toFixed(2),
      };
    }),
  };

  return (
    <div className="pb-44">
      <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
        <TabList className="custom-tab-list">
          <Tab className="custom-tab">Portfolio Breakdown</Tab>
          <Tab className="custom-tab">Daily Portfolio Value Table</Tab>
          <Tab className="custom-tab">Daily Portfolio Growth Chart</Tab>
          <Tab className="custom-tab">Daily Stocks Stacked Growth</Tab>
          {/* <Tab className="custom-tab">Stock Price Candlestick Chart</Tab> */}
          {/* <Tab className="custom-tab">Daily Profits and Losses</Tab> */}
          <Tab className="custom-tab">Cumulative Profits and Losses</Tab>
        </TabList>

        <TabPanel>
          <PortfolioAllocationChartWithLegend
            userInputData={userInputData}
            portfolioValuePerDay={result.portfolioValuePerDay[result.portfolioValuePerDay.length - 1]}
          />
        </TabPanel>
        <TabPanel>
          <PortfolioValueTable
            portfolioValuePerDay={result.portfolioValuePerDay}
            initialBalance={initialBalance}
          />
        </TabPanel>
        <TabPanel>
          <PortfolioValueLineChart
            portfolioValuePerDay={result.portfolioValuePerDay}
          />
        </TabPanel>
        <TabPanel>
          <PortfolioValueStackedBarChart
            portfolioValuePerDay={result.portfolioValuePerDay}
          />
        </TabPanel>
        {/* <TabPanel>
          <StockPriceCandlestickChart tradingData={tradingData.data} />
        </TabPanel> */}
        {/* <TabPanel>
          <CompanyProfitsBarChart
            portfolioValuePerDay={result.portfolioValuePerDay}
          />
        </TabPanel> */}
        <TabPanel>
          <CumulativeProfitsAreaChart
            portfolioValuePerDay={result.portfolioValuePerDay}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default VisualisationTabs;
