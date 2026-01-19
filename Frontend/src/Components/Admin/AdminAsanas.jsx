import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AsanaList = () => {
    const [asanas, setAsanas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAsanas = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/admin/view-asanas');
                setAsanas(response.data.asanas);
            } catch (error) {
                setError('Error fetching asanas');
            }
        };
        fetchAsanas();
    }, []);

    return (
        <div>
            <h2>Asanas List</h2>
            {error && <p>{error}</p>}
            <div className="row">
                {asanas.map((asana, index) => (
                    <div className="col-md-4 mb-3" key={index}>
                        <div className="card">
                            <img className="card-img-top" src={asana.image} alt={asana.name} />
                            <div className="card-body">
                                <h5 className="card-title">{asana.name}</h5>
                                <p className="card-description">Description: {asana.description}</p>
                                <p className="card-added-by">Added By: {asana.addedByName}</p>
                                <ul className="card-benefits">
                                    <li>Benefits:</li>
                                    {asana.benefits.map((benefit, index) => (
                                        <li key={index}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AsanaList;
