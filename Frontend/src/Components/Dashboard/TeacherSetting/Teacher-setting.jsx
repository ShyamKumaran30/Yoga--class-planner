import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherSettings.css';

const TeacherSettings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [message, setMessage] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const token = sessionStorage.getItem('token');

        const response = await axios.get(
          'http://localhost:3001/api/teacher/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { name, email, birthDate } = response.data;
        setName(name);
        setEmail(email);
        setBirthDate(birthDate);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('An error occurred while fetching profile.');
      }
    }
    fetchData();
  }, []);

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await axios.put(
        'http://localhost:3001/api/teacher/update',
        {
          name,
          email,
          password,
          birthDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setIsEditable(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred while updating profile.');
    }
  };

  return (
    <div className="teacher-settings-container">
      <h2>Profile Settings</h2>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditable}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditable}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isEditable}
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Birth Date</label>
          <input
            type="date"
            className="form-control"
            id="birthDate"  
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            disabled={!isEditable}
          />
        </div>
        {isEditable ? (
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={handleEdit}>
            Edit
          </button>
        )}
        <a href='/dashboard'>
          <button type="button" className='btn btn-primary'>Home</button>
        </a>
        {message && <p className="mt-3">{message}</p>}
      </form>
    </div>
  );
};

export default TeacherSettings;
