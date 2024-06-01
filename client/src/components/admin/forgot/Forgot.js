// ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error sending password reset email:', error);
            setMessage('Error sending password reset email. Please try again.');
        }
    };

    return (
        <div className="container-forgot-password">
            <div className="forgot-password-container">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="button">Send Reset Link</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}
