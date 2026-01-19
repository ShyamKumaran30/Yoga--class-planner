// src/components/Sequence.js

import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Sequenc.css';
import HeaderComponent from "../Header/Header";

const Sequence = ({ handleAddToBox }) => {
  const [asanas, setAsanas] = useState([]);
  const [visibleAsanas, setVisibleAsanas] = useState(3); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsanas, setSelectedAsanas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/asana/view-asanas')
      .then(response => {
        setAsanas(response.data.asanas);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const loadMore = () => {
    setVisibleAsanas(prev => prev + 3);
  }

  const handleAddAsana = (asana) => {
    setSelectedAsanas(prev => [...prev, asana]);
  };

  const handleRemoveAsana = (asanaId) => {
    setSelectedAsanas(prev => prev.filter(asana => asana._id !== asanaId));
  };

  const handleSave = () => {
    handleAddToBox(selectedAsanas.map(asana => asana._id)); 
  };

  const filteredAsanas = asanas.filter(asana => 
    asana.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="asanas-container col-12">
      <h3>Asanas</h3>
      <input
        type="text"
        placeholder="Search asanas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <br></br>
      <div className="image-box">
        {filteredAsanas.slice(0, visibleAsanas).map((asana) => (
          <div className="col-md-4 mb-4" key={asana._id}>
            <div className="card">
              <img src={asana.image} className="card-img-top" alt={asana.name} />
              <div className="card-body">
                <h5 className="card-title">{asana.name}</h5>
                <p>Benefits</p>
                {asana.benefits.length > 0 && (
                  <ul>
                    {asana.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                )}
                {selectedAsanas.some(selected => selected._id === asana._id) ? (
                  <button className="btn btn-danger" onClick={() => handleRemoveAsana(asana._id)}>Remove</button>
                ) : (
                  <button className="btn btn-success" onClick={() => handleAddAsana(asana)}>Add</button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="text-center">
          {visibleAsanas < filteredAsanas.length && (
            <button className="btn btn-primary col-12 my-3" onClick={loadMore}>Load</button>
          )}
          {selectedAsanas.length > 0 && (
            <button className="btn btn-info col-12" onClick={handleSave}>Save</button>
          )}
        </div>
      </div>
      {selectedAsanas.length > 0 && (
        <div className="selected-asanas">
          <h4>Selected Asanas</h4>
          <ul>
            {selectedAsanas.map(asana => (
              <li key={asana._id}>{asana.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sequence;
