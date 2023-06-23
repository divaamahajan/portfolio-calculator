"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import randomColor from 'randomcolor';

const CumulativeProfitsAreaChart = ({ userInputData, portfolioValuePerDay }) => {
  const data = portfolioValuePerDay.map(({ date, profits }) => ({
    date,
    ...profits,
  }));
  console.log("data",data)
  console.log("Object.keys(data[0])",Object.keys(data[0]))
  const colors = randomColor({
    count: Object.keys(userInputData.portfolioAllocation).filter((key) => key !== 'date').length,
    hue: 'blue',
    luminosity: 'light',
    format: 'rgb',
  });
  
  return (
    <div className="portfolio-value-table-container">
    <h2 className="portfolio-value-table-title">Cumulative Profits </h2>
    <AreaChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      {Object.keys(userInputData.portfolioAllocation)
        // .filter((key) => key !== 'date')
        .map((company, index) => (
          <Area
            key={company}
            dataKey={company}
            stackId="profits"
            stroke={colors[index]}
            fill={colors[index]}
          />
        ))}
    </AreaChart>
    </div>
  );
};

export default CumulativeProfitsAreaChart;
