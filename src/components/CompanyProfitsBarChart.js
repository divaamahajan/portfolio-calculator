"use client";
import React from 'react';
import Chart from 'react-apexcharts';
import "../styles/PortfolioValueTable.css";

const CompanyProfitsBarChart = ({ portfolioValuePerDay }) => {
  // Extracting the data for the chart
  const rows = Object.keys(portfolioValuePerDay);
  const dates = Object.values(portfolioValuePerDay).map((item) => item.date);
  const companies = Object.keys(portfolioValuePerDay[rows[0]].profits);
  const series = rows.map((rows) =>
    companies.map((company) => portfolioValuePerDay[rows].profits[company])
  );

  // Configuring the chart options
  const options = {
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: dates,
      position: 'top',
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      crosshairs: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: 'Profit',
      },
      labels: {
        formatter: (value) => value.toFixed(2),
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        startingShape: 'flat',
        endingShape: 'flat',
      },
    },
    legend: {
      position: 'right',
      horizontalAlign: 'left',
    },
    dataLabels: {
      enabled: false,
    },
  };

  // Setting the chart data
  const chartData = {
    options: options,
    series: companies.map((company, index) => ({ name: company, data: series.map((data) => data[index]) })),
  };

  return (
    <div className="portfolio-value-table-container">
    <h2 className="portfolio-value-table-title">Profits and Losses per day </h2>
      <Chart options={chartData.options} series={chartData.series} type="bar" height={300} />
    </div>
  );
};

export default CompanyProfitsBarChart;
