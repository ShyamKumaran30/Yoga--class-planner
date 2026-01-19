import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post('http://localhost:3001/api/teacher/login', formData);
      console.log("Response: ", response.data);

      setFormData({
        email: '',
        password: '',
      });
      const token = response.data.token;
      sessionStorage.setItem('token', token);
      const profileResponse = await axios.get('http://localhost:3001/api/teacher/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const username = profileResponse.data.name;
      sessionStorage.setItem('user', JSON.stringify(username));
      console.log("username", username);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error: ", error);
      alert("Invalid email or password");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container col-12">
      <div className="card">
        <h5>Login</h5>
        <form onSubmit={handleSubmit}>
          <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button type="button" className="password-toggle-button" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <span>New user? <a href="/teacher-signup">Register</a> here</span>
          <span><a href="/teacher/forgot-password">Forgot Password?</a></span>
          <button type="submit" className="login-button">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
