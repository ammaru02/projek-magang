import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="container-login">
      <div className="login-container">
        <h2>LOGIN</h2>
        <form action="/login" method="post">
          <input type="text" name="username" placeholder="Username" required className="input"/>
          <input type="password" name="password" placeholder="Password" required className="input"/>
          <div className="forgot-password-container">
            <a href="/forgotpassword" className="link">Forgot Password?</a>
          </div>
          <Link to="/homeadmin">
          <button type="submit" className="button">Login</button>
          </Link>
        </form>
      </div>
    </div>
  );
}


