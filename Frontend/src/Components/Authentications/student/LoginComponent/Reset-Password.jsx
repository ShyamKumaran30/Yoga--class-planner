import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long"
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/api/student/reset-password",
        { token, newPassword: password }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="container col-12">
      <div className="card">
        <h5>Reset Password</h5>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
