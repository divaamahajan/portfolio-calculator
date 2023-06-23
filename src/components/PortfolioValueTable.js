"use client";
import React from "react";
import "../styles/PortfolioValueTable.css";

const PortfolioValueTable = (props) => {
  const { portfolioValuePerDay, initialBalance } = props;

  const getProfitColor = (profit) => {
    if (profit < 0) {
      return "red";
    } else if (profit > 0) {
      return "green";
    } else {
      return "black";
    }
  };

  const getTotalColor = (total) => {
    if (total > initialBalance) {
      return "green";
    } else if (total < initialBalance) {
      return "red";
    } else {
      return "black";
    }
  };
  const reversedPortfolioValuePerDay = [...portfolioValuePerDay].reverse();

  return (
    <div className="portfolio-value-table-container">
      <h2 className="portfolio-value-table-title">Portfolio Value </h2>
      <h3 className="portfolio-value-table-sub-title">
        <i>(Initial Balance {initialBalance} USD)</i>
      </h3>
      <table className="portfolio-value-table">
        <thead>
          <tr>
            <th>Date</th>
            {Object.keys(reversedPortfolioValuePerDay[0].stocks).map(
              (stock) => (
                <React.Fragment key={stock}>
                  <th>{stock} Value (USD)</th>
                </React.Fragment>
              )
            )}
            <th>Total Portfolio Worth (USD)</th>
          </tr>
        </thead>
        <tbody>
          {reversedPortfolioValuePerDay.map((item, index) => (
            <tr
              key={item.date}
              className={index === 0 ? "highlighted-row" : ""}
            >
              <td>{item.date}</td>
              {Object.keys(item.stocks).map((stock) => (
                <React.Fragment key={stock}>
                  <td>
                    {item.stocks[stock]}{" "}
                    <span
                      style={{ color: getProfitColor(item.profits[stock]) }}
                    >
                      ({item.profits[stock].toFixed(2) > 0 ? `+` : ``}
                      {item.profits[stock].toFixed(2)}$)
                    </span>
                  </td>
                </React.Fragment>
              ))}
              <td style={{ color: getTotalColor(item.total) }}>
                {item.total}{" "}
                {item.total - initialBalance > 0
                  ? `(+${(
                      ((item.total - initialBalance) / initialBalance) *
                      100
                    ).toFixed(2)}%)`
                  : `(${(
                      ((item.total - initialBalance) / initialBalance) *
                      100
                    ).toFixed(2)}%)`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioValueTable;
