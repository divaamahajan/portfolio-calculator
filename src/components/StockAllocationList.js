import "../styles/InputForm.css";
import { symbols } from "../../public/symbols.js";
import React, { useState } from "react";
import InputSymbol from "./InputSymbol";
import InputPercentage from "./InputPercentage";

const StockAllocationList = ({
  inputError,
  stockAllocations,
  remainingAllocation,
  onDeleteAllocation,
  onUpdateAllocation,
}) => {
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [editedPercentage, setEditedPercentage] = useState(0);
  const [editedSymbol, setEditedSymbol] = useState("");

  const handleDelete = (symbol) => {
    onDeleteAllocation(symbol);
  };

  const handleEdit = (symbol, percentage) => {
    setEditingAllocation(symbol);
    // setEditedPercentage(percentage); //0.0001 = 0.01 % string
    setEditedPercentage(parseFloat((percentage * 100).toFixed(2))); //1.01% float
    setEditedSymbol(symbol);
  };

  const handleSaveEdit = () => {
    onUpdateAllocation(editingAllocation, editedSymbol, editedPercentage);
    setEditingAllocation(null);
    setEditedPercentage(0);
    setEditedSymbol("");
  };

  const handleCancelEdit = () => {
    setEditingAllocation(null);
    setEditedPercentage(0);
    setEditedSymbol("");
  };

  const handlePercentageChange = (event) => {
    setEditedPercentage(parseFloat(event.target.value));
  };

  const handleSymbolChange = (symbol) => {
    setEditedSymbol(symbol);
  };

  return (
    <div className="input-text-column">
      <div className="current-allocation">
        <h1 className="input-text-heading">
          Current Allocation
          <span className="input-text-subheading">
            ({remainingAllocation}% remaining)
          </span>
        </h1>
        <ul className="stock-allocations">
          {Object.entries(stockAllocations).map(([symbol, percentage]) => (
            <li key={symbol} className="stock-allocation-item">
              {editingAllocation === symbol ? (
                <div className="edit-allocation-container">
                  <InputPercentage
                    currPercentage={editedPercentage.toFixed(2)}
                    handlePercentageChange={handlePercentageChange}
                  />

                  <InputSymbol
                    currSymbol={editedSymbol}
                    onSymbolSelect={handleSymbolChange}
                  />
                  <div className="edit-buttons-container">
                    <button
                      type="button"
                      className="saveButton"
                      onClick={handleSaveEdit}
                    >
                      <span className="saveIcon"></span>
                    </button>
                    <button
                      type="button"
                      className="cancelButton"
                      onClick={handleCancelEdit}
                    >
                      <span className="cancelIcon"></span>
                    </button>
                  </div>
                </div>
              ) : (
                <><div className="allocation-item">
                <span className="symbol">{symbol}</span>
                <span className="description">{symbols[symbol]}</span>
                <span className="percentage">{(percentage * 100).toFixed(2)}%</span>
                <div className="allocation-buttons-container">
                  <button
                    type="button"
                    className="deleteButton"
                    onClick={() => handleDelete(symbol)}
                  >
                    <span className="deleteIcon"></span>
                  </button>
                  <button
                    type="button"
                    className="editButton"
                    onClick={() => handleEdit(symbol, percentage)}
                  >
                    <span className="editIcon"></span>
                  </button>
                </div>
              </div>
              
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockAllocationList;
