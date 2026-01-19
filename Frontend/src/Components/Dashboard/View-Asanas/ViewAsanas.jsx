import React, { useState, useEffect } from "react";
import axios from 'axios';
import './ViewAsanas.css'; 
import HeaderComponent from "../Header/Header";

const ViewAsanas = () => {
  const [asanas, setAsanas] = useState([]);
  const [visibleAsanas, setVisibleAsanas] = useState(3); 
  const [searchQuery, setSearchQuery] = useState('');

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
      {filteredAsanas.slice(0, visibleAsanas).map((asana, index) => (
        <div className="col-md-4" key={asana._id}>
          <div className="card mb-4">
            <img src={asana.image} className="card-img-top" alt={asana.name} />
            <div className="card-body">
              <h5 className="card-title">asana name : {asana.name}</h5>
              <p className="card-text">asana description : {asana.description}</p>
              <p className="card-added-by">Added By: {asana.addedByName}</p>
              <p>Benefits</p>
              {asana.benefits.length > 0 && (
                <ul>
                  {asana.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="text-center">
        {visibleAsanas < filteredAsanas.length && (
          <button className="button col-12" onClick={loadMore}>Load More</button>
        )}
      </div>
      </div>
    </div>
  );
}

export default ViewAsanas;
