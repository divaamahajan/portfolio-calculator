"use client";
import React from "react";
import "../styles/PortfolioValueTable.css";

const PortfolioAllocationTable = (props) => {
  const { initialAllocation, finalAllocation } = props;
  const calculateTotal = (allocation) => {
    const firstStock = Object.keys(allocation)[0];
    const total = allocation[firstStock].total;
    return total;
  };

  const initialTotal = calculateTotal(initialAllocation);
  const finalTotal = calculateTotal(finalAllocation);
  return (
    <div className="portfolio-value-table-container">
      <h2 className="portfolio-value-table-title">Portfolio Allocation</h2>
      <table className="portfolio-value-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Initial Allocation (USD)</th>
            <th>End Date Allocation (USD) </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(initialAllocation).map((stock) => (
            <tr key={stock}>
              <td>{stock}</td>
              <td>
                $ {initialAllocation[stock].stockPrice} (
                {initialAllocation[stock].allocation}%)
              </td>
              <td>
                $ {finalAllocation[stock].stockPrice} (
                {finalAllocation[stock].allocation}%)
              </td>
            </tr>
          ))}
        </tbody>
        <tr>
          <th>Total (USD)</th>
          <th>$ {initialTotal}</th>
          <th>
            $ {finalTotal} (
            {(((finalTotal - initialTotal) * 100) / initialTotal).toFixed(2)}%)
          </th>
        </tr>
      </table>
    </div>
  );
};

export default PortfolioAllocationTable;
