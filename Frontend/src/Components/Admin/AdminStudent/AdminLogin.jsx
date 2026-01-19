// src/components/AdminLogin.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/admin/login', { password });
      const { token } = response.data;
      // Save the token in local storage or a context/state
      localStorage.setItem('adminToken', token);
      setMessage('Login successful!');
      navigate('/AdminDashboard'); // Navigate to the AdminDashboard route
    } catch (error) {
      setMessage(error.response.data.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminLogin;
