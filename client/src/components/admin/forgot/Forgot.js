import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showTokenForm, setShowTokenForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post('http://localhost:5000/forgot-password', { email });
            setMessage('Password reset email sent successfully.');
            setShowTokenForm(true); // Menampilkan formulir untuk memasukkan token setelah pengiriman email berhasil
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.message}`);
            } else {
                setMessage('Error sending password reset email.');
            }
        }
    };

    const handleSubmitToken = async (e) => {
        e.preventDefault();
        setShowPasswordForm(true); // Menampilkan formulir untuk memasukkan password baru setelah token dikirim
    };

    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post('http://localhost:5000/reset-password', { email, token, new_password: newPassword });
            setMessage('Password reset successful.');
            setShowTokenForm(false);
            setShowPasswordForm(false);
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.message}`);
            } else {
                setMessage('Error resetting password.');
            }
        }
    };

    return (
        <div className="container-forgot-password">
            <div className="forgot-password-container">
                <h2>Forgot Password</h2>
                {!showTokenForm && !showPasswordForm && (
                    <form onSubmit={handleSubmitEmail}>
                        <label>
                            Email:
                            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </label>
                        <button type="submit" className="button">Submit</button>
                    </form>
                )}
                {showTokenForm && !showPasswordForm && (
                    <form onSubmit={handleSubmitToken}>
                        <label>
                            Token:
                            <input type="text" className="input" value={token} onChange={(e) => setToken(e.target.value)} required />
                        </label>
                        <button type="submit" className="button">Submit Token</button>
                    </form>
                )}
                {showPasswordForm && (
                    <form onSubmit={handleSubmitNewPassword}>
                        <label>
                            New Password:
                            <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </label>
                        <button type="submit" className="button">Reset Password</button>
                    </form>
                )}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}
