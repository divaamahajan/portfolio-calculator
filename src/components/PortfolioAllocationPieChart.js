"use client";
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import randomColor from 'randomcolor';
ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioAllocationPieChart = ({ portfolioAllocation }) => {
  // console.log(portfolioAllocation)
  const labels = Object.keys(portfolioAllocation);
  const dataset = labels.map(stock => portfolioAllocation[stock].stockPrice);
  const colors = generateColors(labels.length);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Balance spent (USD) $',
        data: dataset,
        backgroundColor: colors,
        borderColor: 'black',
        borderWidth: 1
      },
    ],
  };

  return (
    <div style={{ width: '75%', height: 'auto' }}>
      <Pie data={data} />
    </div>
  );
};

// Function to generate vibrant colors
const generateColors = (count) => {
  return randomColor({
    count: count,
    hue: 'blue',
    luminosity: 'light',
    format: 'rgb',
  });
};

export default PortfolioAllocationPieChart;
