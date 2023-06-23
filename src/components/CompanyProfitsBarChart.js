"use client";
import React from 'react';
import { BarChart, XAxis, YAxis, Bar, Cell, Legend, Tooltip } from "recharts";
import "../styles/PortfolioValueTable.css";
import randomColor from 'randomcolor';

const CompanyProfitsBarChart = ({ userInputData, portfolioValuePerDay }) => {
  // Extracting the data for the chart
  const rows = Object.keys(portfolioValuePerDay);
  const companies = Object.keys(userInputData.portfolioAllocation);
  // Configuring the chart data
  const chartData = rows.map((row) => {
    const data = {
      date: new Date(portfolioValuePerDay[row].date).toLocaleDateString(), // Convert date to string representation
    };
    companies.forEach((company) => {
      data[company] = portfolioValuePerDay[row].profits[company];
    });
    return data;
  });

  // Generating colors for companies
  const companyColors = companies.reduce((colors, company, index) => {
    colors[company] = `hsl(${(index * (360 / companies.length)) % 360}, 70%, 50%)`;
    return colors;
  }, {});

  // Configuring the chart options
  const chartColors = companies.map((company) => companyColors[company]);

  return (
    <div className="portfolio-value-table-container" style={{ width: "100%", overflowX: "auto" }}>
      <h2 className="portfolio-value-table-title">Profits and Losses per day</h2>
      <BarChart width={chartData.length * 60} height={300} data={chartData} barCategoryGap={10}>
        <XAxis dataKey="date" />
        <YAxis />
        <Legend />
        <Tooltip />
        {companies.map((company, index) => (
          <Bar
            key={company}
            dataKey={company}
            fill={companyColors[company]}
          >
            {chartData.map((entry, entryIndex) => (
              <Cell
                key={`cell-${entryIndex}`}
                fill={chartColors[index]}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </div>
  );
};

export default CompanyProfitsBarChart;
