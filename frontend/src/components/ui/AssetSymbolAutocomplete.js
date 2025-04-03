import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "./../../config";


const AssetSymbolAutocomplete = ({ assetTypeId, onSymbolSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  useEffect(() => {
    if (searchTerm.length > 2 && assetTypeId) {
      fetchSymbolSuggestions(searchTerm, assetTypeId);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, assetTypeId]);

  const fetchSymbolSuggestions = async (query, assetType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/symbol-lookup?query=${query}&assetType=${assetType}`);
      setSuggestions(response.data); // Expecting [{ symbol: "AAPL", company_name: "Apple Inc.", exchange: "NASDAQ" }, ...]
    } catch (error) {
      console.error('Error fetching symbol suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
    setSearchTerm(symbol.symbol);
    setCompanyName(symbol.name)
    setSuggestions([]);
    onSymbolSelect(symbol); // Pass selected symbol data to parent
  };

  return (
    <>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for asset symbol..."
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, idx) => (
            <li key={idx} onClick={() => handleSymbolSelect(s)}>
               {s.name} - {s.series} ({s.exchange})
            </li>
          ))}
        </ul>
      )}
      </>
  );
};

export default AssetSymbolAutocomplete;
