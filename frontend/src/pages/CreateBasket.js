

// src/CreateBasketPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./../styles/createBasket.css";
import AssetSymbolAutocomplete from "./../components/ui/AssetSymbolAutocomplete"; // Adjust the import path if needed
import { API_BASE_URL,HOSTNAME } from "./../config";
import Modal from 'react-modal';
import BasketModal from "./BasketModal";




const CreateBasketPage = () => {
  // State for basket creation
  const [basketData, setBasketData] = useState({
    name: '',
    description: '',
    theme: '',
    image: '',
    thumbnail: '',
    status: 'active',
    risk_profile_id: ''
    });

    const initialPortfolioEntry = {
      asset_symbol: '',
      exchange: '',
      sym_name: '',
      asset_type_id: '',
      price_while_added: '',
      weightage: '',
      status: 'active'
    };

  const [selectedBasket, setSelectedBasket] = useState(null);

  const [basketCreated, setBasketCreated] = useState(false);
  const [basketId, setBasketId] = useState(null);
  const [basketMessage, setBasketMessage] = useState('');
  const [existingBaskets, setExistingBaskets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phase, setPhase] = useState('basket');
  const [showModal, setShowModal] = useState(false);



  // State for bulk portfolio entries (an array)
  const [portfolioEntries, setPortfolioEntries] = useState([]);
  // For new portfolio entry input
  const [portfolioEntry, setPortfolioEntry] = useState({
    asset_symbol: '',
    exchange: '',
    sym_name: '',
    asset_type_id: '',
    price_while_added: '',
    weightage: '',
    status: 'active'
  });

  const initialBasketData = {
    name: '',
    description: '',
    theme: '',
    image: '',
    thumbnail: '',
    status: 'active',
    risk_profile_id: '',
    created_by: ''
  };

  const [portfolioMessage, setPortfolioMessage] = useState('');

  // Data from backend
  const [riskProfiles, setRiskProfiles] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [imageOption, setImageOption] = useState('upload');
  const [thumbOption, setThumbOption] = useState('upload');
  const [imageFile, setImageFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Number-based state to force refresh


  // Fetch risk profiles, asset types, and gallery images on mount
  useEffect(() => {
    axios.get(`${API_BASE_URL}/risks`)
      .then(res => setRiskProfiles(res.data))
      .catch(err => console.error(err));

    axios.get(`${API_BASE_URL}/get_baskets`)
      .then(res => setExistingBaskets(res.data))
      .catch(err => console.error(err));

    axios.get(`${API_BASE_URL}/api/assets`)
      .then(res => setAssetTypes(res.data))
      .catch(err => console.error(err));

    axios.get(`${API_BASE_URL}/pull_gallery`)
      .then(res => setGallery(res.data))
      .catch(err => console.error(err));
  }, [refreshTrigger]);

  const handleRefresh = () => {
    console.log("Triggering refresh...");
    setRefreshTrigger(prev => prev + 1); // Incrementing forces re-render
  };
  
  // Handle basket data change
  const handleBasketChange = (e) => {
    const { name, value } = e.target;
    setBasketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file changes for basket image and thumbnail
  const handleFileChange = (e, type) => {
    
    if (type === 'image') {
      setImageFile(e.target.files[0]);
    } else if (type === 'thumb') {
      setThumbFile(e.target.files[0]);
    }
  };

  // Upload file helper
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${API_BASE_URL}/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (err) {
      console.error(err);
      return '';
    }
  };

  // Create Basket handler
  const handleCreateBasket = async (e) => {
    e.preventDefault();
    let imageUrl = basketData.image;
    let thumbUrl = basketData.thumbnail;
    if (imageOption === 'upload' && imageFile) {
      imageUrl = await uploadFile(imageFile);
    }
    if (thumbOption === 'upload' && thumbFile) {
      thumbUrl = await uploadFile(thumbFile);
    }
    const payload = { ...basketData, image: imageUrl, thumbnail: thumbUrl };

    axios.post(`${API_BASE_URL}/baskets`, payload)
      .then(response => {
        setBasketMessage(`Basket created successfully! ID: ${response.data.basket_id}`);
        setBasketId(response.data.basket_id);
        setBasketCreated(true);
        setPhase('portfolio');

      })
      .catch(error => {
        console.error(error);
        setBasketMessage('Error creating basket.');
      });
  };

  // Handle portfolio entry field changes
  const handlePortfolioChange = (e) => {
    const { name, value } = e.target;
    setPortfolioEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add portfolio entry to local list (bulk addition)
  const addPortfolioEntryToList = () => {
    if (!portfolioEntry.asset_symbol || !portfolioEntry.asset_type_id) {
      alert('Asset symbol and asset type are required');
      return;
    }
    if (portfolioEntries.length >= 20) {
      alert('Maximum of 20 portfolio entries allowed');
      return;
    }
    setPortfolioEntries(prev => [...prev, { ...portfolioEntry }]);
    // Reset portfolio entry input
    setPortfolioEntry({
      asset_symbol: '',
      exchange: '',
      sym_name: '',
      asset_type_id: '',
      price_while_added: '',
      weightage: '',
      status: 'active'
    });
  };

  // Bulk Submit portfolio entries
  const handleSubmitPortfolioBulk = () => {
    if (!basketId) {
      alert('Please create a basket first');
      return;
    }
    axios.post(`${API_BASE_URL}/baskets/${basketId}/portfolio/bulk`, { entries: portfolioEntries })
      .then(response => {
        setPortfolioMessage('Portfolio entries added successfully in bulk!');
        closeModal(); 
      })
      .catch(error => {
        console.error(error);
        setPortfolioMessage('Error adding portfolio entries.');
      });
  };
  const closeModal = () => {
  
    setIsModalOpen(false);
    setPhase('basket'); // Reset to basket creation phase
    setBasketId(null);
    setPortfolioEntries([]);
    setBasketData(initialBasketData);
    setPortfolioEntry(initialPortfolioEntry);
    setPortfolioMessage('');
    setBasketMessage('');
    setPortfolioEntries([]);

  };

  

  const handleViewClick = (basket) => {
    setSelectedBasket(basket);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBasket(null);
    setPortfolioMessage('');
    setRefreshTrigger(prev => prev + 1); // Incrementing forces re-render


    
  };

  return (
    <div className="">
      <h1>Existing Baskets</h1>
      <div>
        
        {existingBaskets && existingBaskets.length > 0 ? (
         <table>
           <tr>  <th> Name </th><th>  Description </th> <th> Theme </th> <th> Status </th> <th> Risk Profile </th> </tr>
            {existingBaskets.map(basket => (
              <tr key={basket.basket_id}>
            
                <td> {basket.name} </td><td> { basket.description} </td> <td>{basket.theme} </td> <td>  {basket.status} </td> <td> {basket.risk_profile_name} </td>
                <td>
                <button onClick={() => handleViewClick(basket)}>View</button>
              </td>
                </tr>
            ))}
          
          </table>
        )
       
         : (
          <p>No baskets found.</p>
        )}
      </div>
      <br/><br/>

      <hr />

      {selectedBasket && (
        <BasketModal
          show={showModal}
          handleClose={handleCloseModal}
          basket={selectedBasket}
          assetTypes={assetTypes}
        />
      )}

      {/* Button to open modal */}
      {!isModalOpen && (
        <div>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
            Create Theme Basket
          </a>
        </div>
      )}

      {/* Modal for both basket creation and portfolio addition */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create Theme Basket"
        style={{
          content: {
            width: '600px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px'
          }
        }}
      >
        {phase === 'basket' && (
          <>
            <h1>Create Theme Basket</h1>
            <form onSubmit={handleCreateBasket}>
              <div>
                <label>Name:</label>
                <input name="name" value={basketData.name} onChange={handleBasketChange} required />
              </div>
              <div>
                <label>Description:</label>
                <textarea name="description" value={basketData.description} onChange={handleBasketChange} />
              </div>
              <div>
                <label>Theme:</label>
                <input name="theme" value={basketData.theme} onChange={handleBasketChange} required />
              </div>
              <div>
                <label>Risk Profile:</label>
                <select
                  name="risk_profile_id"
                  value={basketData.risk_profile_id}
                  onChange={handleBasketChange}
                  required
                >
                  <option value="" disabled>Select a risk profile</option>
                  {riskProfiles.map(risk => (
                    <option key={risk.id} value={risk.id}>{risk.name}</option>
                  ))}
                </select>
              </div>
      
              <hr />
              <h2>Image & Thumbnail Options</h2>
              <div>
                <label>Image Option:</label>
                <select value={imageOption} onChange={(e) => setImageOption(e.target.value)}>
                  <option value="upload">Upload New</option>
                  <option value="gallery">Select from Gallery</option>
                </select>
                {imageOption === 'upload' ? (
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                ) : (
                  <select name="image" value={basketData.image} onChange={handleBasketChange}>
                    <option value="" disabled>Select an image</option>
                    {gallery.map((img, index) => (
                      <option key={index} value={img.url}>{img.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label>Thumbnail Option:</label>
                <select value={thumbOption} onChange={(e) => setThumbOption(e.target.value)}>
                  <option value="upload">Upload New</option>
                  <option value="gallery">Select from Gallery</option>
                </select>
                {thumbOption === 'upload' ? (
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'thumb')} />
                ) : (
                  <select name="thumbnail" value={basketData.thumbnail} onChange={handleBasketChange}>
                    <option value="" disabled>Select a thumbnail</option>
                    {gallery.map((img, index) => (
                      <option key={index} value={img.url}>{img.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <button type="submit">Create Basket</button>
            </form>
            {basketMessage && <p className="message">{basketMessage}</p>}
          </>
        )}

        {phase === 'portfolio' && (
          <>
            <h1>Basket Created: {basketData.name}</h1>
            <p>BASKET ID: {basketId}</p>
            <hr />
            <h2>Add Portfolio Entries (Bulk)</h2>
            <div className="portfolio-entry-form">
              <div>
                  <label>Asset Type:</label>
                  <select
                    name="asset_type_id"
                    value={portfolioEntry.asset_type_id}
                    onChange={handlePortfolioChange}
                    required
                  >
                    <option value="" disabled>Select Asset Type</option>
                    {assetTypes.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.asset_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Asset Symbol:</label>
                  <AssetSymbolAutocomplete 
                    assetTypeId={portfolioEntry.asset_type_id} 
                    onSymbolSelect={(symbol) => setPortfolioEntry({
                      ...portfolioEntry,
                      asset_symbol: symbol.symbol,
                      sym_name: symbol.name,
                      exchange: symbol.exchange
                    })}
                  />
              
                </div>
              <div>
                <label>Exchange:</label>
                {portfolioEntry.exchange}
                
              </div>
              <div>
                <label>Symbol Name:</label>
                {portfolioEntry.sym_name}
              
              </div>
             
              <div>
                <label>Price While Added:</label>
                <input
                  type="number"
                  name="price_while_added"
                  value={portfolioEntry.price_while_added}
                  onChange={handlePortfolioChange}
                  step="0.01"
                />
              </div>
              <div>
                <label>Weightage (%):</label>
                <input
                  type="number"
                  name="weightage"
                  value={portfolioEntry.weightage}
                  onChange={handlePortfolioChange}
                  step="0.1"
                />
              </div>
              <div>
              
              </div>
              <button type="button" onClick={addPortfolioEntryToList}>Add More</button>
            </div>

            {portfolioEntries.length > 0 && (
              <div>
                <h3>Portfolio Entries to Add:</h3>
                <ul>
                  {portfolioEntries.map((entry, index) => (
                    <li key={index}>
                      {entry.asset_symbol} ({entry.sym_name}) on {entry.exchange} – Type: {entry.asset_type_id}, Price: {entry.price_while_added}, Weight: {entry.weightage}%, Status: {entry.status}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={handleSubmitPortfolioBulk}>Submit All Portfolio Entries</button>
              </div>
            )}
            {portfolioMessage && <p className="message">{portfolioMessage}</p>}
            <button type="button" onClick={() => closeModal()}>Close Modal</button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CreateBasketPage;




