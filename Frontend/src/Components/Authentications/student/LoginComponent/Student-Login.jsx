import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false // State to manage password visibility
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setFormData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post('http://localhost:3001/api/student/login', formData);
      console.log("Response: ", response.data);

      setFormData({
        email: '',
        password: '',
        showPassword: false // Reset password visibility after successful login
      });
      const token = response.data.token;
      sessionStorage.setItem('token', token);
      const profileResponse = await axios.get('http://localhost:3001/api/student/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const username = profileResponse.data.name;
      sessionStorage.setItem('user', JSON.stringify(username));
      console.log("username", username);
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Login Error: ", error);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="container col-12">
      <div className="card">
        <h5>
          Login
        </h5>
        <form onSubmit={handleSubmit}>
          <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required></input>
          <div className="password-input-group">
            <input type={formData.showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" required></input>
            <button type="button" className="password-toggle-button" onClick={togglePasswordVisibility}>
              {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <span>New user? <a href="/student-signup">Register</a> here</span>
          <span><a href="/forgot-password">Forgot Password?</a></span>
          <button type="submit" className="login-button">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
