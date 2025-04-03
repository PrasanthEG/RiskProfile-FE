import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL,HOSTNAME } from "./../config";
import "./../styles/createBasket.css";
import AssetSymbolAutocomplete from "./../components/ui/AssetSymbolAutocomplete"; // Adjust the import path if needed



const BasketModal = ({ show, handleClose, basket,assetTypes }) => {
  const [basketDetails, setBasketDetails] = useState({ ...basket });
  const [themePortfolios, setThemePortfolios] = useState([]);
  const [newRow, setNewRow] = useState({ asset_symbol: "", exchange: "", weightage: 0 });
  const [portfolioEntries, setPortfolioEntries] = useState([]);

  const [newPortfolio, setNewPortfolio] = useState({
    asset_type_id: "",
    asset_symbol: "",
    sym_name: "",
    exchange: "",
    price_while_added: "",
    weightage: "",
    status: "active",
  });
  

  useEffect(() => {
    fetchThemePortfolios();
  }, [basket]);

  const fetchThemePortfolios = async () => {
    try {
    
      const response = await axios.get(`${API_BASE_URL}/get_baskets/${basket.basket_id}`);
      setThemePortfolios(response.data.portfolio);
    } catch (error) {
      console.error("Error fetching theme portfolios:", error);
    }
  };

  const handleBasketChange = (e) => {
    setBasketDetails({ ...basketDetails, [e.target.name]: e.target.value });
  };

  const handleSaveBasket = async () => {
    try {
      await axios.put(`${API_BASE_URL}/edit_baskets/${basket.basket_id}`, basketDetails);
      alert("Basket updated successfully!");
      handleClose();
    } catch (error) { 
      console.error("Error updating basket:", error);
    }
  };

  const handleAddRow = () => {
    setThemePortfolios([...themePortfolios, { ...newRow, id: Date.now() }]);
    setNewRow({ asset_symbol: "", exchange: "", weightage: 0 });
  };

  const handleRemoveRow = (id) => {
    
    setThemePortfolios(themePortfolios.filter((row) => row.id !== id));
  };

  const handleThemePortfolioChange = (index, field, value) => {
    const updated = [...themePortfolios];
    updated[index][field] = value;
    setThemePortfolios(updated);
  };

  const handleSavePortfolio = async () => {
    try {
      await axios.post(`${API_BASE_URL}/theme_portfolios/save`, { basket_id: basket.basket_id, portfolios: themePortfolios });
      alert("Portfolio updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  if (!show) return null;

  

  const handlePortfolioChange = (field, value) => {
    setNewPortfolio({ ...newPortfolio, [field]: value });
  };

  // Add portfolio row
  const handleAddPortfolio = () => {
    if (!newPortfolio.asset_symbol || !newPortfolio.asset_type_id) {
      alert("Please select an asset type and symbol.");
      return;
    }
    setThemePortfolios([...themePortfolios, newPortfolio]);
    setNewPortfolio({
      asset_type_id: "",
      asset_symbol: "",
      sym_name: "",
      exchange: "",
      price_while_added: "",
      weightage: "",
      status: "active",
    });
  };

  return (
    <div className="modal-overlay modal-lg">
      <div className="modal-content">
         <div className="modal-header">

            <h2>Edit Basket</h2>
            <button className="close-button" onClick={handleClose}>×</button>
        </div>
      <div className="modal-body modal-scrollable">

        {/* Basket Details */}
        <label>Name:</label>
        <input type="text" name="name" value={basketDetails.name} onChange={handleBasketChange} />

        <label>Theme:</label>
        <input type="text" name="theme" value={basketDetails.theme} onChange={handleBasketChange} />

        <label>Image URL:</label>
      
        <img src={`${HOSTNAME}${basketDetails.image}`}     className="modal-image"  />

   
        <label>Description:</label>
        <textarea name="description" value={basketDetails.description} onChange={handleBasketChange}></textarea>

        <button className="save-button" onClick={handleSaveBasket}>Save Basket</button>

        {/* Theme Portfolio List */}
        <h3>Theme Portfolio</h3>
        <table>
          <thead>
            <tr>
              <th>Asset Symbol</th>
              <th>Exchange</th>
              <th>Weightage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {themePortfolios && themePortfolios.filter(portfolio => portfolio.status === "active").map((portfolio, index) => (
                
                    <tr key={portfolio.id}>
                        <td><input type="text" value={portfolio.asset_symbol} onChange={(e) => handleThemePortfolioChange(index, "asset_symbol", e.target.value)} /></td>
                        <td><input type="text" value={portfolio.exchange} onChange={(e) => handleThemePortfolioChange(index, "exchange", e.target.value)} /></td>
                        <td><input type="number" value={portfolio.weightage} onChange={(e) => handleThemePortfolioChange(index, "weightage", Number(e.target.value))} /></td>
                        <td><button className="delete-button" onClick={() => handleRemoveRow(portfolio.id)}>Remove</button></td>
                    </tr>
                
            ))}
            
            {/* {portfolioEntries.length > 0 && (
              <tr>
                <th>Composition:</th>
              </tr>
                  {portfolioEntries.map((entry, index) => (
                    <tr key={index}>
                    <td >
                      {entry.sym_name}  
                    </td>
                    <td >
                    {entry.exchange} 
                  </td>
                   
                    </tr>
                  ))}
              
            )} */}
          </tbody>
        </table>

        <br/>
            <button className="btn btn-success mb-2" onClick={handleAddPortfolio}>+ Add Asset</button>

            <table className="table">
           
         
            <tbody>
                {/* Empty Row for New Portfolio Entry */}
                <tr>
                  <td>
                    <select
                      value={newPortfolio.asset_type_id}
                      onChange={(e) => handlePortfolioChange("asset_type_id", e.target.value)}
                    >
                      <option value="" disabled>Select Asset Type</option>
                      {assetTypes.map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.asset_name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <AssetSymbolAutocomplete
                      assetTypeId={newPortfolio.asset_type_id}
                      onSymbolSelect={(symbol) =>
                        setNewPortfolio({
                          ...newPortfolio,
                          asset_symbol: symbol.symbol,
                          sym_name: symbol.name,
                          exchange: symbol.exchange
                        })
                      }
                    />
                  </td>
                  <td> 
                    <input
                      type="number"
                      value={newPortfolio.price_while_added}
                      onChange={(e) => handlePortfolioChange("price_while_added", Number(e.target.value))}
                      step="0.01"
                      placeholder="Price"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={newPortfolio.weightage}
                      onChange={(e) => handlePortfolioChange("weightage", Number(e.target.value))}
                      step="0.1"
                      placeholder="Weightage"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text_label">{newPortfolio.exchange}</td>
                  <td colSpan={2} className="text_label">{newPortfolio.sym_name}</td>
                 
                  <td>
                    <button className="btn btn-success" onClick={handleAddPortfolio}>+ Add</button>
                  </td>
               
                </tr>
                </tbody>
                </table>
                <br></br>
                <table>      
                {/* Display Added Portfolios */}
                {themePortfolios.map((portfolio, index) => (
                  <tr key={index}>
                    
                    <td>{assetTypes.find(asset => asset.id === portfolio.asset_type_id)?.asset_name || ""}  </td>
                    <td>{portfolio.asset_symbol}</td>
                    <td>{portfolio.exchange}</td>
                    <td>{portfolio.sym_name}</td>
                    <td>{portfolio.price_while_added}</td>
                    <td>{portfolio.weightage}</td>
                  
                  </tr>
                ))}
         
       
            </table>
            </div>

        <button className="save-button" onClick={handleSavePortfolio}>Save Portfolio</button>
      </div>
    </div>
  );
};

export default BasketModal;
