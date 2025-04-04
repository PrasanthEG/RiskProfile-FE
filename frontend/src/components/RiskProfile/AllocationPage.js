import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "./../../config";
import "./../../styles/styles.css";





const AllocationPage = () => {
  const [riskProfiles, setRiskProfiles] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [message, setMessage] = useState('');

  // Load risk profiles and assets on mount
  useEffect(() => {
    axios.get(`${API_BASE_URL}/risks`)
      .then(res => setRiskProfiles(res.data))
      .catch(err => console.error(err));
      
    axios.get(`${API_BASE_URL}/assets`)
      .then(res => setAssets(res.data))
      .catch(err => console.error(err));
  }, []);

  // Load allocations when a risk profile is selected
  useEffect(() => {
    if (selectedRisk) {
      axios.get(`${API_BASE_URL}/allocations/${selectedRisk}`)
        .then(res => {
          if (res.data.length === 0) {
            // Initialize allocation to 0% for each asset if no record exists
            const initialAlloc = assets.map(asset => ({
              asset_id: asset.id,
              allocation_percent: 0
            }));
            setAllocations(initialAlloc);
          } else {
            setAllocations(res.data);
          }
        })
        .catch(err => console.error(err));
    }
  }, [selectedRisk, assets]);

  const handleAllocationChange = (assetId, value) => {
    setAllocations(prev => prev.map(item =>
      item.asset_id === assetId ? { ...item, allocation_percent: parseFloat(value) } : item
    ));
  };

  const handleSave = () => {
    if (!selectedRisk) return;
    axios.post(`${API_BASE_URL}/allocations`, {
      risk_id: selectedRisk,
      allocations: allocations
    })
      .then(res => {
        setMessage('Allocations saved successfully!');
      })
      .catch(err => {
        console.error(err);
        setMessage('Error saving allocations.');
      });
  };

  return (
    <div>
      <h1>Asset Allocation by Risk Profile</h1>
      <div>
        <label>Select Risk Profile: </label>
        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
        >
          <option value="" disabled>Select a risk profile</option>
          {riskProfiles.map(risk => (
            <option key={risk.id} value={risk.id}>
              {risk.name}
            </option>
          ))}
        </select>
      </div>
      
      {selectedRisk && (
        <div>
          <h2>Asset Allocation for Risk Profile {selectedRisk}</h2>
          <table border="0" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Allocation (%)</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => {
                const alloc = allocations.find(a => a.asset_id === asset.id) || { allocation_percent: 0 };
                return (
                  <tr key={asset.id}>
                    <td>{asset.asset_name}</td>
                    <td>
                      <input
                        type="number"
                        className="input-style-min"
                        value={alloc.allocation_percent}
                        onChange={(e) => handleAllocationChange(asset.id, e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button onClick={handleSave}>Save Allocations</button>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default AllocationPage;
