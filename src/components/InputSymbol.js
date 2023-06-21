import { symbols } from "../../public/symbols.js";
import "../styles/InputForm.css";
import { useState, useEffect } from "react";

const InputSymbol = ({ currSymbol, onSymbolSelect }) => {
  const [symbolSearch, setSymbolSearch] = useState(currSymbol);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  useEffect(() => {
    setSymbolSearch(currSymbol);
  }, [currSymbol]);
  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSymbolSearch(searchValue);

    if (searchValue.length > 0) {
      setShowAutocomplete(true);

      const filtered = Object.keys(symbols).filter((symbol) => {
        const symbolKeyMatches = symbol
          .toUpperCase()
          .includes(searchValue.toUpperCase());
        const symbolValueMatches = symbols[symbol]
          .toUpperCase()
          .includes(searchValue.toUpperCase());
        return symbolKeyMatches || symbolValueMatches;
      });
      setFilteredSymbols(filtered);
    } else {
      setShowAutocomplete(false);
      setFilteredSymbols([]);
    }
  };

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
    setSymbolSearch(symbol);
    setFilteredSymbols([]);
    setShowAutocomplete(false);

    // Pass the selected symbol to the parent component
    onSymbolSelect(symbol);
  };

  return (
    <div className="input-field">
      <label>Search symbols:</label>
      <input
        type="text"
        value={symbolSearch}
        onChange={handleSearchChange}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedSymbol(filteredSymbols[0] || "");
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedSymbol(
              filteredSymbols[filteredSymbols.length - 1] || ""
            );
          }
        }}
        className="input-field-text"
        placeholder="Search symbols..."
      />

      {showAutocomplete && (
        <ul className="symbol-list">
          {filteredSymbols.map((symbol) => (
            <li
              key={symbol}
              className={`symbol-option ${
                selectedSymbol === symbol ? "selected" : ""
              }`}
              onClick={() => handleSymbolSelect(symbol)}
            >
              {symbol} - {symbols[symbol]}
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .symbol-option {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
export default InputSymbol;
