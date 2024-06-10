// Login.js
import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      if (response.status === 200 && response.data.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        navigate('/homeadmin');
      } else {
        setMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Error logging in');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="container-login">
      <div className="login-container">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            required 
            className="input" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
            className="input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forgot-password-container">
            <a href="/forgotpassword" className="link">Lupa Password?</a>
          </div>
          <button type="submit" className="button">Masuk</button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
}
