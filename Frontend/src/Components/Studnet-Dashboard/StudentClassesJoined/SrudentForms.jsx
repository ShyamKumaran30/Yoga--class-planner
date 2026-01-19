import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentSequence.css'; // Import the CSS file for styling
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const StudentSequence = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/form/student-forms', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setForms(response.data.forms);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student forms:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="student-forms-container"> {/* Apply the CSS class to the container */}
      <h1>Student Forms</h1>
      {forms.map(form => (
        <div key={form._id} className="form">
          <h2>{form.name}</h2>
        
       
          <h3>Suggested Sequences</h3>
          {form.suggestedSequences.map(sequence => (
            <div key={sequence._id} className="sequence">
              <h4>Sequence Name: {sequence.sequenceId.name}</h4>
              <p>Description: {sequence.sequenceId.description}</p>
             
              <p>Sent by: {sequence.suggestedBy.name}</p>
              
              <div className="sequence-images">
                {sequence.sequenceId.asanas.map(asana => (
                  <div key={asana._id} className="asana-info">
                    <img src={asana.image[0]} alt={asana.name} className="asana-image" />
                    <div className="asana-details">
                      <h5>{asana.name}</h5>
                      <p>Benefits: {asana.benefits[0]}</p>
                      <p>Description: {asana.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default StudentSequence;
