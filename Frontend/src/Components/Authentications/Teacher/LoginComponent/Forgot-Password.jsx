import { useState } from 'react';
import axios from 'axios';

const TeacherForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/teacher/request-password-reset', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error sending password reset email");
    }
  };

  return (
    <div className="container col-12">
      <div className="card">
        <h5>Forgot Password</h5>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default TeacherForgotPassword;
