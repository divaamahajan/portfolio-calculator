"use client";
import React, { useState, useEffect } from "react";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VisualisationTabs from "./VisualisationTabs";
import "../styles/InputForm.css";
import InputSymbol from "./InputSymbol";
import { symbols } from "../../public/symbols.js";
import StockAllocationList from "./StockAllocationList";
import InputPercentage from "./InputPercentage";

const InputForm = () => {
  const today = new Date();
  let yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  let oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const [stockAllocations, setStockAllocations] = useState({});
  const [currSymbol, setCurrSymbol] = useState("");
  const [currPercentage, setCurrPercentage] = useState(0);
  const [initialBalance, setInitialBalance] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [inputError, setInputError] = useState("");
  const [marketStackResponseData, setMarketStackResponseData] =
    useState(undefined);
  const [inputData, setInputData] = useState(undefined);
  const [remainingAllocation, setRemainingAllocation] = useState(100);
  const [message, setMessage] = useState("");
  useEffect(() => {
    // Retrieve form values from localStorage on component mount
    const storedFormValues = JSON.parse(localStorage.getItem("formValues"));

    if (storedFormValues) {
      setStockAllocations(storedFormValues.stockAllocations || {});
      setCurrSymbol(storedFormValues.currSymbol || "");
      setCurrPercentage(storedFormValues.currPercentage || 0);
      setInitialBalance(storedFormValues.initialBalance || 0);
      setInputError(storedFormValues.inputError || "");
      setRemainingAllocation(storedFormValues.remainingAllocation || 0);
    }
  }, []);

  useEffect(() => {
    // Store form values in localStorage whenever they change
    const formValues = {
      stockAllocations,
      currSymbol,
      currPercentage,
      initialBalance,
      inputError,
      remainingAllocation,
    };

    localStorage.setItem("formValues", JSON.stringify(formValues));
  }, [
    stockAllocations,
    currSymbol,
    currPercentage,
    initialBalance,
    inputError,
    remainingAllocation,
  ]);

  useEffect(() => {
    console.log("Remaining Allocation:", remainingAllocation);
  }, [remainingAllocation]);

  const handleDeleteAllocation = (symbol) => {
    const updatedAllocations = { ...stockAllocations };
    const deletedPercentage = parseFloat(
      (updatedAllocations[symbol] * 100).toFixed(2)
    );
    delete updatedAllocations[symbol];
    setStockAllocations(updatedAllocations);
    setRemainingAllocation(
      (prevVal) => parseFloat(prevVal) + deletedPercentage
    );
  };

  const handleUpdateAllocation = (fromSymbol, toSymbol, newPercentage) => {
    const updatedAllocations = { ...stockAllocations };
    const previousPercentage = parseFloat(
      (updatedAllocations[fromSymbol] * 100).toFixed(2)
    );
    const newRemainingAllocation = (
      parseFloat(remainingAllocation) +
      previousPercentage -
      newPercentage
    ).toFixed(2);
    if (newRemainingAllocation < 0) {
      setInputError("Total Stock Allocation Should Not Exceed 100%.");
      return;
    }
    // delete fromSymbol
    handleDeleteAllocation(fromSymbol);
    addStock(toSymbol, newPercentage.toString());
  };

  const handleSymbolSelect = (symbol) => {
    setCurrSymbol(symbol);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (remainingAllocation) {
      setInputError("Total allocation needs to add up to 100%");
      return;
    }
    if (!initialBalance) {
      setInputError("Initial Balance can not be blank");
      return;
    }
    if (!fromDate) {
      setInputError("Start Date can not be blank");
      return;
    }
    let symbolsString = Object.keys(stockAllocations).toString();
    let allocationValues = Object.values(stockAllocations);
    let symbol = symbolsString || "AAPL,GOOGL";
    let date_from = "";
    if (fromDate.toString().split(" ")[0] == "Sun") {
      let sundayDate = new Date(fromDate);
      sundayDate.setDate(sundayDate.getDate() - 2);
      date_from = sundayDate.toISOString().split("T")[0].toString();
    } else if (fromDate.toString().split(" ")[0] == "Sat") {
      let saturdayDate = new Date(fromDate);
      saturdayDate.setDate(saturdayDate.getDate() - 1);
      date_from = saturdayDate.toISOString().split("T")[0].toString();
    } else {
      date_from =
        fromDate.toISOString().split("T")[0].toString() || "2023-05-23";
    }

    let date_to = "";
    if (toDate) {
      date_to = toDate.toISOString().split("T")[0].toString() || "2023-05-24";
      if (toDate.toString().split(" ")[0] == "Sun") {
        let sundayDate = new Date(toDate);
        sundayDate.setDate(sundayDate.getDate() - 2);
        date_to = sundayDate.toISOString().split("T")[0].toString();
      } else if (toDate.toString().split(" ")[0] == "Sat") {
        let saturdayDate = new Date(toDate);
        saturdayDate.setDate(saturdayDate.getDate() - 1);
        date_to = saturdayDate.toISOString().split("T")[0].toString();
      } else {
        date_to = toDate.toISOString().split("T")[0].toString() || "2023-05-24";
      }
    } else {
      date_to = yesterday.toISOString().split("T")[0].toString();
    }
    let allocation = allocationValues || [0.5, 0.5];

    const data = { symbol, date_from, date_to, allocation, initialBalance };
    console.log("data", data);
    let marketStackData = await fetch("/api", {
      method: "POST",
      body: JSON.stringify(data),
    });
    marketStackData = await marketStackData.json();
    console.log("marketStackData", marketStackData["data"]);
    setMarketStackResponseData(marketStackData);
    // fetchUserInputJson(date_from, date_to, initialBalance, stockAllocations);
    const inputDataObj = {
      startDate: date_from,
      endDate: date_to,
      initialBalance: initialBalance,
      portfolioAllocation: stockAllocations,
    };
    console.log("inputDataObj before ", inputDataObj["portfolioAllocation"]);
    let removedAllocation = 0;
    let removedStocks = "";

    for (const stock of Object.keys(inputDataObj["portfolioAllocation"])) {
      if (stock in marketStackData["data"]) {
        continue; // Skip to the next stock if it exists in marketStackData
      } else {
        removedAllocation += inputDataObj["portfolioAllocation"][stock];
        removedStocks += stock + ", ";
        delete inputDataObj["portfolioAllocation"][stock];
      }
    }

    inputDataObj["initialBalance"] =
      inputDataObj["initialBalance"] * (1 - removedAllocation);

    if (removedStocks !== "") {
      removedStocks = removedStocks.slice(0, -2); // Remove the trailing comma and space
      const removedAllocationPercentage = removedAllocation * 100;
      const initialBalanceUpdate = inputDataObj["initialBalance"];

      const msg = `Note: No data available for ${removedStocks} from ${inputDataObj["startDate"]} to ${inputDataObj["endDate"]}. The displayed data has been adjusted by reducing ${removedAllocationPercentage}% of your allocation to these stocks, with an initial balance of $${initialBalanceUpdate}.`;

      setMessage(msg);
    }
    console.log("inputDataObj after ", inputDataObj["portfolioAllocation"]);
    setInputData(inputDataObj);
    // Hide the form container
    const formContainer = document.querySelector(".form-container");
    formContainer.style.display = "none";

    const submitButton = document.querySelector(".submit-button");
    submitButton.style.display = "none";
    // router.push({
    //   pathname: "/results",
    //   query: {
    //     marketStackData: marketStackData,
    //     inputData: inputDataObj,
    //   },
    // });
  };

  const handlePercentageChange = (event) => {
    verifyDecimalInput(event);
    setCurrPercentage(event.target.value);
  };

  const handleBalanceChange = (event) => {
    verifyDecimalInput(event);
    setInitialBalance(parseFloat(event.target.value));
  };

  const verifyDecimalInput = (event) => {
    const validInput = /^\d+(\.\d{0,2})?$/.test(event.target.value);
    if (!validInput) {
      setInputError(
        `Invalid input for ${event.target.name}. Only numbers and decimals up to two points are allowed.`
      );
      return;
    }
    setInputError("");
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const addStock = (symbol, percentage) => {
    if (!symbols.hasOwnProperty(symbol)) {
      setInputError(
        "Only symbols which appear in the dropdown menu are valid."
      );
      return;
    }
    if (percentage === "") {
      setInputError("Percentage cannot be blank.");
      return;
    }
    // console.log("Inside add stock remainingAllocation", remainingAllocation);
    // console.log("percentage", percentage);
    setRemainingAllocation((prevVal) => {
      if (prevVal - parseFloat(percentage) < 0) {
        setInputError("Total Stock Allocation Should Not Exceed 100%.");
        return prevVal; // Return the previous value
      } else {
        setStockAllocations((prevData) => ({
          ...prevData,
          [symbol]: prevData.hasOwnProperty(symbol)
            ? (
                parseFloat(prevData[symbol]) +
                parseFloat(percentage) / 100
              ).toFixed(4)
            : (parseFloat(percentage) / 100).toFixed(4),
        }));
        return prevVal - parseFloat(percentage);
      }
    });
    return;
  };
  const handleAddStock = () => {
    addStock(currSymbol, currPercentage);
    setCurrSymbol("");
    setCurrPercentage("");
  };
  // const fetchUserInputJson = (
  //   startDate,
  //   endDate,
  //   initialBalance,
  //   portfolioAllocation
  // ) => {
  //   const inputDataObj = {
  //     startDate: startDate,
  //     endDate: endDate,
  //     initialBalance: initialBalance,
  //     portfolioAllocation: portfolioAllocation,
  //   };

  //   console.log("InputData", inputDataObj);
  //   setInputData(inputDataObj);
  // };

  const resetState = () => {
    // Show the form container
    const formContainer = document.querySelector(".form-container");
    formContainer.style.display = "block";

    const submitButton = document.querySelector(".submit-button");
    submitButton.style.display = "block";
    // Reset the state
    setMessage("");
    setStockAllocations({});
    setCurrSymbol("");
    setCurrPercentage(0);
    setInitialBalance(0);
    setFromDate(null);
    setToDate(null);
    setInputError(null);
    setInputData(undefined);
    setMarketStackResponseData(undefined);
    setRemainingAllocation(100);
  };

  return (
    <div>
      <div className="input-form-container">
        <form className="input-form" onSubmit={handleSubmit}>
          <div className="form-container">
            <StockAllocationList
              inputError={inputError}
              stockAllocations={stockAllocations}
              remainingAllocation={remainingAllocation.toFixed(2)}
              onDeleteAllocation={handleDeleteAllocation}
              onUpdateAllocation={handleUpdateAllocation}
            />
            <div className="input-form-column">
              <div className="input-form-row">
                <InputSymbol
                  currSymbol={currSymbol}
                  onSymbolSelect={handleSymbolSelect}
                />

                <InputPercentage
                  currPercentage={currPercentage}
                  handlePercentageChange={handlePercentageChange}
                />
                <div className="button-container">
                  <button
                    type="button"
                    className="addButton"
                    onClick={handleAddStock}
                  >
                    <span className="addIcon"></span>
                  </button>
                </div>
              </div>

              <div className="input-form-row">
                <div className="input-field">
                  <label>Initial Balance (USD):</label>
                  <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    name="initial balance"
                    value={initialBalance ? initialBalance : ""}
                    onChange={handleBalanceChange}
                    className="input-field-text"
                    placeholder="Initial Balance"
                  />
                </div>

                <div className="input-field">
                  <label>Start Date:</label>
                  <Datepicker
                    className="input-field-datepicker"
                    dateFormat="yyyy-MM-dd"
                    minDate={oneYearAgo}
                    maxDate={yesterday}
                    placeholderText="Start Date"
                    selected={fromDate}
                    onChange={handleFromDateChange}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </div>

                <div className="input-field">
                  <label>End Date (Optional):</label>
                  <Datepicker
                    className="input-field-datepicker"
                    dateFormat="yyyy-MM-dd"
                    minDate={oneYearAgo}
                    maxDate={yesterday}
                    placeholderText="End Date (Optional)"
                    selected={toDate}
                    onChange={handleToDateChange}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </div>
              </div>
              <p className="input-form-note">
                Important Note: Please be aware that if you do not select an end
                date, the system will automatically set it to yesterday's date.
                Kindly note that data for the current day may not be accessible
                at all times.
              </p>
            </div>
            {inputError && <div className="input-form-error">{inputError}</div>}
          </div>
          <div className="button-container">
            <div className="submit-button">
              <button type="submit" className="btn-primary">
                Submit
              </button>
            </div>
            <button
              type="button"
              onClick={resetState}
              className="btn-secondary"
            >
              Reset
            </button>
          </div>
          <p className="input-form-note">
            <b>{message}</b>
          </p>
        </form>
      </div>
      <div className="input-form-column">
        {marketStackResponseData && inputData && (
          <VisualisationTabs
            tradingData={marketStackResponseData}
            userInputData={inputData}
          />
        )}
      </div>
    </div>
  );
};

export default InputForm;
