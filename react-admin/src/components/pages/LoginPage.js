import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';

function LoginPage({ onLogin }) { // Accept onLogin as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        username,
        password
      });
      setLoginMessage(response.data.message);
      if (response.data.success) {
        onLogin(username, password); // Call onLogin to update the auth state in App.js
        navigate('/dashboard');
      }
    } catch (error) {
      setLoginMessage('Error logging in: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        {loginMessage && <p className="message">{loginMessage}</p>}
        <Link to="/register" className="register-link">Register</Link>
      </div>
    </div>
  );
}

export default LoginPage;
