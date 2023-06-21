"use client";
import "../styles/PortfolioValueStackedBarChart.css";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PortfolioValueStackedBarChart = ({ portfolioValuePerDay }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartData = prepareChartData(portfolioValuePerDay);
    createChart(chartRef.current, chartData);
  }, [portfolioValuePerDay]);

  const prepareChartData = (data) => {
    const categories = [];
    const series = [];

    data.forEach((item) => {
      const { date, stocks } = item;

      categories.push(date);

      Object.keys(stocks).forEach((stock) => {
        const existingSeries = series.find((series) => series.label === stock);
        if (existingSeries) {
          existingSeries.data.push(stocks[stock]);
        } else {
          series.push({
            label: stock,
            data: [stocks[stock]],
          });
        }
      });
    });

    return { categories, series };
  };

  const createChart = (canvas, data) => {
    new Chart(canvas, {
      type: "bar",
      data: {
        labels: data.categories,
        datasets: data.series.map((serie) => ({
          label: serie.label,
          data: serie.data,
        })),
      },
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
  };

  return (
    <div className="portfolio-value-table-container">
      <h2 className="portfolio-value-table-title">
        Daily Profits and Losses of the company
      </h2>
      <canvas ref={chartRef} />
    </div>
  );
};

export default PortfolioValueStackedBarChart;
