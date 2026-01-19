import React, { useState } from 'react';
import axios from 'axios';
import './Create-session.css'; 
import Header from '../Header/Header';
import SessionCreatedByUser from './SessionCreatedByUser/SessionCreatedByUser';

const CreateClassSession = () => {
  const [formData, setFormData] = useState({
    className: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    maxCapacity: '',
    venue:''
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const token = sessionStorage.getItem('token');

   
    const currentDate = new Date();
    const selectedDate = new Date(formData.date);
    const currentTime = formData.time.split(':').map(Number);
    if (selectedDate < currentDate || (selectedDate.getTime() === currentDate.getTime() && currentTime[0] < currentDate.getHours())) {
      setMessage({ type: 'error', content: 'Please select a valid future date and time.' });
      return;
    }

    try {

      const response = await axios.post('http://localhost:3001/api/class/create-class', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage({ type: 'success', content: 'Class session created successfully!' });
      setFormData({
        className: '',
        description: '',
        date: '',
        time: '',
        duration: '',
        maxCapacity: '',
        venue:''
      });
    } catch (error) {
      console.error('Error creating class session:', error);
      setMessage({ type: 'error', content: 'Failed to create class session. Please try again.' });
    }
  };

  return (
    <div className="background col-12">
      <Header></Header>
      <div className="class-container col-6">
        <h2>Create Class Session</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="className">Class Name:</label>
          <input
            type="text"
            id="className"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <label htmlFor="duration">Duration (in minutes):</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />

          <label htmlFor="maxCapacity">Max Capacity:</label>
          <input
            type="number"
            id="maxCapacity"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleChange}
            required
          />
            <label htmlFor="venue">Venue:</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
          {message && (
            <div className={`alert ${message.type}`}>
              {message.content}
            </div>
          )}
          <div className="bottom-btn col-12">
            <button className='button col-6' type="submit" style={{position:'relative', left:'11vw'}}>Create Session</button>
          </div>
        </form>
      </div>
      <p>Session created by you</p>
      <SessionCreatedByUser></SessionCreatedByUser>
    </div>
  );
};

export default CreateClassSession;
