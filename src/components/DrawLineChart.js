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
const DrawLineChart = ({ data, yAxisDomain }) => {
  return (
    <div>
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

export default DrawLineChart;
