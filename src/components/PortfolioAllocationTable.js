"use client";
import React from "react";
import "../styles/PortfolioValueTable.css";
import GroupedBarChart from "./GroupedBarChart";
import PortfolioAllocationPieChart from "./PortfolioAllocationPieChart";

const PortfolioAllocationTable = (props) => {
  const { initialAllocation, finalAllocation } = props;
  const calculateTotal = (allocation) => {
    const firstStock = Object.keys(allocation)[0];
    const total = allocation[firstStock].total;
    return total;
  };

  const initialTotal = calculateTotal(initialAllocation);
  const finalTotal = calculateTotal(finalAllocation);

  // Get the list of stocks
  const stocks = Object.keys(initialAllocation);

  const getPercentageClassName = (percentage) => {
    if (percentage > 0) {
      return "percentage-positive";
    } else if (percentage < 0) {
      return "percentage-negative";
    } else {
      return "";
    }
  };

  return (
    <div className="portfolio-value-table-container">
      <h2 className="portfolio-value-table-title">Portfolio Allocation</h2>
      <table className="portfolio-value-table">
        <thead>
          <tr>
            <th className="first-column">Stock</th>
            {stocks.map((stock) => (
              <th key={stock}>{stock}</th>
            ))}
            <th>Total (USD)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="first-column">End Date Returns (USD)</td>
            {stocks.map((stock) => (
              <td key={stock}>
                $ {finalAllocation[stock].stockPrice} (
                <span
                  className={getPercentageClassName(
                    ((finalTotal - initialTotal) * 100) / initialTotal
                  )}
                >
                  {finalAllocation[stock].allocation}%
                </span>
                )
              </td>
            ))}
            <td>
              $ {finalTotal} (
              <span
                className={getPercentageClassName(
                  ((finalTotal - initialTotal) * 100) / initialTotal
                )}
              >
                {(((finalTotal - initialTotal) * 100) / initialTotal).toFixed(
                  2
                )}
                %
              </span>
              )
            </td>
            <td>
              <GroupedBarChart
                stocks={stocks}
                initialAllocation={initialAllocation}
                finalAllocation={finalAllocation}
              />
            </td>
          </tr>
          <tr>
            <td className="first-column">Initial Allocation (USD)</td>
            {stocks.map((stock) => (
              <td key={stock}>
                $ {initialAllocation[stock].stockPrice} (
                <span>{initialAllocation[stock].allocation}%</span>)
              </td>
            ))}
            <td>$ {initialTotal}</td>
            <td>
              <PortfolioAllocationPieChart
                portfolioAllocation={initialAllocation}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioAllocationTable;
