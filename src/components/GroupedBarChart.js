import React from "react";
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from "recharts";

const GroupedBarChart = (props) => {
  const { stocks, initialAllocation, finalAllocation } = props;

  // Prepare data for the chart
  const data = stocks.map((stock) => ({
    stock,
    "End Date Returns (USD)": finalAllocation[stock].stockPrice,
    "Initial Allocation (USD)": initialAllocation[stock].stockPrice,
  }));

  return (
    <ResponsiveContainer width="75%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="stock" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="End Date Returns (USD)" fill="#8884d8" />
        <Bar dataKey="Initial Allocation (USD)" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GroupedBarChart;
